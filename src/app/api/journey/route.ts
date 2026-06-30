import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('journey_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ entries: data });
  } catch (error) {
    console.error('Journey GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { title, content, mood, struggle, lifeChallenge, spiritualNeed, outputType, tone, length, notes } = body;

    const { data, error } = await supabase
      .from('journey_entries')
      .insert({
        user_id: user.id,
        title: title || \`\${mood || 'Untitled'} — \${new Date().toLocaleDateString()}\`,
        content,
        mood,
        struggle,
        life_challenge: lifeChallenge,
        spiritual_need: spiritualNeed,
        output_type: outputType || 'sermonette',
        tone: tone || 'pastoral',
        length: length || 'medium',
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Journey POST error:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}