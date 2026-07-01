'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AllosLogo from '@/components/AllosLogo';
import { createClient } from '@/lib/supabase/client';

interface JourneyEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  struggle?: string;
  life_challenge?: string;
  spiritual_need?: string;
  tone?: string;
  output_type?: string;
  generated_text?: string;
  created_at?: string;
  favorite?: boolean;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user.id).single();
      const name = profile?.display_name || user.user_metadata?.full_name?.split(' ')[0] || '';
      setUserName(name);
      try {
        const res = await fetch('/api/journey');
        if (!res.ok) { setError('Failed to load journey.'); setLoading(false); return; }
        const data = await res.json();
        setEntries(data.entries || []);
      } catch { setError('Failed to load your journey.'); }
      finally { setLoading(false); }
    }
    init();
  }, []);

  async function toggleFavourite(entry: JourneyEntry) {
    const updated = entries.map(e => e.id === entry.id ? { ...e, favorite: !e.favorite } : e);
    setEntries(updated);
    try {
      await fetch(`/api/journey/${entry.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ favorite: !entry.favorite }) });
    } catch { setEntries(entries); }
  }

  async function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
    setDeleteConfirmId(null);
    try { await fetch(`/api/journey/${id}`, { method: 'DELETE' }); } catch {}
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <nav className="allos-nav" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#FFFFFF', borderBottom: '1px solid #C8D8E8' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AllosLogo size={28} />
          <span style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 500, fontSize: '1.1rem', color: '#0F2B45' }}>Allos</span>
        </Link>
        <div className="allos-nav-right">
          <span className="allos-nav-greeting" style={{ color: '#3D5166', fontSize: '0.9rem' }}>
            {userName ? `${userName}'s journey` : 'Your journey'}
          </span>
          <Link href="/app" style={{ color: '#0F2B45', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>New word</Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3D5166', fontSize: '0.9rem' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#4A7299', marginBottom: 6 }}>YOUR JOURNEY</div>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 300, fontSize: 'clamp(26px,4vw,36px)', color: '#0F2B45', margin: '0 0 8px' }}>Scripture for every season</h1>
          <p style={{ color: '#3D5166', fontSize: '0.95rem', marginTop: 8, lineHeight: 1.6 }}>Your saved encounters with the Word.</p>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#3D5166', fontSize: '0.9rem' }}>Loading your journey...</div>}
        {!loading && error && <div style={{ color: '#c0392b', padding: '12px 16px', background: '#fdf2f2', borderRadius: 8 }}>{error}</div>}

        {!loading && !error && entries.length === 0 && (
          <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #C8D8E8', padding: 48, textAlign: 'center', boxShadow: '0 1px 6px rgba(15,43,69,0.05)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
            <h3 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.15rem', fontWeight: 500, color: '#0F2B45', marginBottom: 8 }}>Your journey begins here</h3>
            <p style={{ color: '#3D5166', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>Save your first encounter with Scripture and it will appear here.</p>
            <Link href="/app" style={{ display: 'inline-block', background: '#0F2B45', color: '#FFFFFF', borderRadius: 100, padding: '10px 28px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Receive the Word</Link>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{ position: 'relative' }}>
                {deleteConfirmId === entry.id && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.97)', borderRadius: 16, border: '1px solid #C8D8E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <p style={{ fontFamily: "'Spectral', Georgia, serif", color: '#0F2B45', fontSize: '1rem', textAlign: 'center', margin: '0 24px' }}>Remove this entry from your journey?</p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => deleteEntry(entry.id)} style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 100, padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Remove</button>
                      <button onClick={() => setDeleteConfirmId(null)} style={{ background: 'none', color: '#3D5166', border: '1px solid #C8D8E8', borderRadius: 100, padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                    </div>
                  </div>
                )}
                <Link href={`/entry/${entry.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="allos-entry-card" style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #C8D8E8', padding: '20px 24px', cursor: 'pointer', transition: 'box-shadow 0.15s ease, border-color 0.15s ease', minWidth: 0 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 3px 14px rgba(15,43,69,0.10)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#9BB8D0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#C8D8E8'; }}
                  >
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      {entry.mood && <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4A7299', fontFamily: 'Hanken Grotesk, sans-serif' }}>{entry.mood}</span>}
                      {entry.output_type && <span style={{ fontSize: '0.72rem', color: '#5C7A94', fontFamily: 'Hanken Grotesk, sans-serif' }}>{entry.output_type}</span>}
                    </div>
                    <h3 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', fontWeight: 500, color: '#0F2B45', margin: '0 0 4px' }}>{entry.title}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#3D5166', margin: 0, fontFamily: 'Hanken Grotesk, sans-serif' }}>{formatDate(entry.created_at)}</p>
                    {entry.generated_text && (
                      <p style={{ fontSize: '0.85rem', color: '#1A3F5C', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5, fontFamily: "'Spectral', Georgia, serif" }}>
                        &ldquo;{(entry.generated_text || "").substring(0, 120)}{(entry.generated_text || "").length > 120 ? '...' : ''}&rdquo;
                      </p>
                    )}
                  </div>
                </Link>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, paddingLeft: 4 }}>
                  <button onClick={() => toggleFavourite(entry)} title={entry.favorite ? 'Remove from favourites' : 'Add to favourites'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: entry.favorite ? '#B8832A' : '#C8D8E8', padding: '4px 8px', minHeight: 44 }}>{entry.favorite ? '\u2605' : '\u2606'}</button>
                  <button onClick={() => setDeleteConfirmId(entry.id)} title="Remove from journey" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', color: '#9BB8D0', padding: '4px 8px', minHeight: 44, letterSpacing: '0.02em' }}>\u2715 remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
