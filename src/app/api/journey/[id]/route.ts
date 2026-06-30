import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('journey_entries').select('*').eq('id', params.id).eq('user_id', user.id).single();

    if (error) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    return NextResponse.json({ entry: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.is_favourite !== undefined) updates.is_favourite = body.is_favourite;
    if (body.title !== undefined) updates.title = body.title;

    const { data, error } = await supabase
      .from('journey_entries').update(updates)
      .eq('id', params.id).eq('user_id', user.id).select().single();

    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await supabase
      .from('journey_entries').delete().eq('id', params.id).eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}