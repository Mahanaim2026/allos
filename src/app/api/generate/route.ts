import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

async function checkRateLimit(userId: string): Promise<{ allowed: boolean; resetAt?: Date }> {
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
  if (used < limit) return { allowed: true };

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

export async function POST(request: Request) {
  // Auth wall: unauthenticated users cannot use the generate endpoint
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'unauthenticated', message: 'Create a free account to receive your scripture passage.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Rate limit check
  const rateCheck = await checkRateLimit(userId);
  if (!rateCheck.allowed) {
    return new Response(
      JSON.stringify({ error: 'rate_limited', resetAt: rateCheck.resetAt!.toISOString() }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse request body
  let body: { mood?: string; struggle?: string; life?: string; spirit?: string; format?: string; tone?: string; length?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  const mood = body.mood || '';
  const struggle = body.struggle || '';
  const life = body.life || '';
  const spirit = body.spirit || '';
  const format = body.format || 'Prayer';
  const tone = body.tone || 'Gentle';
  const length = body.length || 'Medium';

  const lengthGuide =
    length === 'Short' ? '150-200 words' :
    length === 'Deep'  ? '500-700 words' :
                         '300-400 words';

  const promptParts = [
    'You are a gifted Christian pastor and writer.',
    'Write a deeply personal, scripture-grounded ' + format.toLowerCase() + ' for someone who is feeling ' + (mood || 'in need of God') + '.',
    struggle ? 'They are wrestling with ' + struggle + '.' : '',
    life ? 'Their life context: ' + life + '.' : '',
    spirit ? 'They are seeking ' + spirit + '.' : '',
    'Tone: ' + tone + '.',
    'Length: ' + lengthGuide + '.',
    'Begin with a relevant scripture reference in full (book, chapter:verse).',
    'Avoid clichés. Write with warmth, depth, and spiritual authority.',
    'Do not use markdown formatting.',
  ];
  const prompt = promptParts.filter(Boolean).join(' ');

  const maxTokens = length === 'Deep' ? 1200 : length === 'Short' ? 500 : 800;

  const encoder = new TextEncoder();
  let fullText = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5',
          max_tokens: maxTokens,
          stream: true,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullText += chunk;
            const sseData = 'data: ' + JSON.stringify({ text: chunk }) + '\n\n';
            controller.enqueue(encoder.encode(sseData));
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

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: msg }) + '\n\n'));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
