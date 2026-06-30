import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getUserFromCookies(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    // Supabase splits the JWT across sb-[ref]-auth-token.0, .1, etc.
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '').split('.')[0];
    let tokenJson = '';
    let i = 0;
    while (true) {
      const chunk = cookieStore.get('sb-' + projectRef + '-auth-token.' + i);
      if (!chunk) break;
      tokenJson += chunk.value;
      i++;
    }
    if (!tokenJson) {
      // Try without dot suffix (older format)
      const single = cookieStore.get('sb-' + projectRef + '-auth-token');
      if (single) tokenJson = single.value;
    }
    if (!tokenJson) return null;
    const session = JSON.parse(decodeURIComponent(tokenJson));
    const accessToken = session.access_token;
    if (!accessToken) return null;
    // Decode JWT payload (base64url) to get user id
    const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.sub || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const userId = await getUserFromCookies();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('journey_entries')
      .select('*')
      .eq('user_id', userId)
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
    const userId = await getUserFromCookies();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { title, content, mood, struggle, lifeChallenge, spiritualNeed, outputType, tone, length, notes } = body;
    const entryTitle = title || (mood ? mood + ' — ' : '') + new Date().toLocaleDateString();
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('journey_entries')
      .insert({
        user_id: userId,
        title: entryTitle,
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