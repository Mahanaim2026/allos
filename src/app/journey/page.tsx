'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { JourneyEntry } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function JourneyPage() {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('/api/journey');
        if (res.status === 401) {
          setError('sign-in');
          return;
        }
        const data = await res.json();
        setEntries(data);
      } catch (e) {
        setError('Failed to load your journey.');
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  async function toggleFavorite(entry: JourneyEntry) {
    await fetch(`/api/journey/${entry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorite: !entry.favorite })
    });
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, favorite: !e.favorite } : e));
  }

  return (
    <main className="min-h-screen bg-allos-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-allos-warm">
        <Link href="/" className="text-xl font-serif font-bold text-allos-navy">Allos</Link>
        <Link href="/app" className="text-sm text-allos-olive hover:text-allos-navy font-sans transition-colors">+ New</Link>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-serif font-bold text-allos-navy mb-2">Journey With the Word</h2>
        <p className="text-allos-navy/60 text-sm font-sans mb-8">Your saved encounters with Scripture.</p>

        {loading && (
          <div className="text-center py-16 text-allos-navy/40 font-sans text-sm">Loading your journey...</div>
        )}

        {error === 'sign-in' && (
          <div className="bg-white rounded-2xl border border-allos-warm p-8 text-center">
            <p className="text-allos-navy font-serif text-lg mb-2">Sign in to save your journey</p>
            <p className="text-allos-navy/60 font-sans text-sm mb-6">Create an account to save and revisit your Scripture encounters.</p>
            <Link href="/auth/signup" className="bg-allos-navy text-allos-cream px-6 py-3 rounded-lg font-sans text-sm font-medium inline-block hover:bg-allos-navy/90 transition-colors">Create Account</Link>
            <p className="mt-3 text-sm font-sans text-allos-navy/50">Already have one? <Link href="/auth/login" className="text-allos-olive hover:underline">Sign in</Link></p>
          </div>
        )}

        {!loading && error !== 'sign-in' && entries.length === 0 && (
          <div className="bg-white rounded-2xl border border-allos-warm p-8 text-center">
            <p className="text-allos-navy font-serif text-lg mb-2">Your journey begins here</p>
            <p className="text-allos-navy/60 font-sans text-sm mb-6">Bring your heart before the Word and save what speaks to you.</p>
            <Link href="/app" className="bg-allos-navy text-allos-cream px-6 py-3 rounded-lg font-sans text-sm font-medium inline-block hover:bg-allos-navy/90 transition-colors">Begin</Link>
          </div>
        )}

        {entries.length > 0 && (
          <div className="flex flex-col gap-4">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white rounded-2xl border border-allos-warm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-sans text-allos-navy/40 mb-1">{formatDate(entry.created_at)}</p>
                    <h3 className="font-serif font-bold text-allos-navy text-base leading-snug">{entry.title}</h3>
                  </div>
                  <button onClick={() => toggleFavorite(entry)} className={`text-lg transition-colors ${entry.favorite ? 'text-allos-gold' : 'text-allos-navy/20 hover:text-allos-gold'}`}>
                    ✦
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.scripture_references?.map((ref, i) => (
                    <span key={i} className="text-xs font-sans bg-allos-gold/10 text-allos-gold border border-allos-gold/20 px-2 py-0.5 rounded-full">{ref}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.mood && <span className="text-xs font-sans bg-allos-sky/20 text-allos-navy/60 px-2 py-0.5 rounded-full">{entry.mood}</span>}
                  {entry.spiritual_need && <span className="text-xs font-sans bg-allos-olive/10 text-allos-olive px-2 py-0.5 rounded-full">{entry.spiritual_need}</span>}
                  <span className="text-xs font-sans bg-allos-warm text-allos-navy/50 px-2 py-0.5 rounded-full capitalize">{entry.output_type}</span>
                </div>
                <Link href={`/entry/${entry.id}`} className="mt-3 text-xs font-sans text-allos-olive hover:text-allos-navy transition-colors block">Read entry →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}