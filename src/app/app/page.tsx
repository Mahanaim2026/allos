'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';
import { createClient } from '@/lib/supabase/client';

const MOODS = ['Anxious','Sad','Weary','Angry','Lonely','Confused','Grateful','Hopeful'];
const STRUGGLES = ['Fear','Resentment','Shame','Doubt','Unforgiveness','Lust','Impatience','Discouragement'];
const LIFE = ['Waiting','Childlessness','Marital conflict','Grief','Parenting','Finances','Betrayal','Unemployment'];
const SPIRIT = ['Comfort','Wisdom','Courage','Repentance','Hope','Peace','Direction','Strength'];
const FORMATS = ['Sermonette','Scripture exhortation','Prayer','Meditation','Declaration','Song / Poem'];
const TONES = ['Gentle','Pastoral','Bold','Reflective','Prophetic'];
const LENGTHS = ['Short','Medium','Deep'];

// Render plain text with paragraph breaks as clean HTML — no markdown symbols
function renderOutput(text: string) {
  if (!text) return null;
  // Strip any residual markdown symbols just in case
  const clean = text
    .replace(/**(.+?)**/g, '$1')
    .replace(/*(.+?)*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.+?)`/g, '$1');

  const paragraphs = clean.split(/\n\n+/).filter(p => p.trim());

  return (
    <div style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', lineHeight: 1.95, color: '#1B3A57' }}>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n').filter(l => l.trim());
        // Numbered declaration lines
        if (lines.every(l => /^\d+\./.test(l.trim()))) {
          return (
            <div key={i} style={{ marginBottom: '1.2em' }}>
              {lines.map((line, j) => (
                <div key={j} style={{ padding: '4px 0', borderLeft: '3px solid #C8943F', paddingLeft: 14, marginBottom: 6 }}>
                  {line.replace(/^\d+\.\s*/, '')}
                </div>
              ))}
            </div>
          );
        }
        // Scripture verse (contains quote marks and a reference like "Romans 12:18")
        if ((para.includes('"') || para.includes('\u201c')) && /[A-Z][a-z]+ \d+:\d+/.test(para)) {
          return (
            <blockquote key={i} style={{ margin: '1.2em 0', paddingLeft: 20, borderLeft: '3px solid #C8943F', fontStyle: 'italic', color: '#2C5573', fontSize: '1.0rem' }}>
              {lines.map((l, j) => <div key={j}>{l}</div>)}
            </blockquote>
          );
        }
        // Poem/song lines (short lines)
        if (lines.length > 2 && lines.every(l => l.length < 80)) {
          return (
            <div key={i} style={{ marginBottom: '1.4em', fontStyle: 'italic', color: '#2C5573' }}>
              {lines.map((l, j) => <div key={j} style={{ lineHeight: 1.6 }}>{l}</div>)}
            </div>
          );
        }
        // Default paragraph
        return <p key={i} style={{ margin: '0 0 1.2em' }}>{para}</p>;
      })}
    </div>
  );
}

