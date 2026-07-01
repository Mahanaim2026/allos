import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const results: string[] = [];

  // Method 1: Try pg_notify to reload PostgREST schema cache
  try {
    const { error } = await supabase.rpc('pg_notify', { channel: 'pgrst', payload: 'reload schema' });
    results.push('pg_notify: ' + (error ? error.message : 'ok'));
  } catch(e) {
    results.push('pg_notify exception: ' + String(e));
  }

  // Method 2: Try creating the exec_sql function we need
  // Using a workaround: insert into _exec table if exists
  // Actually - try calling the native pg_catalog.pg_notify function
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL! + '/rest/v1/rpc/pg_notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': 'Bearer ' + process.env.SUPABASE_SERVICE_ROLE_KEY!,
      },
      body: JSON.stringify({ channel: 'pgrst', payload: 'reload schema' }),
    });
    const d = await res.json();
    results.push('rest pg_notify: ' + res.status + ' ' + JSON.stringify(d).substring(0, 100));
  } catch(e) {
    results.push('rest pg_notify error: ' + String(e));
  }

  return NextResponse.json({ results });
}