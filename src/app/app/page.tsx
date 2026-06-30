'use client';
import { useState } from 'react';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

const MOODS = ['Anxious', 'Sad', 'Weary', 'Angry', 'Lonely', 'Confused', 'Grateful', 'Hopeful'];
const STRUGGLES = ['Fear', 'Resentment', 'Shame', 'Doubt', 'Unforgiveness', 'Lust', 'Impatience', 'Discouragement'];
const LIFE_CHALLENGES = ['Waiting', 'Childlessness', 'Marital conflict', 'Grief', 'Parenting', 'Finances', 'Betrayal', 'Unemployment'];
const SPIRITUAL_NEEDS = ['Comfort', 'Wisdom', 'Courage', 'Repentance', 'Hope', 'Peace', 'Direction', 'Strength'];

const OUTPUT_TYPES = [
  { value: 'sermonette', label: 'Sermonette', icon: '📖', desc: 'A short, focused mini-sermon' },
  { value: 'scripture_exhortation', label: 'Scripture', icon: '✦', desc: 'Chosen verses with application' },
  { value: 'prayer', label: 'Prayer', icon: '🙏', desc: 'A personal, heartfelt prayer' },
  { value: 'meditation', label: 'Meditation', icon: '◎', desc: 'Slow contemplation on one passage' },
  { value: 'declaration', label: 'Declaration', icon: '⚡', desc: 'Bold Scripture-based declarations' },
  { value: 'song_poem', label: 'Poem/Song', icon: '♩', desc: 'A devotional lyrical piece' },
];

const TONES = [
  { value: 'gentle', label: 'Gentle', desc: 'Tender & compassionate' },
  { value: 'pastoral', label: 'Pastoral', desc: 'Grounded & caring' },
  { value: 'bold', label: 'Bold', desc: 'Strong & convicting' },
  { value: 'reflective', label: 'Reflective', desc: 'Contemplative & still' },
  { value: 'prophetic', label: 'Prophetic', desc: 'Declaring God\'s word over your season' },
];

const LENGTHS = [
  { value: 'short', label: 'Short', desc: '~150 words' },
  { value: 'medium', label: 'Medium', desc: '~350 words' },
  { value: 'deep', label: 'Deep', desc: '~600 words' },
];

