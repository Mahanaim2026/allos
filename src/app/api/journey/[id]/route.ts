import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

async function getAuthUser() {
  const supabase = createClient();
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) return { supabase, user };
  } catch {}
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return { supabase, user: session.user };
  return { supabase, user: null };
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await supabase
      .from('journey_entries')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
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
    const { supabase, user } = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.is_favourite !== undefined) updates.is_favourite = body.is_favourite;
    if (body.title !== undefined) updates.title = body.title;
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('journey_entries')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Journey [id] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}