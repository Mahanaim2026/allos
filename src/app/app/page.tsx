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
const ls = para.split('\n');
if (para.startsWith('"') || para.startsWith('\u201c') || (para.includes('(') && para.match(/\(\w[^)]+\d+:\d+/))) {
return React.createElement('blockquote', { key: i, style: { borderLeft: '3px solid #B8832A', paddingLeft: '1rem', margin: '1.2em 0', fontFamily: "'Spectral', Georgia, serif", fontStyle: 'italic', color: '#1A3F5C', lineHeight: 1.7 } }, para);
}
if (ls.length > 2 && ls.every((l: string) => l.length < 80)) {
return React.createElement('div', { key: i, style: { marginBottom: '1.4em', fontStyle: 'italic', color: '#1A3F5C' } },
  ...ls.map((l: string, j: number) => React.createElement('div', { key: j, style: { lineHeight: 1.6 } }, l))
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

function SignupPrompt() {
return React.createElement('div', { style: { textAlign: 'center', padding: '64px 24px', maxWidth: 420, margin: '0 auto' } },
React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#F0F5FA', borderRadius: '50%', width: 56, height: 56, marginBottom: 24 } },
React.createElement('span', { style: { fontSize: 28 } }, '\u270F\uFE0F')
),
React.createElement('h2', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.5rem', color: '#0F2B45', margin: '0 0 12px', fontWeight: 600 } }, 'Your passage is ready'),
React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.95rem', color: '#4A7299', lineHeight: 1.6, margin: '0 0 32px' } },
'Create a free account to receive your personalised scripture passage and save it to your journey.'
),
React.createElement(Link, { href: '/auth/signup', style: { display: 'inline-block', background: '#0F2B45', color: '#FFFFFF', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', padding: '14px 32px', borderRadius: 100, textDecoration: 'none', marginBottom: 12 } },
'Create free account \u2192'
),
React.createElement('div', null,
React.createElement(Link, { href: '/auth/login', style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#4A7299', textDecoration: 'underline' } },
'Already have an account? Sign in'
)
)
);
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
const [unauthenticated, setUnauthenticated] = useState(false);

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
supabase.auth.getUser().then(({ data: { user } }) => {
if (user) {
setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
setUserEmail(user.email || '');
supabase.from('journey_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => { if (count !== null) setJourneyCount(count); });
}
});
}, []);

const handleGenerate = async () => {
setLoading(true);
setResult('');
setSaved(false);
setRateLimitMsg('');
setUnauthenticated(false);

try {
const resp = await fetch('/api/generate', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
mood: mood === 'Other' ? customMood : mood,
struggle: struggle === 'Other' ? customStruggle : struggle,
life: life === 'Other' ? customLife : life,
spirit: spirit === 'Other' ? customSpirit : spirit,
format, tone, length,
}),
});

if (resp.status === 401) {
setUnauthenticated(true);
setLoading(false);
return;
}

if (resp.status === 429) {
const data = await resp.json();
const resetAt = data.resetAt ? new Date(data.resetAt) : null;
const hoursLeft = resetAt ? Math.ceil((resetAt.getTime() - Date.now()) / 3600000) : 3;
setRateLimitMsg('You have reached your session limit. Your next session opens in ' + hoursLeft + ' hour' + (hoursLeft !== 1 ? 's' : '') + '.');
setLoading(false);
return;
}

if (!resp.ok || !resp.body) {
setResult('Something went wrong. Please try again.');
setLoading(false);
return;
}

const reader = resp.body.getReader();
const decoder = new TextDecoder();
let buffer = '';
let fullText = '';

while (true) {
const { done, value } = await reader.read();
if (done) break;
buffer += decoder.decode(value, { stream: true });
const parts = buffer.split('\n\n');
buffer = parts.pop() || '';
for (const part of parts) {
if (!part.startsWith('data: ')) continue;
const payload = part.slice(6).trim();
if (payload === '[DONE]') break;
try {
const parsed = JSON.parse(payload);
if (parsed.error) { setResult(r => r + '\n\n[Error: ' + parsed.error + ']'); break; }
if (parsed.text) { fullText += parsed.text; setResult(fullText); }
} catch {}
}
}

if (fullText.trim()) {
setJourneyCount(c => (c ?? 0) + 1);
try { localStorage.setItem('allos_prefs', JSON.stringify({ format, tone, length })); } catch {}
}
} catch (err) {
setResult('Connection error. Please check your internet and try again.');
} finally {
setLoading(false);
}
};

const resetAll = () => {
setStep(1); setMood(''); setStruggle(''); setLife(''); setSpirit('');
setResult(''); setSaved(false); setRateLimitMsg(''); setUnauthenticated(false);
};

const handleCopy = async () => {
try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
};

const handleSave = async () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

const canGenerate = !!(mood || customMood) && step >= 4;

if (loading) return React.createElement('main', { style: { minHeight: '100vh', background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(LoadingScreen, null));

if (unauthenticated) return React.createElement('main', { style: { minHeight: '100vh', background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, React.createElement(SignupPrompt, null));

if (rateLimitMsg) return React.createElement('main', { style: { minHeight: '100vh', background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
React.createElement('div', { style: { textAlign: 'center', padding: '64px 24px', maxWidth: 420, margin: '0 auto' } },
React.createElement('div', { style: { fontSize: 48, marginBottom: 24 } }, '\u231B'),
React.createElement('h2', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.5rem', color: '#0F2B45', margin: '0 0 12px' } }, 'Session limit reached'),
React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#4A7299', lineHeight: 1.6, margin: '0 0 28px' } }, rateLimitMsg),
React.createElement('button', { onClick: resetAll, style: { background: '#0F2B45', color: '#fff', border: 'none', borderRadius: 100, padding: '12px 28px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', cursor: 'pointer' } }, 'Back to start')
)
);

if (result) return React.createElement('main', { style: { minHeight: '100vh', background: '#F7F3EE' } },
React.createElement('div', { style: { maxWidth: 680, margin: '0 auto', padding: '48px 24px' } },
React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 } },
React.createElement(Link, { href: '/', style: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' } },
React.createElement(AllosLogo, { size: 28, variant: 'light' }),
React.createElement('span', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.1rem', color: '#0F2B45', fontWeight: 600 } }, 'Allos')
),
React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
React.createElement('button', { onClick: handleCopy, style: { background: copied ? '#E8F4EE' : '#FFFFFF', color: copied ? '#1A6B3C' : '#0F2B45', border: '1.5px solid ' + (copied ? '#1A6B3C' : '#C8D8E8'), borderRadius: 100, padding: '8px 18px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer' } }, copied ? 'Copied!' : 'Copy'),
React.createElement('button', { onClick: handleSave, style: { background: saved ? '#E8F4EE' : '#FFFFFF', color: saved ? '#1A6B3C' : '#0F2B45', border: '1.5px solid ' + (saved ? '#1A6B3C' : '#C8D8E8'), borderRadius: 100, padding: '8px 18px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer' } }, saved ? 'Saved!' : 'Save'),
React.createElement('button', { onClick: resetAll, style: { background: '#0F2B45', color: '#FFFFFF', border: 'none', borderRadius: 100, padding: '8px 18px', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', cursor: 'pointer' } }, 'New passage')
)
),
React.createElement('div', { style: { background: '#FFFFFF', borderRadius: 16, padding: '40px 44px', boxShadow: '0 2px 20px rgba(15,43,69,0.07)', fontFamily: "'Spectral', Georgia, serif", fontSize: '1.05rem', lineHeight: 1.8 } },
renderOutput(result)
),
journeyCount !== null && React.createElement('p', { style: { textAlign: 'center', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.8rem', color: '#8AAABF', marginTop: 20 } }, journeyCount + ' passage' + (journeyCount !== 1 ? 's' : '') + ' in your journey')
)
);

return React.createElement('main', { style: { minHeight: '100vh', background: '#F7F3EE' } },
React.createElement('div', { style: { maxWidth: 700, margin: '0 auto', padding: '40px 24px 80px' } },
React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 } },
React.createElement(Link, { href: '/', style: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' } },
React.createElement(AllosLogo, { size: 28, variant: 'light' }),
React.createElement('span', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.1rem', color: '#0F2B45', fontWeight: 600 } }, 'Allos')
),
userName && React.createElement('span', { style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.85rem', color: '#4A7299' } }, 'Hi, ' + userName)
),
React.createElement('div', { style: { marginBottom: 32 } },
LABEL('How are you feeling?'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: mood === 'Other' ? 12 : 0 } },
[...MOODS, 'Other'].map(m => React.createElement(Chip, { key: m, label: m, selected: mood === m, onClick: () => { setMood(m); if (step < 2) setStep(2); } }))
),
mood === 'Other' && React.createElement('input', { type: 'text', placeholder: 'Describe how you feel...', value: customMood, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomMood(e.target.value), style: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #C8D8E8', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', marginTop: 8, boxSizing: 'border-box' as const } })
),
step >= 2 && React.createElement('div', { style: { marginBottom: 32 } },
LABEL('What are you wrestling with?'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
[...STRUGGLES, 'Other', 'Skip'].map(s => React.createElement(Chip, { key: s, label: s, selected: struggle === s, onClick: () => { setStruggle(s); if (step < 3) setStep(3); } }))
),
struggle === 'Other' && React.createElement('input', { type: 'text', placeholder: 'Describe your struggle...', value: customStruggle, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomStruggle(e.target.value), style: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #C8D8E8', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', marginTop: 8, boxSizing: 'border-box' as const } })
),
step >= 3 && React.createElement('div', { style: { marginBottom: 32 } },
LABEL('What life season are you in?'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
[...LIFE, 'Other', 'Skip'].map(l => React.createElement(Chip, { key: l, label: l, selected: life === l, onClick: () => { setLife(l); if (step < 4) setStep(4); } }))
),
life === 'Other' && React.createElement('input', { type: 'text', placeholder: 'Describe your season...', value: customLife, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomLife(e.target.value), style: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #C8D8E8', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', marginTop: 8, boxSizing: 'border-box' as const } })
),
step >= 4 && React.createElement('div', { style: { marginBottom: 32 } },
LABEL('What do you need from God?'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
[...SPIRIT, 'Other', 'Skip'].map(s => React.createElement(Chip, { key: s, label: s, selected: spirit === s, onClick: () => setSpirit(s) }))
),
spirit === 'Other' && React.createElement('input', { type: 'text', placeholder: 'What do you need?', value: customSpirit, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomSpirit(e.target.value), style: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #C8D8E8', fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', marginTop: 8, boxSizing: 'border-box' as const } })
),
step >= 4 && React.createElement('div', { style: { marginBottom: 40, borderTop: '1px solid #E0E8F0', paddingTop: 28 } },
LABEL('Format'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 } },
FORMATS.map(f => React.createElement(Chip, { key: f, label: f, selected: format === f, small: true, onClick: () => setFormat(f) }))
),
LABEL('Tone'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 } },
TONES.map(t => React.createElement(Chip, { key: t, label: t, selected: tone === t, small: true, onClick: () => setTone(t) }))
),
LABEL('Length'),
React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
LENGTHS.map(l => React.createElement(Chip, { key: l, label: l, selected: length === l, small: true, onClick: () => setLength(l) }))
)
),
step >= 4 && React.createElement('button', {
onClick: handleGenerate,
disabled: !canGenerate,
style: { width: '100%', padding: '16px 0', background: canGenerate ? '#0F2B45' : '#C8D8E8', color: canGenerate ? '#FFFFFF' : '#8AAABF', border: 'none', borderRadius: 100, fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, fontSize: '1rem', cursor: canGenerate ? 'pointer' : 'not-allowed', letterSpacing: '0.02em', transition: 'background 0.2s ease' }
}, 'Receive my passage')
)
);
}
