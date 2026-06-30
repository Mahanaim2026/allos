'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await fetch('/api/journey');
        const entries = await res.json();
        const found = entries.find((e: any) => e.id === params.id);
        setEntry(found || null);
      } finally {
        setLoading(false);
      }
    }
    fetchEntry();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-allos-cream flex items-center justify-center text-allos-navy/40 font-sans text-sm">Loading...</div>;
  if (!entry) return <div className="min-h-screen bg-allos-cream flex flex-col items-center justify-center gap-4"><p className="font-sans text-allos-navy/60">Entry not found.</p><Link href="/journey" className="text-allos-olive hover:underline text-sm font-sans">Back to Journey</Link></div>;

  return (
    <main className="min-h-screen bg-allos-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-allos-warm">
        <Link href="/" className="text-xl font-serif font-bold text-allos-navy">Allos</Link>
        <Link href="/journey" className="text-sm text-allos-olive hover:text-allos-navy font-sans transition-colors">← Journey</Link>
      </header>
      <div className="max-w-xl mx-auto px-6 py-10">
        <p className="text-xs font-sans text-allos-navy/40 mb-1">{new Date(entry.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <h2 className="text-2xl font-serif font-bold text-allos-navy mb-4">{entry.title}</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {entry.scripture_references?.map((ref: string, i: number) => (
            <span key={i} className="text-xs font-sans bg-allos-gold/10 text-allos-gold border border-allos-gold/20 px-3 py-1 rounded-full">{ref}</span>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-allos-warm p-6">
          <p className="text-allos-navy/80 font-sans text-sm leading-relaxed whitespace-pre-wrap">{entry.generated_text}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/app" className="flex-1 text-center bg-allos-navy text-allos-cream py-3 rounded-lg font-sans text-sm font-medium hover:bg-allos-navy/90 transition-colors">Begin Again</Link>
          <Link href="/journey" className="flex-1 text-center border border-allos-warm text-allos-navy py-3 rounded-lg font-sans text-sm hover:bg-allos-warm transition-colors">← Journey</Link>
        </div>
      </div>
    </main>
  );
}