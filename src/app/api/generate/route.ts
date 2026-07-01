import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Auth helper: read Supabase session from request cookie (Node.js runtime) ──
async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/);
    if (!match) return null;
    const tokenRaw = decodeURIComponent(match[1]);
    const tokenData = JSON.parse(tokenRaw);
    const accessToken = Array.isArray(tokenData) ? tokenData[0] : tokenData?.access_token;
    if (!accessToken) return null;
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !user) return null;
    return user.id;
  } catch {
    return null;
  }
}

// ─── Rate limit check ──────────────────────────────────────────────────────────
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; resetAt?: Date; remaining?: number }> {
  const windowMs = 3 * 60 * 60 * 1000;
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single();

  const plan = profile?.plan || 'free';
  const limit = plan === 'pro' ? 50 : 5;

  const { count } = await supabaseAdmin
    .from('journey_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart);

  const used = count ?? 0;

  if (used >= limit) {
    const { data: oldest } = await supabaseAdmin
      .from('journey_entries')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', windowStart)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    const resetAt = oldest
      ? new Date(new Date(oldest.created_at).getTime() + windowMs)
      : new Date(Date.now() + windowMs);

    return { allowed: false, resetAt };
  }

  return { allowed: true, remaining: limit - used };
}

export async function POST(request: NextRequest) {
  // ─── Auth wall: guests must sign up to generate ───────────────────────────────
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(
      JSON.stringify({
        error: 'unauthenticated',
        message: 'Create a free account to receive your first scripture passage.',
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ─── Rate limit ───────────────────────────────────────────────────────────────
  const rateCheck = await checkRateLimit(userId);
  if (!rateCheck.allowed) {
    const resetAt = rateCheck.resetAt!;
    return new Response(
      JSON.stringify({
        error: 'rate_limited',
        message: "You've reached your session limit.",
        resetAt: resetAt.toISOString(),
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ─── Parse body ───────────────────────────────────────────────────────────────
  let body: {
    mood?: string; struggle?: string; life?: string; spirit?: string;
    format?: string; tone?: string; length?: string;
  };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  const { mood, struggle, life, spirit, format = 'Prayer', tone = 'Gentle', length = 'Medium' } = body;

  const lengthGuide =
    length === 'Short' ? '150-200 words' :
    length === 'Deep'  ? '500-700 words' :
                         '300-400 words';

  const prompt = `You are a gifted Christian pastor and writer. Write a deeply personal, scripture-grounded ${format.toLowerCase()} for someone who is feeling ${mood || 'in need of God'}.${struggle ? ` They are wrestling with ${struggle}.` : ''}${life ? ` Their life context: ${life}.` : ''}${spirit ? ` They are seeking ${spirit}.` : ''} Tone: ${tone}. Length: ${lengthGuide}. Begin with a relevant scripture reference in full (book, chapter:verse). Avoid clichés. Write with warmth, depth, and spiritual authority. Do not use markdown formatting.`;

  // ─── Stream response ──────────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  let fullText = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: length === 'Deep' ? 1200 : length === 'Short' ? 500 : 800,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}

`));
          }
        }

        if (fullText.trim()) {
          await supabaseAdmin.from('journey_entries').insert({
            user_id: userId,
            mood: mood || null,
            struggle: struggle || null,
            life_context: life || null,
            spiritual_need: spirit || null,
            format,
            tone,
            length_pref: length,
            content: fullText.trim(),
          });
        }

        controller.enqueue(encoder.encode('data: [DONE]

'));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}

`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
