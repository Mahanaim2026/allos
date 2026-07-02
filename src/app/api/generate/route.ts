import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

async function getUserIdFromRequest(): Promise<string | null> {
    try {
          const cookieStore = await cookies();
          const allCookies = cookieStore.getAll();

      // Find the Supabase auth token cookie (handles chunked cookies too)
      // Supabase stores as sb-<ref>-auth-token or sb-<ref>-auth-token.0 etc.
      const authCookies = allCookies
            .filter(c => c.name.match(/^sb-.+-auth-token/))
            .sort((a, b) => a.name.localeCompare(b.name));

      if (authCookies.length === 0) return null;

      // Reassemble chunked cookie if needed
      let tokenRaw = authCookies.map(c => decodeURIComponent(c.value)).join('');

      // Strip base64 prefix if present
      if (tokenRaw.startsWith('base64-')) {
              tokenRaw = Buffer.from(tokenRaw.slice(7), 'base64').toString('utf-8');
      }

      let accessToken: string | null = null;
          try {
                  const parsed = JSON.parse(tokenRaw);
                  accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token || null;
          } catch {
                  // token might be the raw JWT itself
            accessToken = tokenRaw.trim();
          }

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
    const limit = plan === 'pro' ? 10 : 5;

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
  const userId = await getUserIdFromRequest();
    if (!userId) {
          return new Response(
                  JSON.stringify({ error: 'unauthenticated', message: 'Create a free account to receive your personalised scripture passage and save your journey.' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
    }

  // Rate limit check
  const rateCheck = await checkRateLimit(userId);
    if (!rateCheck.allowed) {
          return new Response(
                  JSON.stringify({ error: 'rate_limited', resetAt: rateCheck.resetAt?.toISOString() }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
    }

  // Parse request body
  let body: { mood?: string; struggle?: string; life?: string; spirit?: string; format?: string; tone?: string; length?: string; customMood?: string; customStruggle?: string; customLife?: string; customSpirit?: string };
    try {
          body = await request.json();
    } catch {
          return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 });
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
        'Write a deeply personal, scripture-grounded ' + format.toLowerCase() + ' for someone who needs God\'s word today.',
        struggle ? 'They are wrestling with ' + struggle + '.' : '',
        life ? 'Their life context: ' + life + '.' : '',
        spirit ? 'They are seeking ' + spirit + '.' : '',
        'Tone: ' + tone + '.',
        'Length: ' + lengthGuide + '.',
        'Begin with a key scripture passage (book, chapter and verse). Then write the ' + format.toLowerCase() + '. Do not use headers or markdown.',
      ].filter(Boolean);

  const prompt = promptParts.join('\n');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
        async start(controller) {
                let fullText = '';
                try {
                          const response = await anthropic.messages.stream({
                                      model: 'claude-opus-4-5',
                                      max_tokens: 1024,
                                      messages: [{ role: 'user', content: prompt }],
                          });

                  for await (const chunk of response) {
                              if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                                            const payload = JSON.stringify({ text: chunk.delta.text });
                                            controller.enqueue(encoder.encode('data: ' + payload + '\n\n'));
                                            fullText += chunk.delta.text;
                              }
                  }
                          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                } catch (err) {
                          const msg = err instanceof Error ? err.message : 'Unknown error';
                          controller.enqueue(encoder.encode('data: ' + JSON.stringify({ error: msg }) + '\n\n'));
                } finally {
                          controller.close();

                  if (fullText.trim()) {
                              try {
                                            await supabaseAdmin.from('journey_entries').insert({
                                                            user_id: userId,
                                                            mood: mood === 'Other' ? body.customMood : mood,
                                                            struggle: struggle === 'Other' ? body.customStruggle : struggle,
                                                            life_context: life === 'Other' ? body.customLife : life,
                                                            spiritual_need: spirit === 'Other' ? body.customSpirit : spirit,
                                                            format,
                                                            tone,
                                                            length,
                                                            content: fullText,
                                            });
                              } catch {}
                  }
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
