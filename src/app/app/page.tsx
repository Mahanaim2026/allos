'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { SeasonInput, OutputType, Tone, Length, AllosResponse } from '@/types';

const MOODS = ['Anxious','Sad','Weary','Angry','Lonely','Confused','Grateful','Hopeful'];
const STRUGGLES = ['Fear','Resentment','Shame','Doubt','Unforgiveness','Lust','Impatience','Discouragement'];
const CHALLENGES = ['Waiting','Childlessness','Marital conflict','Grief','Parenting','Finances','Betrayal','Unemployment'];
const NEEDS = ['Comfort','Wisdom','Courage','Repentance','Hope','Peace','Direction','Strength'];
const OUTPUT_TYPES: { value: OutputType; label: string; desc: string }[] = [
  { value: 'sermonette', label: 'Sermonette', desc: 'A short sermon grounded in Scripture' },
  { value: 'exhortation', label: 'Scripture Exhortation', desc: 'Direct encouragement from the Word' },
  { value: "prayer", label: "Prayer", desc: "A guided prayer for your season" },
  { value: "meditation", label: "Meditation", desc: "Slow reflection on God's Word" },
  { value: 'declaration', label: 'Declaration', desc: 'Biblical declarations to speak aloud' },
  { value: 'song', label: 'Song / Poem', desc: 'Worshipful verse for your heart' },
];
const TONES: { value: Tone; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'pastoral', label: 'Pastoral' },
  { value: 'bold', label: 'Bold' },
  { value: 'reflective', label: 'Reflective' },
];
const LENGTHS: { value: Length; label: string }[] = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'deep', label: 'Deep' },
];

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-sans border transition-all ${
        selected
          ? 'bg-allos-navy text-allos-cream border-allos-navy'
          : 'bg-white text-allos-navy border-allos-warm hover:border-allos-navy/40'
      }`}
    >
      {label}
    </button>
  );
}

type Step = 'season' | 'format' | 'response';

export default function AppPage() {
  const [step, setStep] = useState<Step>('season');
  const [season, setSeason] = useState<SeasonInput>({ moods: [], struggles: [], challenges: [], spiritualNeeds: [], customInput: '' });
  const [outputType, setOutputType] = useState<OutputType>('sermonette');
  const [tone, setTone] = useState<Tone>('gentle');
  const [length, setLength] = useState<Length>('medium');
  const [response, setResponse] = useState<AllosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState<'helpful' | 'not_helpful' | null>(null);

  function toggleItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  }

  async function generate() {
    setLoading(true);
    setError('');
    setResponse(null);
    setSaved(false);
    setRating(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season, outputType, tone, length })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data);
      setStep('response');
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function saveToJourney() {
    if (!response) return;
    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: season.moods.join(', '),
          struggle: season.struggles.join(', '),
          challenge: season.challenges.join(', '),
          spiritual_need: season.spiritualNeeds.join(', '),
          custom_input: season.customInput,
          output_type: outputType,
          tone,
          length,
          title: response.title,
          scripture_references: response.scriptureReferences,
          generated_text: response.body,
          helpful_rating: rating,
        })
      });
      if (res.ok) setSaved(true);
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  return (
    <main className="min-h-screen bg-allos-cream">
      <header className="flex items-center justify-between px-6 py-4 border-b border-allos-warm">
        <Link href="/" className="text-xl font-serif font-bold text-allos-navy">Allos</Link>
        <Link href="/journey" className="text-sm text-allos-olive hover:text-allos-navy font-sans transition-colors">Journey</Link>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10">

        {/* Step: Season Input */}
        {step === 'season' && (
          <div>
            <h2 className="text-2xl font-serif font-bold text-allos-navy mb-2">What season are you in?</h2>
            <p className="text-allos-navy/60 text-sm font-sans mb-8">Select what resonates. You can choose multiple or write your own.</p>

            <ChipSection title="Mood" items={MOODS} selected={season.moods}
              onToggle={(item) => setSeason(s => ({ ...s, moods: toggleItem(s.moods, item) }))} />
            <ChipSection title="Struggle" items={STRUGGLES} selected={season.struggles}
              onToggle={(item) => setSeason(s => ({ ...s, struggles: toggleItem(s.struggles, item) }))} />
            <ChipSection title="Life Challenge" items={CHALLENGES} selected={season.challenges}
              onToggle={(item) => setSeason(s => ({ ...s, challenges: toggleItem(s.challenges, item) }))} />
            <ChipSection title="Spiritual Need" items={NEEDS} selected={season.spiritualNeeds}
              onToggle={(item) => setSeason(s => ({ ...s, spiritualNeeds: toggleItem(s.spiritualNeeds, item) }))} />

            <div className="mt-6">
              <label className="block text-sm font-sans font-medium text-allos-navy mb-2">In your own words (optional)</label>
              <textarea
                value={season.customInput}
                onChange={(e) => setSeason(s => ({ ...s, customInput: e.target.value }))}
                placeholder="Describe what you're walking through..."
                className="w-full border border-allos-warm rounded-lg p-4 text-sm font-sans bg-white text-allos-navy placeholder-allos-navy/30 focus:outline-none focus:border-allos-navy/40 resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={() => setStep('format')}
              disabled={season.moods.length === 0 && season.struggles.length === 0 && season.challenges.length === 0 && season.spiritualNeeds.length === 0 && !season.customInput}
              className="mt-8 w-full bg-allos-navy text-allos-cream py-4 rounded-lg font-sans font-medium text-base disabled:opacity-40 hover:bg-allos-navy/90 transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step: Format */}
        {step === 'format' && (
          <div>
            <button onClick={() => setStep('season')} className="text-sm text-allos-olive hover:text-allos-navy font-sans mb-6 block transition-colors">← Back</button>
            <h2 className="text-2xl font-serif font-bold text-allos-navy mb-2">How would you like to receive the Word?</h2>
            <p className="text-allos-navy/60 text-sm font-sans mb-8">Choose your format, tone, and depth.</p>

            <div className="mb-6">
              <p className="text-sm font-sans font-medium text-allos-navy mb-3">Format</p>
              <div className="grid grid-cols-1 gap-3">
                {OUTPUT_TYPES.map(ot => (
                  <button key={ot.value} onClick={() => setOutputType(ot.value)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${outputType === ot.value ? 'border-allos-navy bg-allos-navy/5' : 'border-allos-warm bg-white hover:border-allos-navy/30'}`}
                  >
                    <div>
                      <p className={`font-sans font-medium text-sm ${outputType === ot.value ? 'text-allos-navy' : 'text-allos-navy/80'}`}>{ot.label}</p>
                      <p className="font-sans text-xs text-allos-navy/50 mt-0.5">{ot.desc}</p>
                    </div>
                    {outputType === ot.value && <span className="text-allos-gold text-lg">✦</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm font-sans font-medium text-allos-navy mb-3">Tone</p>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => <Chip key={t.value} label={t.label} selected={tone === t.value} onClick={() => setTone(t.value)} />)}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm font-sans font-medium text-allos-navy mb-3">Depth</p>
              <div className="flex flex-wrap gap-2">
                {LENGTHS.map(l => <Chip key={l.value} label={l.label} selected={length === l.value} onClick={() => setLength(l.value)} />)}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm font-sans mb-4">{error}</p>}

            <button onClick={generate} disabled={loading}
              className="w-full bg-allos-navy text-allos-cream py-4 rounded-lg font-sans font-medium text-base disabled:opacity-60 hover:bg-allos-navy/90 transition-colors"
            >
              {loading ? 'Receiving the Word...' : 'Receive the Word'}
            </button>
          </div>
        )}

        {/* Step: Response */}
        {step === 'response' && response && (
          <div>
            <button onClick={() => setStep('format')} className="text-sm text-allos-olive hover:text-allos-navy font-sans mb-6 block transition-colors">← Back</button>

            <div className="bg-white rounded-2xl border border-allos-warm p-6 mb-6">
              <h2 className="text-xl font-serif font-bold text-allos-navy mb-3">{response.title}</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {response.scriptureReferences?.map((ref, i) => (
                  <span key={i} className="text-xs font-sans bg-allos-gold/10 text-allos-gold border border-allos-gold/20 px-3 py-1 rounded-full">{ref}</span>
                ))}
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-allos-navy/80 font-sans text-sm leading-relaxed whitespace-pre-wrap">{response.body}</p>
                {response.reflection && (
                  <div className="mt-5 pt-5 border-t border-allos-warm">
                    <p className="text-xs font-sans uppercase tracking-widest text-allos-olive mb-2">Reflection</p>
                    <p className="text-allos-navy/70 font-sans text-sm leading-relaxed italic">{response.reflection}</p>
                  </div>
                )}
                {response.prayer && (
                  <div className="mt-5 pt-5 border-t border-allos-warm">
                    <p className="text-xs font-sans uppercase tracking-widest text-allos-olive mb-2">Prayer</p>
                    <p className="text-allos-navy/70 font-sans text-sm leading-relaxed italic">{response.prayer}</p>
                  </div>
                )}
                {response.declaration && (
                  <div className="mt-5 pt-5 border-t border-allos-warm">
                    <p className="text-xs font-sans uppercase tracking-widest text-allos-olive mb-2">Declaration</p>
                    <p className="text-allos-navy/70 font-sans text-sm leading-relaxed">{response.declaration}</p>
                  </div>
                )}
                {response.nextStep && (
                  <div className="mt-5 pt-5 border-t border-allos-warm">
                    <p className="text-xs font-sans uppercase tracking-widest text-allos-olive mb-2">Next Step</p>
                    <p className="text-allos-navy/70 font-sans text-sm leading-relaxed">{response.nextStep}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="flex gap-3 mb-4">
              <button onClick={() => setRating('helpful')}
                className={`flex-1 py-2 rounded-lg text-sm font-sans border transition-all ${rating === 'helpful' ? 'bg-allos-olive text-white border-allos-olive' : 'bg-white text-allos-navy border-allos-warm hover:border-allos-olive'}`}>
                Helpful ✓
              </button>
              <button onClick={() => setRating('not_helpful')}
                className={`flex-1 py-2 rounded-lg text-sm font-sans border transition-all ${rating === 'not_helpful' ? 'bg-allos-clay/20 text-allos-clay border-allos-clay' : 'bg-white text-allos-navy border-allos-warm'}`}>
                Not quite
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button onClick={saveToJourney} disabled={saved}
                className={`w-full py-3 rounded-lg font-sans font-medium text-sm transition-all ${saved ? 'bg-allos-olive/10 text-allos-olive border border-allos-olive/30' : 'bg-allos-navy text-allos-cream hover:bg-allos-navy/90'}`}>
                {saved ? '✓ Saved to Journey' : 'Save to Journey'}
              </button>
              <button onClick={() => { setStep('season'); setResponse(null); setSeason({ moods: [], struggles: [], challenges: [], spiritualNeeds: [], customInput: '' }); }}
                className="w-full py-3 rounded-lg font-sans text-sm text-allos-navy border border-allos-warm hover:bg-allos-warm transition-colors">
                Begin Again
              </button>
              <button onClick={generate}
                className="w-full py-3 rounded-lg font-sans text-sm text-allos-navy/60 hover:text-allos-navy transition-colors">
                ↺ Regenerate
              </button>
            </div>

            <p className="mt-6 text-xs text-allos-navy/40 font-sans text-center leading-relaxed">
              This is Scripture-guided encouragement, not a replacement for church, pastoral care, counseling, medical care, or emergency support.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function ChipSection({ title, items, selected, onToggle }: { title: string; items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-sans font-medium text-allos-navy mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <Chip key={item} label={item} selected={selected.includes(item)} onClick={() => onToggle(item)} />
        ))}
      </div>
    </div>
  );
}