type Step = 'mood' | 'struggle' | 'life' | 'spirit' | 'format' | 'result';

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
        selected
          ? 'bg-allos-navy text-white border-allos-navy shadow-sm'
          : 'bg-white text-allos-navy border-allos-navy/20 hover:border-allos-blue hover:bg-allos-mist/30'
      }`}
    >
      {label}
    </button>
  );
}

function StepHeader({ step, total, title, subtitle }: { step: number; total: number; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all ${i < step ? 'bg-allos-blue' : i === step - 1 ? 'bg-allos-blue' : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <p className="text-xs font-semibold tracking-[0.18em] text-allos-blue uppercase mb-2">Step {step} of {total}</p>
      <h2 className="text-2xl font-serif font-medium text-allos-navy mb-1">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function AppPage() {
  const [step, setStep] = useState<Step>('mood');
  const [mood, setMood] = useState('');
  const [struggle, setStruggle] = useState('');
  const [lifeChallenge, setLifeChallenge] = useState('');
  const [spiritualNeed, setSpiritualNeed] = useState('');
  const [outputType, setOutputType] = useState('sermonette');
  const [tone, setTone] = useState('pastoral');
  const [length, setLength] = useState('medium');
  const [additionalContext, setAdditionalContext] = useState('');
  const [result, setResult] = useState('');
  const [isCrisis, setIsCrisis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps: Step[] = ['mood', 'struggle', 'life', 'spirit', 'format', 'result'];
  const stepNum = steps.indexOf(step) + 1;

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, struggle, lifeChallenge, spiritualNeed, outputType, tone, length, additionalContext }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(data.content);
      setIsCrisis(data.isCrisis || false);
      setStep('result');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep('mood'); setMood(''); setStruggle(''); setLifeChallenge('');
    setSpiritualNeed(''); setResult(''); setIsCrisis(false); setError('');
    setOutputType('sermonette'); setTone('pastoral'); setLength('medium'); setAdditionalContext('');
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="w-full px-6 pt-6 pb-3 flex items-center justify-between max-w-lg mx-auto">
        <Link href="/"><AllosLogo size="sm" variant="full" /></Link>
        <Link href="/journey" className="text-xs font-medium text-allos-blue hover:underline">My Journey</Link>
      </nav>

      <main className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">

        {/* ── STEP 1: Mood ── */}
        {step === 'mood' && (
          <div>
            <StepHeader step={1} total={5} title="How are you feeling?" subtitle="Select the emotion that best describes your heart right now." />
            <div className="flex flex-wrap gap-2.5 mb-8">
              {MOODS.map(m => <Chip key={m} label={m} selected={mood === m} onClick={() => setMood(m)} />)}
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Anything else you want to share? (optional)</label>
              <textarea
                value={additionalContext}
                onChange={e => setAdditionalContext(e.target.value)}
                placeholder="e.g. I've been waiting for a breakthrough for two years..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-allos-navy placeholder:text-slate-300 focus:outline-none focus:border-allos-blue resize-none"
              />
            </div>
            <button onClick={() => setStep('struggle')} disabled={!mood}
              className="w-full bg-allos-navy text-white py-4 rounded-2xl font-medium disabled:opacity-40 hover:bg-allos-blue transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2: Struggle ── */}
        {step === 'struggle' && (
          <div>
            <StepHeader step={2} total={5} title="What are you wrestling with?" subtitle="Choose the spiritual struggle closest to what you're facing." />
            <div className="flex flex-wrap gap-2.5 mb-8">
              {STRUGGLES.map(s => <Chip key={s} label={s} selected={struggle === s} onClick={() => setStruggle(s)} />)}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('mood')} className="flex-1 border border-slate-200 text-slate-500 py-4 rounded-2xl font-medium hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={() => setStep('life')} disabled={!struggle}
                className="flex-[2] bg-allos-navy text-white py-4 rounded-2xl font-medium disabled:opacity-40 hover:bg-allos-blue transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Life Challenge ── */}
        {step === 'life' && (
          <div>
            <StepHeader step={3} total={5} title="What life challenge are you navigating?" subtitle="Select the area of life that weighs most on you right now." />
            <div className="flex flex-wrap gap-2.5 mb-8">
              {LIFE_CHALLENGES.map(l => <Chip key={l} label={l} selected={lifeChallenge === l} onClick={() => setLifeChallenge(l)} />)}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('struggle')} className="flex-1 border border-slate-200 text-slate-500 py-4 rounded-2xl font-medium hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={() => setStep('spirit')} disabled={!lifeChallenge}
                className="flex-[2] bg-allos-navy text-white py-4 rounded-2xl font-medium disabled:opacity-40 hover:bg-allos-blue transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Spiritual Need ── */}
        {step === 'spirit' && (
          <div>
            <StepHeader step={4} total={5} title="What does your spirit need?" subtitle="What are you asking God for in this season?" />
            <div className="flex flex-wrap gap-2.5 mb-8">
              {SPIRITUAL_NEEDS.map(n => <Chip key={n} label={n} selected={spiritualNeed === n} onClick={() => setSpiritualNeed(n)} />)}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('life')} className="flex-1 border border-slate-200 text-slate-500 py-4 rounded-2xl font-medium hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={() => setStep('format')} disabled={!spiritualNeed}
                className="flex-[2] bg-allos-navy text-white py-4 rounded-2xl font-medium disabled:opacity-40 hover:bg-allos-blue transition-colors">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Format ── */}
        {step === 'format' && (
          <div>
            <StepHeader step={5} total={5} title="How do you want to receive this?" subtitle="Choose the format, tone, and depth that speaks to you." />

            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Format</p>
              <div className="grid grid-cols-2 gap-2">
                {OUTPUT_TYPES.map(o => (
                  <button key={o.value} type="button" onClick={() => setOutputType(o.value)}
                    className={`text-left p-3 rounded-xl border transition-all ${outputType === o.value ? 'border-allos-blue bg-allos-mist/40' : 'border-slate-200 hover:border-allos-blue/40'}`}>
                    <span className="text-base mr-1">{o.icon}</span>
                    <span className={`text-sm font-semibold ${outputType === o.value ? 'text-allos-navy' : 'text-slate-600'}`}>{o.label}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{o.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tone</p>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button key={t.value} type="button" onClick={() => setTone(t.value)}
                    className={`px-3 py-2 rounded-xl border text-sm transition-all ${tone === t.value ? 'bg-allos-navy text-white border-allos-navy' : 'border-slate-200 text-slate-600 hover:border-allos-blue'}`}>
                    <span className="font-medium">{t.label}</span>
                    <span className={`block text-xs mt-0 ${tone === t.value ? 'text-white/70' : 'text-slate-400'}`}>{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Depth</p>
              <div className="flex gap-2">
                {LENGTHS.map(l => (
                  <button key={l.value} type="button" onClick={() => setLength(l.value)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${length === l.value ? 'bg-allos-navy text-white border-allos-navy' : 'border-slate-200 text-slate-600 hover:border-allos-blue'}`}>
                    {l.label}
                    <span className={`block text-xs mt-0.5 ${length === l.value ? 'text-white/70' : 'text-slate-400'}`}>{l.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input summary */}
            <div className="bg-allos-fog rounded-2xl p-4 mb-6 text-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your season</p>
              <div className="flex flex-wrap gap-1.5">
                {mood && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{mood}</span>}
                {struggle && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{struggle}</span>}
                {lifeChallenge && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">{lifeChallenge}</span>}
                {spiritualNeed && <span className="bg-allos-mist text-allos-navy px-2.5 py-1 rounded-lg text-xs font-medium">Needs: {spiritualNeed}</span>}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep('spirit')} className="flex-1 border border-slate-200 text-slate-500 py-4 rounded-2xl font-medium hover:bg-slate-50 transition-colors">← Back</button>
              <button onClick={generate} disabled={loading}
                className="flex-[2] bg-allos-navy text-white py-4 rounded-2xl font-medium disabled:opacity-50 hover:bg-allos-blue transition-colors">
                {loading ? 'Finding your Scripture…' : 'Receive Your Word →'}
              </button>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {step === 'result' && (
          <div>
            {isCrisis ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="font-semibold text-red-700 mb-3">Please reach out for support</p>
                <div className="whitespace-pre-wrap text-sm text-red-800">{result}</div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <AllosLogo size="xs" variant="icon" />
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-allos-blue uppercase">Your Word for This Season</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mood && <span className="text-xs text-slate-400">{mood}</span>}
                      {struggle && <span className="text-xs text-slate-300">·</span>}
                      {struggle && <span className="text-xs text-slate-400">{struggle}</span>}
                      {lifeChallenge && <span className="text-xs text-slate-300">·</span>}
                      {lifeChallenge && <span className="text-xs text-slate-400">{lifeChallenge}</span>}
                    </div>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none text-allos-navy leading-relaxed whitespace-pre-wrap font-serif mb-8">
                  {result}
                </div>
                <div className="border-t border-slate-100 pt-6 flex flex-col gap-3">
                  <Link href="/auth/login"
                    className="w-full bg-allos-navy text-white text-center py-4 rounded-2xl font-medium hover:bg-allos-blue transition-colors">
                    Save to My Journey
                  </Link>
                  <button onClick={reset}
                    className="w-full border border-slate-200 text-slate-500 py-3.5 rounded-2xl font-medium hover:bg-slate-50 transition-colors">
                    Start Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
