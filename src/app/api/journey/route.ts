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
      const single = cookieStore.get('sb-' + projectRef + '-auth-token');
      if (single) tokenJson = single.value;
    }
    if (!tokenJson) return null;
    const session = JSON.parse(decodeURIComponent(tokenJson));
    const accessToken = session.access_token;
    if (!accessToken) return null;
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
    const entryTitle = title || (mood ? mood + ' \u2014 ' : 'Season \u2014 ') + new Date().toLocaleDateString();

    const supabase = getSupabaseAdmin();

    // Ensure all required columns exist (add if missing from older table versions)
    await supabase.rpc('exec_sql', {
      sql: `
        DO $$ BEGIN
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS content text; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS notes text; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS life_challenge text; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS spiritual_need text; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS output_type text DEFAULT 'sermonette'; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS tone text DEFAULT 'pastoral'; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS length text DEFAULT 'medium'; EXCEPTION WHEN OTHERS THEN NULL; END;
          BEGIN ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS is_favourite boolean DEFAULT false; EXCEPTION WHEN OTHERS THEN NULL; END;
        END $$;
      `
    }).catch(() => {/* ignore if exec_sql RPC doesn't exist */});

    // Insert with only core columns first
    const insertData: Record<string, unknown> = {
      user_id: userId,
      title: entryTitle,
    };
    if (content !== undefined) insertData.content = content;
    if (mood !== undefined && mood !== null) insertData.mood = mood;
    if (struggle !== undefined && struggle !== null) insertData.struggle = struggle;
    if (lifeChallenge !== undefined && lifeChallenge !== null) insertData.life_challenge = lifeChallenge;
    if (spiritualNeed !== undefined && spiritualNeed !== null) insertData.spiritual_need = spiritualNeed;
    if (outputType !== undefined && outputType !== null) insertData.output_type = outputType;
    if (tone !== undefined && tone !== null) insertData.tone = tone;
    if (length !== undefined && length !== null) insertData.length = length;
    if (notes !== undefined && notes !== null) insertData.notes = notes;

    const { data, error } = await supabase
      .from('journey_entries')
      .insert(insertData)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Journey POST error:', error);
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json({ error: 'Failed to save entry', detail: errMsg }, { status: 500 });
  }
}