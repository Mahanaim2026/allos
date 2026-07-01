'use client';
import React, { useState, useEffect } from 'react';
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

function renderOutput(text: string) {
  const clean = text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,6}\s/g,'').replace(/^-\s/gm,'').trim();
  const paragraphs = clean.split(/\n\n+/);
  return (
    <div>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n');
        if (para.startsWith('"') || para.startsWith('\u201c') || (para.includes('(') && para.match(/\(\w[^)]+\d+:\d+/))) {
          return (<blockquote key={i} style={{ borderLeft: '3px solid #C8943F', paddingLeft: '1rem', margin: '1.2em 0', fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', color: '#2C5573', lineHeight: 1.7 }}>{para}</blockquote>);
        }
        if (lines.length > 2 && lines.every(l => l.length < 80)) {
          return (<div key={i} style={{ marginBottom: '1.4em', fontStyle: 'italic', color: '#2C5573' }}>{lines.map((l, j) => <div key={j} style={{ lineHeight: 1.6 }}>{l}</div>)}</div>);
        }
        return <p key={i} style={{ margin: '0 0 1.2em' }}>{para}</p>;
      })}
    </div>
  );
}

function Chip({ label, selected, onClick, small }: { label: string; selected: boolean; onClick: () => void; small?: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: small ? '6px 14px' : '10px 18px', borderRadius: 100, border: selected ? '2px solid #1B3A57' : '1.5px solid #C9D8E4', background: selected ? '#1B3A57' : hovered ? '#EEF4FA' : '#fff', color: selected ? '#F6F9FB' : '#1B3A57', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: small ? '0.82rem' : '0.9rem', fontWeight: selected ? 600 : 400, cursor: 'pointer', minHeight: 44, transition: 'all 0.18s ease', whiteSpace: 'nowrap' }}
    >{label}</button>
  );
}

function DotPulse({ delay }: { delay: number }) {
  const [v, setV] = React.useState(true);
  React.useEffect(() => { const t = setInterval(() => setV(p => !p), 600); return () => clearInterval(t); }, []);
  return <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1B3A57', opacity: 0.5, transform: `scale(${v ? 1 : 0})`, transition: 'transform 0.33s ease' }} />;
}

const WAITING_MESSAGES = [
  { text: 'In quietness and trust is your strength.', ref: 'Isaiah 30:15' },
  { text: 'The Lord your God is in your midst \u2014 He will quiet you with His love.', ref: 'Zephaniah 3:17' },
  { text: 'Come to Me, all who are weary, and I will give you rest.', ref: 'Matthew 11:28' },
  { text: 'Cast all your anxiety on Him, for He cares for you.', ref: '1 Peter 5:7' },
  { text: 'The Word of God is living and active.', ref: 'Hebrews 4:12' },
  { text: 'He restores my soul. He guides me in right paths.', ref: 'Psalm 23:3' },
];

