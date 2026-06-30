'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

interface Entry {
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

export default function EntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<Entry | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/journey/\${params.id}\`)
      .then(r => r.json())
      .then(d => {
        setEntry(d.entry);
        setNotes(d.entry?.notes || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  async function saveNotes() {
    if (!entry) return;
    setSaving(true); setSaved(false);
    await fetch(\`/api/journey/\${entry.id}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function toggleFavourite() {
    if (!entry) return;
    const newVal = !entry.is_favourite;
    setEntry({ ...entry, is_favourite: newVal });
    await fetch(\`/api/journey/\${entry.id}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favourite: newVal }),
    });
  }

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading...</p>
    </div>
  );

  if (!entry) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-slate-500 mb-4">Entry not found or you need to sign in.</p>
      <Link href="/auth/login" className="text-allos-blue text-sm font-medium hover:underline">Sign in</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-6 pt-6 pb-3 flex items-center justify-between max-w-lg mx-auto">
        <Link href="/journey"><AllosLogo size="sm" variant="full" /></Link>
        <button onClick={toggleFavourite} title="Favourite" className="text-xl">
          {entry.is_favourite ? '★' : '☆'}
        </button>
      </nav>

      <main className="flex-1 px-6 py-4 max-w-lg mx-auto w-full">

        {/* Entry header */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 mb-1">{new Date(entry.created_at).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
          <h1 className="text-xl font-serif font-medium text-allos-navy mb-3">{entry.title}</h1>
          {/* Input summary chips */}
          <div className="flex flex-wrap gap-1.5">
            {entry.mood && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{entry.mood}</span>}
            {entry.struggle && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{entry.struggle}</span>}
            {entry.life_challenge && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{entry.life_challenge}</span>}
            {entry.spiritual_need && <span className="bg-allos-sky/20 text-allos-blue px-2.5 py-1 rounded-lg text-xs font-medium">Seeking: {entry.spiritual_need}</span>}
            {entry.output_type && <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-xs">{entry.output_type.replace('_', ' ')}</span>}
            {entry.tone && <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-xs">{entry.tone}</span>}
          </div>
        </div>

        {/* Scripture content */}
        <div className="bg-allos-fog rounded-2xl p-5 mb-8">
          <p className="text-xs font-semibold tracking-wider text-allos-blue uppercase mb-4">Your Word</p>
          <div className="font-serif text-sm text-allos-navy leading-relaxed whitespace-pre-wrap">
            {entry.content}
          </div>
        </div>

        {/* Reflection / Notes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">My Reflection</p>
            {saved && <span className="text-xs text-allos-blue">Saved ✓</span>}
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            onBlur={saveNotes}
            placeholder="What is God speaking to you through this? What do you notice? What will you do? Write freely — this is just for you."
            rows={5}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-allos-navy placeholder:text-slate-300 focus:outline-none focus:border-allos-blue resize-none leading-relaxed"
          />
          <button onClick={saveNotes} disabled={saving}
            className="mt-2 text-xs text-allos-blue hover:underline disabled:opacity-50">
            {saving ? 'Saving...' : 'Save reflection'}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 border-t border-slate-100 pt-6">
          <Link href="/journey" className="flex-1 border border-slate-200 text-slate-500 py-3 rounded-2xl text-sm font-medium text-center hover:bg-slate-50 transition-colors">
            ← Back to Journey
          </Link>
          <Link href="/app" className="flex-1 bg-allos-navy text-white py-3 rounded-2xl text-sm font-medium text-center hover:bg-allos-blue transition-colors">
            New Scripture
          </Link>
        </div>
      </main>
    </div>
  );
}