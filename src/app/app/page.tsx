'use client';
import { useState } from 'react';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

const MOODS = ['Anxious','Sad','Weary','Angry','Lonely','Confused','Grateful','Hopeful'];
const STRUGGLES = ['Fear','Resentment','Shame','Doubt','Unforgiveness','Lust','Impatience','Discouragement'];
const LIFE = ['Waiting','Childlessness','Marital conflict','Grief','Parenting','Finances','Betrayal','Unemployment'];
const SPIRIT = ['Comfort','Wisdom','Courage','Repentance','Hope','Peace','Direction','Strength'];
const FORMATS = ['Sermonette','Scripture exhortation','Prayer','Meditation','Declaration','Song / Poem'];
const TONES = ['Gentle','Pastoral','Bold','Reflective','Prophetic'];
const LENGTHS = ['Short','Medium','Deep'];

const CHIP = (label: string, active: boolean, onClick: () => void) => (
  <button key={label} onClick={onClick}
    style={{ padding: '8px 16px', borderRadius: '100px', border: active ? 'none' : '1px solid #DBE5EE', background: active ? '#1B3A57' : '#F6F9FB', color: active ? '#F6F9FB' : '#54677A', fontSize: '0.85rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
    {label}
  </button>
);

const SECTION_LABEL = (t: string) => (
  <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', margin: '0 0 12px' }}>{t}</p>
);

export default function AppPage() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState('');
  const [struggle, setStruggle] = useState('');
  const [life, setLife] = useState('');
  const [spirit, setSpirit] = useState('');
  const [format, setFormat] = useState('Prayer');
  const [tone, setTone] = useState('Gentle');
  const [length, setLength] = useState('Medium');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = async () => {
    setLoading(true);
    setStep(3);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, struggle, lifeChallenge: life, spiritualNeed: spirit, format, tone, length }),
      });
      const data = await res.json();
      setResult(data.content || data.error || 'Something went wrong. Please try again.');
    } catch {
      setResult('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const saveJourney = async () => {
    try {
      await fetch('/api/journey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mood, struggle, life_challenge: life, spiritual_need: spirit, format, tone, length, content: result }) });
      setSaved(true);
    } catch { /* silent */ }
  };

  const reset = () => { setStep(1); setMood(''); setStruggle(''); setLife(''); setSpirit(''); setFormat('Prayer'); setTone('Gentle'); setLength('Medium'); setResult(''); setSaved(false); };

  const NAV = (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #DBE5EE', background: '#F6F9FB', position: 'sticky', top: 0, zIndex: 50 }}>
      <Link href="/" style={{ textDecoration: 'none' }}><AllosLogo size={32} variant="light" showWordmark /></Link>
      <div style={{ display: 'flex', gap: 16 }}>
        <Link href="/journey" style={{ color: '#54677A', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Journey</Link>
        <Link href="/auth/login" style={{ color: '#54677A', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
      </div>
    </nav>
  );

  // STEP 1 — Season input
  if (step === 1) return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          {SECTION_LABEL('YOUR SEASON')}
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 300, color: '#1B3A57', margin: 0, lineHeight: 1.3 }}>What are you carrying right now?</h1>
          <p style={{ color: '#54677A', fontSize: '0.9rem', marginTop: 8 }}>Select what feels most true. Nothing is required.</p>
        </div>

        {/* MOOD */}
        <div style={{ marginBottom: 28 }}>
          {SECTION_LABEL('MY MOOD')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {MOODS.map(m => CHIP(m, mood === m, () => setMood(mood === m ? '' : m)))}
          </div>
        </div>

        {/* STRUGGLE */}
        <div style={{ marginBottom: 28 }}>
          {SECTION_LABEL('A STRUGGLE')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STRUGGLES.map(s => CHIP(s, struggle === s, () => setStruggle(struggle === s ? '' : s)))}
          </div>
        </div>

        {/* LIFE */}
        <div style={{ marginBottom: 28 }}>
          {SECTION_LABEL('LIFE CHALLENGE')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LIFE.map(l => CHIP(l, life === l, () => setLife(life === l ? '' : l)))}
          </div>
        </div>

        {/* SPIRIT */}
        <div style={{ marginBottom: 36 }}>
          {SECTION_LABEL('SPIRITUAL NEED')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SPIRIT.map(s => CHIP(s, spirit === s, () => setSpirit(spirit === s ? '' : s)))}
          </div>
        </div>

        <button onClick={() => setStep(2)} disabled={!mood && !struggle && !life && !spirit}
          style={{ width: '100%', padding: '14px', background: (!mood && !struggle && !life && !spirit) ? '#DBE5EE' : '#1B3A57', color: (!mood && !struggle && !life && !spirit) ? '#54677A' : '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 600, cursor: (!mood && !struggle && !life && !spirit) ? 'not-allowed' : 'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  );

  // STEP 2 — Format & tone
  if (step === 2) return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#54677A', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 24, padding: 0 }}>
          ← Back
        </button>

        {/* SEASON SUMMARY */}
        <div style={{ background: '#E8F0F7', border: '1px solid #DBE5EE', borderRadius: 14, padding: '16px 20px', marginBottom: 32 }}>
          {SECTION_LABEL('YOUR SEASON')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[mood, struggle, life, spirit].filter(Boolean).map(t => (
              <span key={t} style={{ background: '#1B3A57', color: '#F6F9FB', padding: '4px 12px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          {SECTION_LABEL('OUTPUT FORMAT')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {FORMATS.map(f => CHIP(f, format === f, () => setFormat(f)))}
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          {SECTION_LABEL('TONE')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TONES.map(t => CHIP(t, tone === t, () => setTone(t)))}
          </div>
        </div>
        <div style={{ marginBottom: 36 }}>
          {SECTION_LABEL('DEPTH')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LENGTHS.map(l => CHIP(l, length === l, () => setLength(l)))}
          </div>
        </div>

        <button onClick={generate} style={{ width: '100%', padding: '14px', background: '#1B3A57', color: '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>
          Receive the Word
        </button>
      </div>
    </div>
  );

  // STEP 3 — Result
  return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#1B3A57', borderRadius: '50%', width: 64, height: 64, marginBottom: 20 }}>
              <AllosLogo size={38} variant="dark" />
            </div>
            <p style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#54677A' }}>Bringing your season before the Word&hellip;</p>
          </div>
        ) : (
          <>
            {/* SEASON TAGS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {[mood, struggle, life, spirit].filter(Boolean).map(t => (
                <span key={t} style={{ background: '#E8F0F7', color: '#1B3A57', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500, border: '1px solid #DBE5EE' }}>{t}</span>
              ))}
              <span style={{ background: '#C8943F', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>{format}</span>
            </div>

            {/* RESULT CARD */}
            <div style={{ background: '#fff', border: '1px solid #DBE5EE', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(27,58,87,0.07)', marginBottom: 24 }}>
              <div style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', lineHeight: 1.9, color: '#1B3A57', whiteSpace: 'pre-wrap' }}>
                {result}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={saveJourney} disabled={saved}
                style={{ flex: 1, padding: '12px 20px', background: saved ? '#E8F0F7' : '#1B3A57', color: saved ? '#54677A' : '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, cursor: saved ? 'default' : 'pointer', minWidth: 160 }}>
                {saved ? 'Saved to Journey' : 'Save to Journey'}
              </button>
              <button onClick={reset}
                style={{ flex: 1, padding: '12px 20px', background: 'transparent', color: '#1B3A57', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', minWidth: 140 }}>
                New season
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
