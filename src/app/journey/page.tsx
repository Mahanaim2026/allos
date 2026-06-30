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
  output_type?: string;
  tone?: string;
  notes?: string;
  is_favourite?: boolean;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      // Fetch display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .single();
      const name = profile?.first_name ||
        user.user_metadata?.full_name?.split(' ')[0] ||
        user.user_metadata?.name?.split(' ')[0] || '';
      setUserName(name);

      // Fetch journey entries
      try {
        const res = await fetch('/api/journey');
        if (!res.ok) { setError('Failed to load journey.'); setLoading(false); return; }
        const data = await res.json();
        setEntries(data.entries || []);
      } catch {
        setError('Failed to load your journey.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  async function toggleFavourite(entry: JourneyEntry) {
    const newVal = !entry.is_favourite;
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, is_favourite: newVal } : e));
    await fetch('/api/journey/' + entry.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favourite: newVal }),
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F6F9FB', fontFamily: "Hanken Grotesk, sans-serif" }}>
      {/* Nav */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid #DBE5EE', background: '#F6F9FB' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <AllosLogo size={32} variant="light" />
          <span style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 500, fontSize: '1.1rem', color: '#1B3A57', letterSpacing: '-0.01em' }}>Allos</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {userName && (
            <span style={{ fontSize: '0.85rem', color: '#54677A', fontFamily: 'Hanken Grotesk, sans-serif' }}>
              Welcome back, {userName}
            </span>
          )}
          <Link href="/app" style={{ fontSize: '0.85rem', color: '#6E9CC4', textDecoration: 'none', fontWeight: 500 }}>+ New season</Link>
          <button onClick={handleSignOut} style={{ fontSize: '0.8rem', color: '#54677A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif' }}>Sign out</button>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Page heading */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', marginBottom: 8, fontFamily: 'Hanken Grotesk, sans-serif' }}>Your journey</div>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 300, fontSize: 'clamp(26px,4vw,36px)', color: '#1B3A57', margin: 0, lineHeight: 1.2 }}>
            Scripture for every season
          </h1>
          <p style={{ color: '#54677A', fontSize: '0.95rem', marginTop: 8, lineHeight: 1.6 }}>Your saved encounters with the Word.</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#54677A', fontSize: '0.9rem' }}>
            Loading your journey...
          </div>
        )}

        {!loading && error && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #DBE5EE', padding: 32, textAlign: 'center' }}>
            <p style={{ color: '#1B3A57', fontFamily: "'Spectral', Georgia, serif", fontSize: '1.1rem', marginBottom: 16 }}>{error}</p>
            <Link href="/auth/login" style={{ display: 'inline-block', background: '#1B3A57', color: '#F6F9FB', borderRadius: 100, padding: '10px 24px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Hanken Grotesk, sans-serif' }}>Sign in</Link>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #DBE5EE', padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
            <p style={{ fontFamily: "'Spectral', Georgia, serif", color: '#1B3A57', fontSize: '1.15rem', marginBottom: 8 }}>Your journey begins here</p>
            <p style={{ color: '#54677A', fontSize: '0.9rem', marginBottom: 24, lineHeight: 1.6 }}>Save your first encounter with Scripture to see it here.</p>
            <Link href="/app" style={{ display: 'inline-block', background: '#1B3A57', color: '#F6F9FB', borderRadius: 100, padding: '10px 24px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Hanken Grotesk, sans-serif' }}>Begin a season</Link>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{ background: '#fff', borderRadius: 16, border: '1px solid #DBE5EE', padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    {entry.mood && <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6E9CC4', fontFamily: 'Hanken Grotesk, sans-serif' }}>{entry.mood}</span>}
                    {entry.output_type && <span style={{ fontSize: '0.72rem', color: '#54677A', fontFamily: 'Hanken Grotesk, sans-serif' }}>· {entry.output_type}</span>}
                  </div>
                  <Link href={'/entry/' + entry.id} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', fontWeight: 500, color: '#1B3A57', margin: '0 0 6px', lineHeight: 1.3 }}>{entry.title}</h3>
                  </Link>
                  <p style={{ fontSize: '0.82rem', color: '#54677A', margin: 0, fontFamily: 'Hanken Grotesk, sans-serif' }}>{formatDate(entry.created_at)}</p>
                  {entry.notes && (
                    <p style={{ fontSize: '0.85rem', color: '#2C5573', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5, fontFamily: "'Spectral', Georgia, serif" }}>
                      "{entry.notes.substring(0, 120)}{entry.notes.length > 120 ? '...' : ''}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleFavourite(entry)}
                  title={entry.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: entry.is_favourite ? '#C8943F' : '#DBE5EE', flexShrink: 0, padding: '0 4px' }}
                >
                  {entry.is_favourite ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}