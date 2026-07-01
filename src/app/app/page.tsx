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
    React.createElement('div', null,
      ...paragraphs.map((para, i) => {
        const lines = para.split('\n');
        if (para.startsWith('"') || para.startsWith('\u201c') || (para.includes('(') && para.match(/\(\w[^)]+\d+:\d+/))) {
          return React.createElement('blockquote', { key: i, style: { borderLeft: '3px solid #B8832A', paddingLeft: '1rem', margin: '1.2em 0', fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', color: '#1A3F5C', lineHeight: 1.7 } }, para);
        }
        if (lines.length > 2 && lines.every((l: string) => l.length < 80)) {
          return React.createElement('div', { key: i, style: { marginBottom: '1.4em', fontStyle: 'italic', color: '#1A3F5C' } },
            ...lines.map((l: string, j: number) => React.createElement('div', { key: j, style: { lineHeight: 1.6 } }, l))
          );
        }
        return React.createElement('p', { key: i, style: { margin: '0 0 1.2em', color: '#0F2B45' } }, para);
      })
    )
  );
}

function Chip({ label, selected, onClick, small }: { label: string; selected: boolean; onClick: () => void; small?: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  return React.createElement('button', {
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: { padding: small ? '6px 14px' : '10px 18px', borderRadius: 100, border: selected ? '2px solid #0F2B45' : '1.5px solid #C8D8E8', background: selected ? '#0F2B45' : hovered ? '#F0F5FA' : '#FFFFFF', color: selected ? '#FFFFFF' : '#0F2B45', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: small ? '0.82rem' : '0.9rem', fontWeight: selected ? 600 : 400, cursor: 'pointer', minHeight: 44, transition: 'all 0.18s ease', whiteSpace: 'nowrap' as const }
  }, label);
}

function DotPulse() {
  const [v, setV] = React.useState(true);
  React.useEffect(() => { const t = setInterval(() => setV(p => !p), 600); return () => clearInterval(t); }, []);
  return React.createElement('div', { style: { width: 7, height: 7, borderRadius: '50%', background: '#0F2B45', opacity: 0.5, transform: `scale(${v ? 1 : 0})`, transition: 'transform 0.33s ease' } });
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
  return React.createElement('div', { style: { textAlign: 'center', padding: '72px 24px' } },
    React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0F2B45', borderRadius: '50%', width: 48, height: 48, marginBottom: 28 } },
      React.createElement(AllosLogo, { size: 32, variant: 'dark' })
    ),
    React.createElement('p', { style: { fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', fontSize: '1.2rem', color: '#0F2B45', lineHeight: 1.65, transition: 'opacity 0.5s ease', opacity: visible ? 1 : 0 } }, '\u201c', msg.text, '\u201d'),
    React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#B8832A', letterSpacing: '0.04em' } }, '\u2014 ', msg.ref),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 36 } },
      [0,1,2].map(i => React.createElement(DotPulse, { key: i }))
    )
  );
}

function LABEL(s: string) {
  return React.createElement('div', { style: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#4A7299', marginBottom: 8 } }, s);
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
  const [rateLimitMsg, setRateLimitMsg] = useState('');

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
      if (!user) return;
      setUserEmail(user.email || '');
      const { count } = await supabase.from('journey_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
      setJourneyCount(count ?? 0);
      const { data: profile } = await supabase.from('profiles').select('first_name, display_name').eq('id', user.id).single();
      const name = profile?.first_name || profile?.display_name || user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name?.split(' ')[0] || '';
      setUserName(name);
    });
  }, [saved]);

  async function generate() {
    setLoading(true);
    setResult('');
    setSaved(false);
    setRateLimitMsg('');
    localStorage.setItem('allos_prefs', JSON.stringify({ format, tone, length }));
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood || customMood, struggle: struggle || customStruggle, lifeChallenge: life || customLife, spiritualNeed: spirit || customSpirit, format, tone, length }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const msg = data.message || 'You have reached your session limit. Please come back in a few hours.';
        setRateLimitMsg(msg);
        setLoading(false);
        setStep(3);
        return;
      }
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
                if (parsed.error) {
                  setResult(accumulated || parsed.error);
                  done = true;
                  break;
                }
                if (parsed.content) { setResult(parsed.content); done = true; break; }
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
        body: JSON.stringify({
          title,
          content: result,
          mood: mood || customMood,
          struggle: struggle || customStruggle,
          life_challenge: life || customLife,
          spiritual_need: spirit || customSpirit,
          output_type: format.toLowerCase(),
          tone: tone.toLowerCase(),
          length: length.toLowerCase(),
          generated_text: result,
        }),
      });
      setJourneyCount(c => (c ?? 0) + 1);
    } catch { setSaved(false); }
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', border: '1.5px solid #C8D8E8', borderRadius: 12, fontSize: '0.9rem', outline: 'none', color: '#0F2B45', background: '#FFFFFF', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: 8 };

  const navEl = React.createElement('nav', { className: 'allos-nav' },
    React.createElement(AllosLogo, { size: 30, variant: 'light', showWordmark: true }),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      userName && React.createElement('span', { className: 'allos-nav-greeting', style: { fontSize: '0.82rem', color: '#3D5166' } }, 'Hi, ', userName),
      journeyCount !== null && journeyCount > 0 && React.createElement(Link, { href: '/journey', style: { fontSize: '0.82rem', color: '#3D5166', textDecoration: 'none', border: '1px solid #C8D8E8', borderRadius: 100, padding: '6px 14px' } }, journeyCount, ' saved'),
      userEmail
        ? React.createElement('button', { onClick: async () => { const s = createClient(); await s.auth.signOut(); window.location.href = '/'; }, style: { background: 'none', border: 'none', cursor: 'pointer', color: '#3D5166', fontSize: '0.82rem' } }, 'Sign out')
        : React.createElement(Link, { href: '/auth/login', style: { fontSize: '0.82rem', color: '#3D5166', textDecoration: 'none' } }, 'Sign in to save')
    )
  );

  // Step 1 — selector
  const step1 = React.createElement('div', { style: { marginBottom: 32 } },
    React.createElement('div', { style: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#4A7299', marginBottom: 8 } }, 'What season are you in?'),
    React.createElement('h1', { style: { fontFamily: "'Spectral', Georgia, serif", fontWeight: 300, fontSize: 'clamp(22px,5vw,30px)', color: '#0F2B45', margin: '0 0 8px', lineHeight: 1.3 } }, 'Bring your heart before the Word'),
    React.createElement('p', { style: { color: '#3D5166', fontSize: '0.9rem', marginTop: 0 } }, 'Select what feels most true. Nothing is required.'),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 20 } },
      [...MOODS, ...STRUGGLES, ...LIFE, ...SPIRIT].filter((v, i, a) => a.indexOf(v) === i).map(v =>
        React.createElement(Chip, { key: v, label: v, selected: [mood,struggle,life,spirit].includes(v), onClick: () => {
          if (MOODS.includes(v)) setMood(mood === v ? '' : v);
          else if (STRUGGLES.includes(v)) setStruggle(struggle === v ? '' : v);
          else if (LIFE.includes(v)) setLife(life === v ? '' : v);
          else setSpirit(spirit === v ? '' : v);
        }})
      )
    ),
    React.createElement('input', { placeholder: 'Or describe your season in your own words...', value: customMood, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomMood(e.target.value), style: inputStyle }),
    React.createElement('div', { style: { marginTop: 24 } },
      LABEL('Format'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 16 } }, FORMATS.map(f => React.createElement(Chip, { key: f, label: f, selected: format === f, onClick: () => setFormat(f), small: true }))),
      LABEL('Tone'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 16 } }, TONES.map(t => React.createElement(Chip, { key: t, label: t, selected: tone === t, onClick: () => setTone(t), small: true }))),
      LABEL('Length'),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 24 } }, LENGTHS.map(l => React.createElement(Chip, { key: l, label: l, selected: length === l, onClick: () => setLength(l), small: true })))
    ),
    React.createElement('button', {
      onClick: generate,
      disabled: loading,
      style: { background: '#0F2B45', color: '#FFFFFF', border: 'none', borderRadius: 100, padding: '15px 36px', fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', minWidth: 200, opacity: loading ? 0.7 : 1 }
    }, loading ? 'Preparing your word...' : 'Receive the Word')
  );

  // Step 3 — result
  const step3 = React.createElement('div', null,
    rateLimitMsg
      ? React.createElement('div', { style: { background: '#FFF8F0', border: '1px solid #E8C97A', borderRadius: 16, padding: '32px 28px', textAlign: 'center' as const, marginBottom: 24 } },
          React.createElement('div', { style: { fontSize: '2rem', marginBottom: 12 } }, '\u231B'),
          React.createElement('p', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.1rem', color: '#0F2B45', margin: '0 0 8px', fontWeight: 400 } }, 'Your season continues'),
          React.createElement('p', { style: { color: '#5C7A94', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 } }, rateLimitMsg)
        )
      : result && React.createElement('div', { className: 'allos-result-card' },
          React.createElement('div', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', lineHeight: 1.95, color: '#0F2B45' } },
            renderOutput(result)
          ),
          React.createElement('div', { className: 'allos-share-row', style: { marginTop: 28, paddingTop: 20, borderTop: '1px solid #E8EFF6' } },
            !saved
              ? React.createElement('button', { onClick: saveToJourney, style: { background: '#0F2B45', color: '#FFF', border: 'none', borderRadius: 100, padding: '11px 24px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' } }, '\u2661  Save to journey')
              : React.createElement(Link, { href: '/journey', style: { background: '#F0F5FA', color: '#0F2B45', border: '1px solid #C8D8E8', borderRadius: 100, padding: '11px 24px', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', display: 'inline-block' } }, '\u2665  Saved \u2014 view journey'),
            React.createElement('button', { onClick: () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }, style: { background: 'none', border: '1px solid #C8D8E8', borderRadius: 100, padding: '11px 24px', fontSize: '0.85rem', color: '#3D5166', cursor: 'pointer', fontFamily: 'inherit' } }, copied ? 'Copied!' : 'Copy')
          )
        ),
    React.createElement('button', {
      onClick: () => { setStep(1); setResult(''); setSaved(false); setRateLimitMsg(''); setMood(''); setStruggle(''); setLife(''); setSpirit(''); setCustomMood(''); setCustomStruggle(''); setCustomLife(''); setCustomSpirit(''); },
      style: { marginTop: 20, background: 'none', border: '1px solid #C8D8E8', borderRadius: 100, padding: '10px 22px', fontSize: '0.85rem', color: '#3D5166', cursor: 'pointer', fontFamily: 'inherit' }
    }, '\u2190  New season')
  );

  if (step === 3) return React.createElement('div', { style: { minHeight: '100vh', background: '#FFFFFF' } },
    navEl,
    React.createElement('div', { className: 'allos-container', style: { margin: '0 auto', padding: '36px 24px' } },
      loading ? React.createElement(LoadingScreen, null) : step3
    )
  );

  return React.createElement('div', { style: { minHeight: '100vh', background: '#FFFFFF' } },
    navEl,
    React.createElement('div', { className: 'allos-container', style: { margin: '0 auto', padding: '36px 24px' } },
      step1
    )
  );
}
