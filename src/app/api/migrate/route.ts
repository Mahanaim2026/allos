import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Add missing columns via individual INSERT tries to detect actual schema
    const testResult: string[] = [];

    // Try to find actual columns by attempting inserts
    const { error: e1 } = await supabase
      .from('journey_entries')
      .insert({ user_id: '00000000-0000-0000-0000-000000000000', title: '_schema_test', content: '_test' })
      .select();
    testResult.push('content column: ' + (e1 ? e1.message : 'exists'));

    const { error: e2 } = await supabase
      .from('journey_entries')
      .insert({ user_id: '00000000-0000-0000-0000-000000000000', title: '_schema_test2', output_type: 'test' })
      .select();
    testResult.push('output_type: ' + (e2 ? e2.message : 'exists'));

    return NextResponse.json({ testResult });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}