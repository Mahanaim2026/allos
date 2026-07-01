import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projectRef = 'jppcqzmuujqlvabwylzw';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Use Supabase Management API to run SQL
    // This requires a Management API token (personal access token), not service role key
    // Instead, use the REST API workaround: create missing columns via a raw query
    
    // Use the postgres RPC approach via the REST API with service role
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    
    const sqls = [
      'ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS content text',
      'ALTER TABLE journey_entries ADD COLUMN IF NOT EXISTS notes text',
    ];
    
    const results = [];
    for (const sql of sqls) {
      // Use Supabase's pg endpoint
      const res = await fetch(baseUrl + '/rest/v1/rpc/exec_sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': 'Bearer ' + serviceKey,
        },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      results.push({ sql: sql.substring(0, 60), status: res.status, data: JSON.stringify(data).substring(0,100) });
    }
    
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}