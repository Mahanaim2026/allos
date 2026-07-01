import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const results: string[] = [];

  // Step 1: Try to create exec_sql function
  const createFnSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;

  // Use raw postgres via supabase-js v2 experimental sql tag
  // Or use the rpc with an existing function

  // Actually use the query method if available in the admin client
  try {
    // @ts-ignore - direct sql execution
    const { error: fnError } = await (supabase as any).rpc('query', { query: createFnSql });
    results.push('create fn: ' + (fnError ? fnError.message : 'ok'));
  } catch(e) {
    results.push('create fn exception: ' + String(e));
  }

  // Step 2: Try ALTER TABLE via supabase schema editor API
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  // Use Supabase's internal pg endpoint
  const alterSqls = [
    'ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS content text',
    'ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS notes text',
  ];
  
  for (const sql of alterSqls) {
    try {
      const res = await fetch(baseUrl + '/pg/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + serviceKey,
          'X-Connection-Encrypted': 'true',
        },
        body: JSON.stringify({ query: sql }),
      });
      const d = await res.json();
      results.push(sql.substring(0,50) + ': ' + res.status + ' ' + JSON.stringify(d).substring(0,100));
    } catch(e) {
      results.push(sql.substring(0,50) + ': error ' + String(e));
    }
  }

  return NextResponse.json({ results });
}