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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserFromCookies();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('journey_entries')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();
    if (error) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Journey [id] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserFromCookies();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const updates: Record<string, unknown> = {};
    // notes column not in this table schema - skip
    if (body.favorite !== undefined) updates.favorite = body.favorite;
    if (body.title !== undefined) updates.title = body.title;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('journey_entries')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Journey [id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    try {
          const userId = await getUserFromCookies();
          if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
          const supabase = getSupabaseAdmin();
          const { error } = await supabase
            .from('journey_entries')
            .delete()
            .eq('id', params.id)
            .eq('user_id', userId);
          if (error) throw error;
          return NextResponse.json({ success: true });
    } catch (error) {
          console.error('Journey [id] DELETE error:', error);
          return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}
