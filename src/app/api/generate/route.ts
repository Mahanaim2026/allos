import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are Allos, a Scripture-guided Christian encouragement assistant. Help users reflect on their current season through biblical wisdom, prayer, meditation, and encouragement. Keep the tone warm, reverent, emotionally aware, and Scripture-first. Always cite 2-4 real Scripture references clearly (book, chapter, verse). Do not invent Bible verses. Do not claim direct divine speech, prophecy, diagnosis, or guaranteed outcomes. Do not say "God told me" or speak as God. Do not provide medical, legal, financial, or licensed counseling advice. Encourage users to seek trusted pastoral, professional, or emergency help for serious issues. If the user mentions self-harm, abuse, violence, immediate danger, or crisis, stop ordinary devotional generation and prioritize safety by providing crisis resources (988 in the US). Use World English Bible or KJV translations for any quoted Scripture. Return your response as a JSON object with these exact fields: title (string), scriptureReferences (array of strings like ["John 3:16", "Psalm 23:1"]), body (string with the main content using \\n for line breaks), reflection (string, optional), prayer (string, optional), declaration (string, optional), nextStep (string, optional). Return ONLY valid JSON, no markdown, no extra text.`;

const CRISIS_KEYWORDS = ['suicide', 'kill myself', 'self-harm', 'self harm', 'hurt myself', 'end my life', 'want to die', 'abuse', 'violence', 'emergency'];

function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

const CRISIS_RESPONSE = {
  title: 'You Are Not Alone',
  scriptureReferences: ['Psalm 34:18', 'Matthew 11:28'],
  body: 'What you are carrying sounds very heavy, and I want you to know that you matter deeply. Before anything else, please reach out for immediate support.',
  prayer: 'Lord, be close to this heart right now. You are near to the brokenhearted. Bring help, bring peace, bring hope.',
  nextStep: 'Please contact the 988 Suicide and Crisis Lifeline by calling or texting 988 (US). If you are in immediate danger, call 911 or your local emergency number. Please also reach out to a trusted person — a pastor, counselor, or friend — right now.'
};

export async function POST(request: NextRequest) {
  try {
    const { season, outputType, tone, length } = await request.json();

    const allText = [
      ...(season.moods || []),
      ...(season.struggles || []),
      ...(season.challenges || []),
      ...(season.spiritualNeeds || []),
      season.customInput || ''
    ].join(' ');

    if (detectCrisis(allText)) {
      return NextResponse.json(CRISIS_RESPONSE);
    }

    const lengthGuide = length === 'short' ? '150-250 words' : length === 'medium' ? '300-450 words' : '500-700 words';
    const toneGuide = tone === 'gentle' ? 'warm, gentle, and compassionate' : tone === 'pastoral' ? 'pastoral, caring, and instructive' : tone === 'bold' ? 'bold, direct, and encouraging' : 'reflective, contemplative, and quiet';

    const userPrompt = `The user is in this season:
- Moods: \${season.moods?.join(', ') || 'none specified'}
- Struggles: \${season.struggles?.join(', ') || 'none specified'}
- Life challenges: \${season.challenges?.join(', ') || 'none specified'}
- Spiritual needs: \${season.spiritualNeeds?.join(', ') || 'none specified'}
- Their own words: \${season.customInput || 'none'}

Please write a \${outputType} in a \${toneGuide} tone. Length: \${lengthGuide}.

Output type instructions:
- sermonette: title, key scriptures, opening encouragement, biblical insight, application, short prayer, one reflection question
- exhortation: title, scriptures, direct encouragement, practical next step, closing blessing
- prayer: scriptures, guided prayer, optional breath prayer, one next step
- meditation: scriptures, slow devotional reflection, three reflection prompts, short prayer
- declaration: scriptures, 5-7 first-person declarations in biblical language, closing prayer
- song: scriptures, original worshipful poem or song-like text, keep it reverent and simple

Return ONLY valid JSON.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Clean up any markdown code fences if present
    const cleaned = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 });
  }
}