const CHIP = (label: string, active: boolean, onClick: () => void) => (
  <button key={label} onClick={onClick}
    style={{ padding: '8px 16px', borderRadius: '100px', border: active ? 'none' : '1px solid #DBE5EE', background: active ? '#1B3A57' : '#F6F9FB', color: active ? '#F6F9FB' : '#54677A', fontSize: '0.85rem', fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', minHeight: 44 }}>
    {label}
  </button>
);
const LABEL = (t: string) => <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: '#6E9CC4', margin: '0 0 12px' }}>{t}</p>;

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
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || '');
        // Try profile first
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        if (profile?.first_name) {
          setUserName(profile.first_name);
        } else if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(' ')[0]);
        } else if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name.split(' ')[0]);
        }
      }
    });
  }, []);

  const generate = async () => {
    setLoading(true);
    setStep(3);
    setResult('');
    setSaved(false);
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

  const copyText = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent('From Allos — ' + format + ':\n\n' + result.substring(0, 500) + '...\n\nhttps://www.word2go.com');
    window.open('https://wa.me/?text=' + text, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(result.substring(0, 220) + '...\n\nvia @AllosApp\nhttps://www.word2go.com');
    window.open('https://twitter.com/intent/tweet?text=' + text, '_blank');
  };

  const reset = () => { setStep(1); setMood(''); setStruggle(''); setLife(''); setSpirit(''); setFormat('Prayer'); setTone('Gentle'); setLength('Medium'); setResult(''); setSaved(false); setCopied(false); };

  const greeting = userName ? 'Welcome back, ' + userName : (userEmail ? 'Welcome back' : '');

  const NAV = (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid #DBE5EE', background: '#F6F9FB', position: 'sticky', top: 0, zIndex: 50 }}>
      <Link href="/" style={{ textDecoration: 'none' }}><AllosLogo size={30} variant="light" showWordmark /></Link>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        {greeting && <span style={{ color: '#54677A', fontSize: '0.85rem', fontWeight: 500 }}>{greeting}</span>}
        <Link href="/journey" style={{ color: '#54677A', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>Journey</Link>
        {userName ? (
          <button onClick={async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/'; }}
            style={{ background: 'none', border: 'none', color: '#54677A', fontSize: '0.82rem', cursor: 'pointer', padding: 0, fontWeight: 500 }}>Sign out</button>
        ) : (
          <Link href="/auth/login" style={{ color: '#54677A', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        )}
      </div>
    </nav>
  );

  // STEP 1
  if (step === 1) return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {LABEL('YOUR SEASON')}
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 300, color: '#1B3A57', margin: '0 0 8px', lineHeight: 1.3 }}>What are you carrying right now?</h1>
          <p style={{ color: '#54677A', fontSize: '0.88rem', margin: 0 }}>Select what feels most true. Nothing is required.</p>
        </div>
        <div style={{ marginBottom: 26 }}>{LABEL('MY MOOD')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{MOODS.map(m => CHIP(m, mood === m, () => setMood(mood === m ? '' : m)))}</div></div>
        <div style={{ marginBottom: 26 }}>{LABEL('A STRUGGLE')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{STRUGGLES.map(s => CHIP(s, struggle === s, () => setStruggle(struggle === s ? '' : s)))}</div></div>
        <div style={{ marginBottom: 26 }}>{LABEL('LIFE CHALLENGE')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{LIFE.map(l => CHIP(l, life === l, () => setLife(life === l ? '' : l)))}</div></div>
        <div style={{ marginBottom: 32 }}>{LABEL('SPIRITUAL NEED')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{SPIRIT.map(s => CHIP(s, spirit === s, () => setSpirit(spirit === s ? '' : s)))}</div></div>
        <button onClick={() => setStep(2)} disabled={!mood && !struggle && !life && !spirit}
          style={{ width: '100%', padding: '14px', background: (!mood && !struggle && !life && !spirit) ? '#DBE5EE' : '#1B3A57', color: (!mood && !struggle && !life && !spirit) ? '#54677A' : '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.95rem', fontWeight: 600, cursor: (!mood && !struggle && !life && !spirit) ? 'not-allowed' : 'pointer' }}>
          Continue
        </button>
      </div>
    </div>
  );

  // STEP 2
  if (step === 2) return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '36px 24px' }}>
        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#54677A', cursor: 'pointer', fontSize: '0.85rem', marginBottom: 20, padding: 0 }}>{'<'} Back</button>
        <div style={{ background: '#E8F0F7', border: '1px solid #DBE5EE', borderRadius: 14, padding: '14px 18px', marginBottom: 28 }}>
          {LABEL('YOUR SEASON')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[mood, struggle, life, spirit].filter(Boolean).map(t => (
              <span key={t} style={{ background: '#1B3A57', color: '#F6F9FB', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>{LABEL('OUTPUT FORMAT')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{FORMATS.map(f => CHIP(f, format === f, () => setFormat(f)))}</div></div>
        <div style={{ marginBottom: 24 }}>{LABEL('TONE')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{TONES.map(t => CHIP(t, tone === t, () => setTone(t)))}</div></div>
        <div style={{ marginBottom: 32 }}>{LABEL('DEPTH')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{LENGTHS.map(l => CHIP(l, length === l, () => setLength(l)))}</div></div>
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
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#1B3A57', borderRadius: '50%', width: 64, height: 64, marginBottom: 20 }}>
              <AllosLogo size={38} variant="dark" />
            </div>
            <p style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.15rem', fontStyle: 'italic', color: '#54677A' }}>Bringing your season before the Word&#8230;</p>
          </div>
        ) : (
          <>
            {/* SEASON TAGS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {[mood, struggle, life, spirit].filter(Boolean).map(t => (
                <span key={t} style={{ background: '#E8F0F7', color: '#1B3A57', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 500, border: '1px solid #DBE5EE' }}>{t}</span>
              ))}
              <span style={{ background: '#C8943F', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600 }}>{format}</span>
              <span style={{ background: '#2C5573', color: '#F6F9FB', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 500 }}>{tone}</span>
            </div>

            {/* RESULT CARD */}
            <div style={{ background: '#fff', border: '1px solid #DBE5EE', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(27,58,87,0.07)', marginBottom: 20 }}>
              {renderOutput(result)}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <button onClick={saveJourney} disabled={saved}
                style={{ flex: '1 1 150px', padding: '12px 16px', background: saved ? '#E8F0F7' : '#1B3A57', color: saved ? '#54677A' : '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 600, cursor: saved ? 'default' : 'pointer', minHeight: 44 }}>
                {saved ? '✓ Saved' : 'Save to Journey'}
              </button>
              <button onClick={reset}
                style={{ flex: '1 1 120px', padding: '12px 16px', background: 'transparent', color: '#1B3A57', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', minHeight: 44 }}>
                New season
              </button>
            </div>

            {/* SHARE BUTTONS */}
            <div style={{ borderTop: '1px solid #DBE5EE', paddingTop: 16 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', margin: '0 0 12px' }}>SHARE</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>

                {/* Copy */}
                <button onClick={copyText}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: copied ? '#E8F0F7' : '#F6F9FB', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', color: copied ? '#2C5573' : '#1B3A57', minHeight: 44 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {copied ? 'Copied!' : 'Copy text'}
                </button>

                {/* WhatsApp */}
                <button onClick={shareWhatsApp}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#F6F9FB', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', color: '#1B3A57', minHeight: 44 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  WhatsApp
                </button>

                {/* X / Twitter */}
                <button onClick={shareTwitter}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#F6F9FB', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', color: '#1B3A57', minHeight: 44 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                  Post on X
                </button>

                {/* Email */}
                <button onClick={() => {
                  const subject = encodeURIComponent('A word for my season — from Allos');
                  const body = encodeURIComponent(format + '\n\n' + result + '\n\nGenerated by Allos — https://www.word2go.com');
                  window.open('mailto:?subject=' + subject + '&body=' + body);
                }}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', background: '#F6F9FB', border: '1px solid #DBE5EE', borderRadius: '100px', fontSize: '0.83rem', fontWeight: 500, cursor: 'pointer', color: '#1B3A57', minHeight: 44 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Email
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
