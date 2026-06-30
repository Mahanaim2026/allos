import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Crisis keywords — always intercept before generation
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'self harm', 'hurt myself',
  'want to die', 'don\'t want to live', 'abuse', 'being abused', 'emergency',
];

function hasCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

// Map tone to pastoral instruction
const TONE_INSTRUCTION: Record<string, string> = {
  gentle: 'Speak with great tenderness and gentleness, as a loving parent to a hurting child. Soft, warm, compassionate.',
  pastoral: 'Speak as a wise, experienced pastor who knows Scripture deeply and cares for this person\'s soul. Grounded, caring, ministerial.',
  bold: 'Speak with holy boldness and conviction — strong, direct, Spirit-filled courage. Challenge and strengthen the reader.',
  reflective: 'Speak slowly and contemplatively, like a spiritual director guiding someone into stillness. Meditative, unhurried, deep.',
  prophetic: 'Speak with prophetic weight and holy urgency — Scripture as a living word over this person\'s season. Speak to their future, not just their present. Declare what God says about this moment.',
};

// Map output type to format instruction
const FORMAT_INSTRUCTION: Record<string, string> = {
  sermonette: 'Write a short, focused mini-sermon (3–4 paragraphs). Open with the Scripture, unpack its meaning for this person\'s specific situation, then close with a word of encouragement.',
  scripture_exhortation: 'Provide 3–5 carefully chosen Scripture passages with brief, personal application for each — directly speaking to the person\'s stated season. Each Scripture should feel hand-picked, not generic.',
  prayer: 'Write a personal, heartfelt prayer in first person ("Lord, I come to you...") that specifically names the person\'s mood, struggle, life challenge, and spiritual need. It should feel written for them alone.',
  meditation: 'Write a slow, contemplative meditation on one key Scripture passage. Guide the reader to sit with the text, notice what it says, and let it speak to their current season. 3–4 gentle paragraphs.',
  declaration: 'Write 5–8 bold, Scripture-based declarations in first person ("I declare that...") that directly counter the mood, struggle, and life challenge the person shared. Each declaration should feel like a sword of the Spirit.',
  song_poem: 'Write a short, original devotional poem or lyrical piece (3–4 stanzas) inspired by Scripture, that speaks directly to the emotional and spiritual season the person described.',
};

// Map length to word count instruction
const LENGTH_INSTRUCTION: Record<string, string> = {
  short: 'Keep it concise and focused — approximately 150–200 words total.',
  medium: 'Write a full, satisfying response — approximately 300–400 words.',
  deep: 'Go deep and thorough — approximately 500–700 words. Do not rush. Let the Scripture breathe.',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      mood = '',
      struggle = '',
      lifeChallenge = '',
      spiritualNeed = '',
      outputType = 'sermonette',
      tone = 'pastoral',
      length = 'medium',
      additionalContext = '',
    } = body;

    // Combine all free-text fields for crisis check
    const allText = [mood, struggle, lifeChallenge, spiritualNeed, additionalContext].join(' ');
    if (hasCrisis(allText)) {
      return NextResponse.json({
        content: `Before we continue, your words matter and so do you.

If you are in crisis, experiencing thoughts of self-harm or suicide, or in an emergency situation — please reach out now:

**988 Suicide & Crisis Lifeline:** Call or text 988 (US)
**Crisis Text Line:** Text HOME to 741741
**Emergency Services:** Call 911

You are not alone. There is help, and there is hope.

"He heals the brokenhearted and binds up their wounds." — Psalm 147:3`,
        isCrisis: true,
      });
    }

    // Build the user's season summary for the opening
    const seasonParts: string[] = [];
    if (mood) seasonParts.push(`feeling ${mood.toLowerCase()}`);
    if (struggle) seasonParts.push(`wrestling with ${struggle.toLowerCase()}`);
    if (lifeChallenge) seasonParts.push(`navigating ${lifeChallenge.toLowerCase()}`);
    if (spiritualNeed) seasonParts.push(`seeking ${spiritualNeed.toLowerCase()}`);
    const seasonSummary = seasonParts.length > 0
      ? seasonParts.join(', ')
      : 'their current season';

    const toneInstruction = TONE_INSTRUCTION[tone.toLowerCase()] || TONE_INSTRUCTION.pastoral;
    const formatInstruction = FORMAT_INSTRUCTION[outputType.toLowerCase().replace(/[^a-z_]/g, '_')] || FORMAT_INSTRUCTION.sermonette;
    const lengthInstruction = LENGTH_INSTRUCTION[length.toLowerCase()] || LENGTH_INSTRUCTION.medium;

    const systemPrompt = `You are Allos — a Scripture-grounded devotional companion. You are NOT an AI chatbot, NOT an AI pastor, and NOT a prophet. You are a faithful servant of the Word who holds Scripture out to people and lets God speak through it.

ABSOLUTE RULES — never break these:
- Never invent, paraphrase, or misquote Bible verses. Only use real, verifiable Scripture from the World English Bible (WEB) or KJV.
- Never claim to speak as God, never say "God told me" or "thus says the Lord" as direct prophecy.
- Never diagnose mental health conditions, give medical/legal/financial advice, or make guaranteed promises.
- Never shame the user. Never project emotions they have not expressed.
- If the user is in crisis, do not generate devotional content — escalate to 988.
- Always cite Scripture with book, chapter, and verse (e.g., John 14:16 WEB).

TONE: ${toneInstruction}
FORMAT: ${formatInstruction}
LENGTH: ${lengthInstruction}

CRITICAL — INPUT REFLECTION:
The very first thing you must do is write a brief, warm 1–2 sentence acknowledgement that shows you have heard and understood the person's specific season. Name their exact inputs back to them naturally (mood, struggle, life challenge, spiritual need). This opening should feel like a trusted friend saying "I hear you — here is what Scripture says for exactly this moment." Then proceed into the ${outputType} itself.

Do not write generic encouragement. Every sentence should be directly tied to the specific inputs provided. A reader should be able to see themselves clearly in what you write.`;

    const userPrompt = `Please create a ${outputType} for someone who is ${seasonSummary}.

Their specific inputs:
- Mood/Emotion: ${mood || 'not specified'}
- Struggle/Sin: ${struggle || 'not specified'}
- Life Challenge: ${lifeChallenge || 'not specified'}
- Spiritual Need: ${spiritualNeed || 'not specified'}
- Output type requested: ${outputType}
- Tone requested: ${tone}
- Depth requested: ${length}
${additionalContext ? `- Additional context they shared: "${additionalContext}"` : ''}

Remember: Open with a warm 1–2 sentence reflection that names their season specifically. Then deliver the ${outputType} with Scripture woven throughout, directly tied to their inputs.`;

    const anthropic = client();
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const content_text = response.content[0].type === 'text' ? response.content[0].text : '';

    return NextResponse.json({
      content: content_text,
      isCrisis: false,
      inputs: { mood, struggle, lifeChallenge, spiritualNeed, outputType, tone, length },
    });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