function LoadingScreen() {
  const [msgIdx, setMsgIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setMsgIdx(i => (i + 1) % WAITING_MESSAGES.length); setVisible(true); }, 400);
    }, 3800);
    return () => clearInterval(timer);
  }, []);
  const msg = WAITING_MESSAGES[msgIdx];
  return (
    <div style={{ textAlign: 'center', padding: '72px 24px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#1B3A57', borderRadius: '50%', width: 48, height: 48, marginBottom: 28 }}>
        <AllosLogo size={32} variant="dark" />
      </div>
      <p style={{ fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', fontSize: '1.2rem', color: '#1B3A57', lineHeight: 1.65, transition: 'opacity 0.5s ease', opacity: visible ? 1 : 0 }}>&ldquo;{msg.text}&rdquo;</p>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#C8943F', letterSpacing: '0.04em' }}>— {msg.ref}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 }}>{[0,1,2].map((i) => <DotPulse key={i} delay={i * 220} />)}</div>
    </div>
  );
}

function LABEL(s: string) {
  return <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#6E9CC4', marginBottom: 8 }}>{s}</div>;
}

export default function AppPage() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState('');
  const [struggle, setStruggle] = useState('');
  const [life, setLife] = useState('');
  const [spirit, setSpirit] = useState('');
  const [format, setFormat] = useState('Prayer');
  const [tone, setTone] = useState('Gentle');
  const [length, setLength] = useState('Medium');
  const [customMood, setCustomMood] = useState('');
  const [customStruggle, setCustomStruggle] = useState('');
  const [customLife, setCustomLife] = useState('');
  const [customSpirit, setCustomSpirit] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [journeyCount, setJourneyCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('allos_prefs');
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.format && FORMATS.includes(prefs.format)) setFormat(prefs.format);
        if (prefs.tone && TONES.includes(prefs.tone)) setTone(prefs.tone);
        if (prefs.length && LENGTHS.includes(prefs.length)) setLength(prefs.length);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { count } = await supabase.from('journey_entries').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        setJourneyCount(count ?? 0);
        setUserEmail(user.email || '');
        const { data: profile } = await supabase.from('profiles').select('first_name, display_name').eq('id', user.id).single();
        if (profile?.first_name) { setUserName(profile.first_name); }
        else if (user.user_metadata?.full_name) { setUserName(user.user_metadata.full_name.split(' ')[0]); }
        else if (user.user_metadata?.name) { setUserName(user.user_metadata.name.split(' ')[0]); }
      }
    });
  }, [saved]);

  async function generate() {
    setLoading(true);
    setResult('');
    setSaved(false);
    localStorage.setItem('allos_prefs', JSON.stringify({ format, tone, length }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood || customMood, struggle: struggle || customStruggle, lifeChallenge: life || customLife, spiritualNeed: spirit || customSpirit, format, tone, length }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        setResult(err.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') { done = true; break; }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) { accumulated += parsed.text; setResult(accumulated); }
              } catch {}
            }
          }
        }
      }
      if (!accumulated) setResult('Something went wrong. Please try again.');
    } catch {
      setResult('Network error. Please check your connection and try again.');
    }
    setLoading(false);
    setStep(3);
  }

  async function saveToJourney() {
    if (saved || !result) return;
    setSaved(true);
    const moodStr = [mood || customMood, struggle || customStruggle, life || customLife, spirit || customSpirit].filter(Boolean).join(', ');
    const title = moodStr ? `${format} \u2014 ${moodStr}` : format;
    try {
      await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: result, mood: mood || customMood, struggle: struggle || customStruggle, life_challenge: life || customLife, spiritual_need: spirit || customSpirit, format, tone, output_type: format, generated_text: result }),
      });
    } catch { setSaved(false); }
  }

  function copyText() { navigator.clipboard.writeText(result).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }
  function shareWhatsApp() { window.open(`https://wa.me/?text=${encodeURIComponent(result.substring(0,800))}`, '_blank'); }
  function shareX() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.substring(0,280))}`, '_blank'); }
  function shareEmail() { window.open(`mailto:?subject=${encodeURIComponent('A word for you')}&body=${encodeURIComponent(result)}`, '_blank'); }

  const supabase = createClient();

  const NAV = (
    <nav className="allos-nav" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#F6F9FB', borderBottom: '1px solid #E5EDF4' }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <AllosLogo size={28} />
        <span style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 500, fontSize: '1.1rem', color: '#1B3A57' }}>Allos</span>
      </Link>
      <div className="allos-nav-right">
        {userName && <span className="allos-nav-greeting" style={{ color: '#54677A', fontSize: '0.9rem' }}>Welcome back, {userName}</span>}
        <Link href="/journey" style={{ color: '#1B3A57', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}>
          Journey{journeyCount !== null ? ` (${journeyCount})` : ''}
        </Link>
        {userEmail ? (
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#54677A', fontSize: '0.9rem' }}>Sign out</button>
        ) : (
          <Link href="/auth/login" style={{ color: '#1B3A57', fontSize: '0.9rem', textDecoration: 'none' }}>Sign in</Link>
        )}
      </div>
    </nav>
  );

  const customInputStyle = { marginTop: 8, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #C9D8E4', background: '#fff', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#1B3A57', width: '100%', outline: 'none', boxSizing: 'border-box' as const };

  const step2 = (
    <div className="allos-container" style={{ margin: '0 auto', padding: '36px 24px' }}>
      <div style={{ background: '#EEF4FA', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6E9CC4', letterSpacing: '0.1em' }}>YOUR SEASON</span>
        {[mood || customMood, struggle || customStruggle, life || customLife, spirit || customSpirit].filter(Boolean).map(v => (
          <span key={v} style={{ fontSize: '0.82rem', background: '#1B3A57', color: '#F6F9FB', borderRadius: 100, padding: '2px 10px' }}>{v}</span>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>{LABEL('OUTPUT FORMAT')}<div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>{FORMATS.map(f => <Chip key={f} label={f} selected={format === f} onClick={() => setFormat(f)} />)}</div></div>
      <div style={{ marginBottom: 24 }}>{LABEL('TONE')}<div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>{TONES.map(t => <Chip key={t} label={t} selected={tone === t} onClick={() => setTone(t)} />)}</div></div>
      <div style={{ marginBottom: 32 }}>{LABEL('DEPTH')}<div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>{LENGTHS.map(l => <Chip key={l} label={l} selected={length === l} onClick={() => setLength(l)} />)}</div></div>
      <button onClick={generate} style={{ width: '100%', padding: '14px', background: '#1B3A57', color: '#F6F9FB', border: 'none', borderRadius: 100, fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>Receive the Word</button>
    </div>
  );

  const step3 = (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div className="allos-container" style={{ margin: '0 auto', padding: '36px 24px' }}>
        {loading ? <LoadingScreen /> : (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
              {[mood || customMood, format, tone].filter(Boolean).map(v => (
                <span key={v} style={{ fontSize: '0.75rem', fontWeight: 600, background: v === (mood || customMood) ? '#1B3A57' : '#EEF4FA', color: v === (mood || customMood) ? '#F6F9FB' : '#54677A', borderRadius: 100, padding: '4px 12px', fontFamily: 'Hanken Grotesk, sans-serif', letterSpacing: '0.04em' }}>{v}</span>
              ))}
            </div>
            <div className="allos-result-card" style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 16px rgba(27,58,87,0.07)', marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 400, fontSize: 'clamp(22px,5vw,30px)', color: '#1B3A57', marginBottom: 24, lineHeight: 1.3 }}>
                {[mood || customMood, struggle || customStruggle].filter(Boolean).join(' & ') || 'Your word'}
              </h1>
              <div style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', color: '#1B3A57', lineHeight: 1.8 }}>{renderOutput(result)}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <input type="text" placeholder="“What word or phrase from this speaks most to you right now?”" style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: '1.5px solid #DBE5EE', background: '#F6F9FB', fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: '#54677A', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button onClick={() => { setStep(1); setMood(''); setStruggle(''); setLife(''); setSpirit(''); setCustomMood(''); setCustomStruggle(''); setCustomLife(''); setCustomSpirit(''); setResult(''); setSaved(false); }} style={{ flex: 1, padding: '12px', borderRadius: 100, border: '1.5px solid #C9D8E4', background: '#fff', color: '#1B3A57', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', cursor: 'pointer' }}>New season</button>
              <button onClick={saveToJourney} disabled={saved} style={{ flex: 1, padding: '12px', borderRadius: 100, background: saved ? '#54677A' : '#1B3A57', color: '#F6F9FB', border: 'none', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', fontWeight: 600, cursor: saved ? 'default' : 'pointer' }}>{saved ? 'Saved \u2713' : 'Save to Journey'}</button>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#6E9CC4', marginBottom: 10 }}>SHARE</div>
              <div className="allos-share-row" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
                <button onClick={copyText} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 100, border: '1.5px solid #C9D8E4', background: '#fff', color: '#1B3A57', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  {copied ? 'Copied!' : 'Copy text'}
                </button>
                <button className="allos-share-whatsapp" onClick={shareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 100, background: '#25D366', color: '#fff', border: 'none', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.882.5 3.65 1.376 5.172L2 22l4.948-1.353A9.97 9.97 0 0012 22c5.523 0 10-4.477 10-10S17.522 2 11.999 2zm0 18a8 8 0 01-4.073-1.117l-.292-.173-3.016.824.85-2.933-.19-.302A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
                  WhatsApp
                </button>
                <button onClick={shareX} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 100, border: '1.5px solid #C9D8E4', background: '#fff', color: '#1B3A57', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.74-8.857L2.25 2.25h6.877l4.26 5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Post on X
                </button>
                <button onClick={shareEmail} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 100, border: '1.5px solid #C9D8E4', background: '#fff', color: '#1B3A57', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer', minHeight: 44 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (step === 3) return step3;

  return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB' }}>
      {NAV}
      <div className="allos-container" style={{ margin: '0 auto', padding: '36px 24px' }}>
        {step === 1 && (
          <>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#6E9CC4', marginBottom: 8 }}>YOUR SEASON</div>
              <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontWeight: 300, fontSize: 'clamp(22px,5vw,30px)', color: '#1B3A57', marginTop: 0, marginBottom: 8 }}>What are you carrying right now?</h1>
              <p style={{ color: '#54677A', fontSize: '0.9rem', marginTop: 0 }}>Select what feels most true. Nothing is required.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 20 }}>
              {[mood || customMood, struggle || customStruggle, life || customLife, spirit || customSpirit].filter(Boolean).map(v => (
                <span key={v} style={{ fontSize: '0.75rem', fontWeight: 600, background: '#1B3A57', color: '#F6F9FB', borderRadius: 100, padding: '3px 10px', fontFamily: 'Hanken Grotesk, sans-serif' }}>{v}</span>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              {LABEL('MY MOOD')}
              <div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {MOODS.map(m => <Chip key={m} label={m} selected={mood === m} onClick={() => { setMood(mood === m ? '' : m); if (mood !== m) setCustomMood(''); }} />)}
                <Chip label="Other..." selected={!!customMood && !mood} onClick={() => setMood('')} small />
              </div>
              {!mood && <input type="text" value={customMood} onChange={e => setCustomMood(e.target.value)} placeholder="Describe your mood..." style={customInputStyle} maxLength={60} />}
            </div>
            <div style={{ marginBottom: 24 }}>
              {LABEL('A STRUGGLE')}
              <div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {STRUGGLES.map(s => <Chip key={s} label={s} selected={struggle === s} onClick={() => { setStruggle(struggle === s ? '' : s); if (struggle !== s) setCustomStruggle(''); }} />)}
                <Chip label="Other..." selected={!!customStruggle && !struggle} onClick={() => setStruggle('')} small />
              </div>
              {!struggle && <input type="text" value={customStruggle} onChange={e => setCustomStruggle(e.target.value)} placeholder="Describe your struggle..." style={customInputStyle} maxLength={60} />}
            </div>
            <div style={{ marginBottom: 24 }}>
              {LABEL('LIFE CHALLENGE')}
              <div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {LIFE.map(l => <Chip key={l} label={l} selected={life === l} onClick={() => { setLife(life === l ? '' : l); if (life !== l) setCustomLife(''); }} />)}
                <Chip label="Other..." selected={!!customLife && !life} onClick={() => setLife('')} small />
              </div>
              {!life && <input type="text" value={customLife} onChange={e => setCustomLife(e.target.value)} placeholder="Describe your challenge..." style={customInputStyle} maxLength={60} />}
            </div>
            <div style={{ marginBottom: 32 }}>
              {LABEL('SPIRITUAL NEED')}
              <div className="allos-chips" style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                {SPIRIT.map(s => <Chip key={s} label={s} selected={spirit === s} onClick={() => { setSpirit(spirit === s ? '' : s); if (spirit !== s) setCustomSpirit(''); }} />)}
                <Chip label="Other..." selected={!!customSpirit && !spirit} onClick={() => setSpirit('')} small />
              </div>
              {!spirit && <input type="text" value={customSpirit} onChange={e => setCustomSpirit(e.target.value)} placeholder="Describe your spiritual need..." style={customInputStyle} maxLength={60} />}
            </div>
            <button onClick={() => setStep(2)} style={{ width: '100%', padding: '14px', background: '#1B3A57', color: '#F6F9FB', border: 'none', borderRadius: 100, fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>Continue</button>
          </>
        )}
        {step === 2 && step2}
      </div>
    </div>
  );
}
