import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'self-harm',
  'cut myself', 'abuse', 'being abused', 'hurt myself', 'no reason to live'
];

const CRISIS_RESPONSE = `Your safety matters deeply. Please reach out right now:
National Suicide & Crisis Lifeline: Call or text 988 (US)
Crisis Text Line: Text HOME to 741741
You are not alone. Please talk to someone you trust, or go to your nearest emergency room if you are in immediate danger.
Allos cannot provide crisis support — but real help is available, and you are worth it.`;

const TONE_MAP: Record<string, string> = {
  Gentle: 'warm, tender, quietly encouraging — like a trusted friend speaking softly',
  Pastoral: 'pastoral and shepherding — like a wise elder guiding a congregation',
  Bold: 'bold and direct — speaking truth with conviction and holy confidence',
  Reflective: 'contemplative and meditative — inviting stillness and deep inner reflection',
  Prophetic: 'prophetic and Spirit-led — speaking with spiritual authority and urgency, calling the reader forward',
};

const FORMAT_MAP: Record<string, string> = {
  'Prayer': 'a heartfelt conversational prayer addressed directly to God, incorporating the user inputs naturally',
  'Sermonette': 'a short devotional sermonette (3-5 paragraphs): open with a Scripture, apply it to the season, close with hope',
  'Scripture exhortation': 'a direct Scripture-based exhortation: quote 2-3 relevant Bible verses, then briefly speak to each one in light of the season',
  'Meditation': 'a slow, contemplative meditation: invite the reader into stillness, speak gently through one key Scripture passage',
  'Declaration': 'a series of first-person faith declarations (I am / I have / I will) grounded in specific Scripture references',
  'Song / Poem': 'a short worshipful poem or song lyric (3-4 stanzas) that flows naturally, reflecting the mood and Scripture',
};

const LENGTH_MAP: Record<string, string> = {
  Short: 'Keep it brief — 120-180 words total.',
  Medium: 'Medium length — 220-320 words total.',
  Deep: 'Deep and full — 380-500 words total.',
};

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { mood, struggle, lifeChallenge, spiritualNeed, format, tone, length } = await request.json();
    const inputText = [mood, struggle, lifeChallenge, spiritualNeed].filter(Boolean).join(', ');

    if (CRISIS_KEYWORDS.some(k => inputText.toLowerCase().includes(k))) {
      return NextResponse.json({ content: CRISIS_RESPONSE });
    }

    const toneDesc = TONE_MAP[tone] || TONE_MAP['Gentle'];
    const formatDesc = FORMAT_MAP[format] || FORMAT_MAP['Prayer'];
    const lengthDesc = LENGTH_MAP[length] || LENGTH_MAP['Medium'];

    const systemPrompt = `You are Allos — a Scripture-guided Christian encouragement companion. You speak with warmth, wisdom, and reverence.
CRITICAL OUTPUT RULES — READ CAREFULLY:
1. Output PLAIN TEXT only. Do NOT use any markdown: no asterisks (*), no bold (**text**), no italics (*text*), no hashtags (#), no bullet dashes (-), no backticks, no headers.
2. For Scripture quotes, write them naturally inline: use only straight quotation marks and the reference in parentheses after.
3. Use paragraph breaks (double newline) to separate sections.
4. For declarations, number them: "1. I am..." on its own line.
5. For a poem/song, use line breaks naturally. No asterisks for emphasis — let the words carry the weight.
6. Never use markdown formatting of any kind.
SAFETY RULES:
- Never invent or paraphrase Bible verses as if they are direct quotes. Only quote verses that genuinely exist.
- Only use World English Bible (WEB) or KJV translations.
- Never claim to speak as God or claim direct divine revelation.
- Never diagnose, prescribe, or give medical/legal/financial advice.
- Never shame the user.`;

    const userPrompt = `The user is in this season: ${inputText}.
Open with a single sentence that mirrors their season back to them — e.g. "You are carrying [mood/struggle/challenge], and the Word speaks directly into that."
Then write ${formatDesc}.
Tone: ${toneDesc}.
${lengthDesc}
Scripture references must be real WEB or KJV verses, quoted accurately in plain text.`;

    const ai = client();

    const stream = await ai.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({ text: chunk.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: unknown) {
    console.error('Generate error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred generating your response.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
