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

const SURPRISE_SCRIPTURES = [
  { verse: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."', ref: 'Jeremiah 29:11', reflection: 'Even in the unknown, God holds your tomorrow with perfect intention. Rest in His plans today.' },
  { verse: '"Come to me, all you who are weary and burdened, and I will give you rest."', ref: 'Matthew 11:28', reflection: 'Whatever weight you carry right now, Jesus is your invitation to put it down. He is your rest.' },
  { verse: '"I can do all this through him who gives me strength."', ref: 'Philippians 4:13', reflection: 'Not by your own power — but through His. Let this be your quiet confidence today.' },
  { verse: '"The Lord is my shepherd, I lack nothing."', ref: 'Psalm 23:1', reflection: 'In His care, no true need goes unmet. You are seen, known, and provided for.' },
  { verse: '"Be still, and know that I am God."', ref: 'Psalm 46:10', reflection: 'Stillness is not idleness — it is faith. In quietness today, let His presence be enough.' },
  { verse: '"Cast all your anxiety on him because he cares for you."', ref: '1 Peter 5:7', reflection: 'God does not just tolerate your worries — He invites them. He cares for you personally.' },
  { verse: '"The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing."', ref: 'Zephaniah 3:17', reflection: 'You are not merely tolerated by God — you are celebrated by Him. He sings over you.' },
  { verse: '"He gives strength to the weary and increases the power of the weak."', ref: 'Isaiah 40:29', reflection: 'Your weakness is not disqualifying — it is the very place where His strength shines brightest.' },
  { verse: '"Trust in the Lord with all your heart and lean not on your own understanding."', ref: 'Proverbs 3:5', reflection: 'Your understanding has limits. His wisdom has none. Lean into His leading today.' },
  { verse: '"The Lord is close to the brokenhearted and saves those who are crushed in spirit."', ref: 'Psalm 34:18', reflection: 'He does not stand far off from your pain. He draws near to it — and to you.' },
  { verse: '"For God so loved the world that he gave his one and only Son."', ref: 'John 3:16', reflection: 'The measure of God\'s love is the cross. You are worth everything to Him.' },
  { verse: '"No, in all these things we are more than conquerors through him who loved us."', ref: 'Romans 8:37', reflection: 'Not just survivors — more than conquerors. The victory is already secured in Him.' },
  { verse: '"And we know that in all things God works for the good of those who love him."', ref: 'Romans 8:28', reflection: 'Even the hard things are in His hands, being worked for your good. Nothing is wasted.' },
  { verse: '"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning."', ref: 'Lamentations 3:22-23', reflection: 'Every morning is a fresh start with God. His mercies greet you before the day begins.' },
  { verse: '"I have been crucified with Christ and I no longer live, but Christ lives in me."', ref: 'Galatians 2:20', reflection: 'The life you live is not alone. Christ lives in you — you carry His presence everywhere.' },
  ];

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
    return React.createElement('span', { style: { display: 'inline-flex', gap: 5, alignItems: 'center' } },
                                   ...[0,1,2].map(i => React.createElement('span', { key: i, style: { width: 7, height: 7, borderRadius: '50%', background: '#B8832A', display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: i * 0.2 + 's' } }))
                                 );
}

function LoadingScreen() {
    return React.createElement('div', { style: { minHeight: '60vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 16 } },
                                   React.createElement(DotPulse),
                                   React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#6B8CA8', fontSize: '0.9rem', letterSpacing: '0.04em' } }, 'Preparing your word...')
                                 );
}

function LABEL(text: string) {
    return React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6B8CA8', marginBottom: 10, marginTop: 0 } }, text);
}

function SignupPrompt() {
    return React.createElement('div', { style: { textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: 420, margin: '0 auto' } },
                                   React.createElement('div', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: '#F0F5FA', marginBottom: 16 } },
                                                             React.createElement('span', { style: { fontSize: 24 } }, '\u270F\uFE0F')
                                                           ),
                                   React.createElement('h2', { style: { fontFamily: "'Spectral', Georgia, serif", fontSize: '1.5rem', color: '#0F2B45', marginBottom: 8, marginTop: 0 } }, 'Create your free account'),
                                   React.createElement('p', { style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#4A6B85', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 28 } },
                                                             'Sign up to receive your personalised scripture passage and save your journey.'
                                                           ),
                                   React.createElement(Link, { href: '/auth/signup', style: { display: 'inline-block', background: '#0F2B45', color: '#fff', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, fontSize: '0.95rem', padding: '14px 32px', borderRadius: 100, textDecoration: 'none', marginBottom: 12 } },
                                                             'Create free account \u2192'
                                                           ),
                                   React.createElement('div', null,
                                                             React.createElement(Link, { href: '/auth/login', style: { fontFamily: 'Hanken Grotesk, sans-serif', color: '#6B8CA8', fontSize: '0.88rem', textDecoration: 'none' } },
                                                                                         'Already have an account? Sign in'
                                                                                       )
                                                           )
                                 );
}

export default function AppPage() {
    const [mode, setMode] = useState<'home'|'journey'|'surprise'>('home');
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
    const [rateLimitMsg, setRateLimitMsg] = useState('');
    const [unauthenticated, setUnauthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [journeyCount, setJourneyCount] = useState<number|null>(null);
    const [surpriseCard, setSurpriseCard] = useState<{verse:string;ref:string;reflection:string}|null>(null);
    const [surpriseLoading, setSurpriseLoading] = useState(false);

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
                          supabase.from('journey_entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => {
                                      if (count !== null) setJourneyCount(count);
                          });
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
                    const hoursLeft = resetAt ? Math.ceil((resetAt.getTime() - Date.now()) / 3600000) : null;
                    setRateLimitMsg('You have reached your session limit. Your next session opens' + (hoursLeft ? ' in ' + hoursLeft + ' hour' + (hoursLeft !== 1 ? 's' : '') : ' soon') + '.');
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
                let fullText = '';
                let buffer = '';

          while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const parts = buffer.split('\n\n');
                    buffer = parts.pop() || '';
                    for (const part of parts) {
                                const payload = part.replace(/^data:\s*/, '');
                                if (payload === '[DONE]') break;
                                try {
                                              const parsed = JSON.parse(payload);
                                              if (parsed.error) { setResult(r => r + '\n\n[Error: ' + parsed.error + ']'); }
                                              if (parsed.text) { fullText += parsed.text; setResult(fullText); }
                                } catch {}
                    }
          }

          if (fullText.trim()) {
                    setJourneyCount(c => (c ?? 0) + 1);
                    try {
                                localStorage.setItem('allos_prefs', JSON.stringify({ format, tone, length }));
                    } catch (err) {}
          }
        } catch (err) {
                setResult('Connection error. Please check your internet and try again.');
        } finally {
                setLoading(false);
        }
  };

  const handleSurpriseMe = () => {
        setSurpriseLoading(true);
        setTimeout(() => {
                const pick = SURPRISE_SCRIPTURES[Math.floor(Math.random() * SURPRISE_SCRIPTURES.length)];
                setSurpriseCard(pick);
                setSurpriseLoading(false);
                setMode('surprise');
        }, 600);
  };

  const resetAll = () => {
        setStep(1); setMood(''); setStruggle(''); setLife(''); setSpirit('');
        setResult(''); setSaved(false); setRateLimitMsg(''); setUnauthenticated(false);
        setMode('home'); setSurpriseCard(null);
  };

  const handleCopy = () => { navigator.clipboard.writeText(result); };
    const handleSave = () => { setSaved(true); };

  const canGenerate = mood !== '' && !loading;

  // CSS styles
  const css = `
      @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1); } }
          @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
              @keyframes spin { to { transform:rotate(360deg); } }
                  * { box-sizing: border-box; }
                      body { margin: 0; }
                          .allos-main { min-height: 100vh; background: #F7F3EE; font-family: 'Hanken Grotesk', sans-serif; }
                              .allos-inner { max-width: 680px; margin: 0 auto; padding: 0 20px 60px; }
                                  .allos-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 0 32px; }
                                      .allos-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; }
                                          .allos-logo-title { font-family: 'Spectral', Georgia, serif; font-size: 1.2rem; color: #0F2B45; font-weight: 600; }
                                              .allos-nav { display: flex; align-items: center; gap: 16px; }
                                                  .allos-nav a { font-family: 'Hanken Grotesk', sans-serif; font-size: 0.85rem; color: #6B8CA8; text-decoration: none; }
                                                      .allos-nav a:hover { color: #0F2B45; }
                                                          .hero { text-align: center; padding: 24px 0 40px; }
                                                              .hero-title { font-family: 'Spectral', Georgia, serif; font-size: clamp(1.9rem, 5vw, 2.6rem); color: #0F2B45; line-height: 1.25; margin: 0 0 12px; font-weight: 400; }
                                                                  .hero-sub { font-size: 1rem; color: #6B8CA8; line-height: 1.6; margin: 0 auto 36px; max-width: 420px; }
                                                                      .cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
                                                                          .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #0F2B45; color: #fff; font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 1rem; padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer; text-decoration: none; transition: all 0.18s; letter-spacing: 0.01em; min-height: 52px; }
                                                                              .btn-primary:hover { background: #1A3F5C; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(15,43,69,0.2); }
                                                                                  .btn-surprise { display: inline-flex; align-items: center; gap: 8px; background: #C13B2A; color: #fff; font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 1rem; padding: 16px 30px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.18s; letter-spacing: 0.01em; min-height: 52px; }
                                                                                      .btn-surprise:hover { background: #A83220; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(193,59,42,0.25); }
                                                                                          .btn-ghost { background: transparent; color: #6B8CA8; font-family: 'Hanken Grotesk', sans-serif; font-size: 0.88rem; border: 1.5px solid #C8D8E8; padding: 10px 20px; border-radius: 100px; cursor: pointer; transition: all 0.15s; }
                                                                                              .btn-ghost:hover { border-color: #0F2B45; color: #0F2B45; }
                                                                                                  .step-card { background: #fff; border-radius: 20px; padding: 32px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(15,43,69,0.06); animation: fadeIn 0.3s ease; }
                                                                                                      .step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
                                                                                                          .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #C8D8E8; }
                                                                                                              .step-dot.active { background: #0F2B45; }
                                                                                                                  .step-dot.done { background: #B8832A; }
                                                                                                                      .chip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
                                                                                                                          .custom-input { width: 100%; padding: 12px 16px; border: 1.5px solid #C8D8E8; border-radius: 12px; font-family: 'Hanken Grotesk', sans-serif; font-size: 0.92rem; color: #0F2B45; background: #FAFCFE; outline: none; transition: border 0.15s; margin-top: 10px; }
                                                                                                                              .custom-input:focus { border-color: #0F2B45; }
                                                                                                                                  .step-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; gap: 10px; }
                                                                                                                                      .step-nav-right { display: flex; gap: 10px; align-items: center; margin-left: auto; }
                                                                                                                                          .btn-next { background: #0F2B45; color: #fff; font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 0.92rem; padding: 12px 24px; border-radius: 100px; border: none; cursor: pointer; transition: all 0.15s; }
                                                                                                                                              .btn-next:disabled { opacity: 0.4; cursor: not-allowed; }
                                                                                                                                                  .btn-next:not(:disabled):hover { background: #1A3F5C; }
                                                                                                                                                      .result-card { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 1px 4px rgba(15,43,69,0.06); animation: fadeIn 0.4s ease; }
                                                                                                                                                          .result-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; padding-top: 20px; border-top: 1px solid #EEF3F8; }
                                                                                                                                                              .surprise-card { background: #fff; border-radius: 20px; padding: 36px 32px; text-align: center; box-shadow: 0 1px 4px rgba(15,43,69,0.06); animation: fadeIn 0.4s ease; max-width: 560px; margin: 0 auto; }
                                                                                                                                                                  .surprise-verse { font-family: 'Spectral', Georgia, serif; font-size: 1.2rem; font-style: italic; color: #1A3F5C; line-height: 1.7; margin: 0 0 8px; }
                                                                                                                                                                      .surprise-ref { font-family: 'Hanken Grotesk', sans-serif; font-size: 0.82rem; font-weight: 700; color: #B8832A; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 24px; }
                                                                                                                                                                          .surprise-reflection { font-family: 'Hanken Grotesk', sans-serif; font-size: 0.95rem; color: #4A6B85; line-height: 1.7; margin: 0 0 28px; }
                                                                                                                                                                              .surprise-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
                                                                                                                                                                                  .spinner { width: 36px; height: 36px; border: 3px solid #EEF3F8; border-top-color: #C13B2A; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 60px auto; }
                                                                                                                                                                                      @media (max-width: 480px) {
                                                                                                                                                                                            .allos-inner { padding: 0 14px 48px; }
                                                                                                                                                                                                  .step-card { padding: 22px 16px; }
                                                                                                                                                                                                        .result-card { padding: 22px 16px; }
                                                                                                                                                                                                              .surprise-card { padding: 28px 16px; }
                                                                                                                                                                                                                    .cta-row { flex-direction: column; align-items: center; }
                                                                                                                                                                                                                          .btn-primary, .btn-surprise { width: 100%; max-width: 320px; justify-content: center; }
                                                                                                                                                                                                                                .allos-header { padding: 16px 0 24px; }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                      `;

  // Header component
  const header = React.createElement('header', { className: 'allos-header' },
                                         React.createElement(Link, { href: '/', className: 'allos-logo-wrap' },
                                                                   React.createElement(AllosLogo, { size: 28, variant: 'light' }),
                                                                   React.createElement('span', { className: 'allos-logo-title' }, 'Allos')
                                                                 ),
                                         React.createElement('nav', { className: 'allos-nav' },
                                                                   journeyCount !== null && React.createElement('span', { style: { fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', color: '#6B8CA8' } }, journeyCount + ' journey' + (journeyCount !== 1 ? 's' : '')),
                                                                   React.createElement(Link, { href: '/feedback' }, 'Feedback'),
                                                                   userName ? React.createElement('span', null, userName) : React.createElement(Link, { href: '/auth/login' }, 'Sign in')
                                                                 )
                                       );

  // Home screen
  const homeScreen = React.createElement('div', null,
                                             React.createElement('div', { className: 'hero' },
                                                                       React.createElement('h1', { className: 'hero-title' }, 'What does God have', React.createElement('br'), 'for you today?'),
                                                                       React.createElement('p', { className: 'hero-sub' }, 'Receive a scripture passage crafted for your moment — or let the Spirit surprise you.'),
                                                                       React.createElement('div', { className: 'cta-row' },
                                                                                                   React.createElement('button', { className: 'btn-primary', onClick: () => setMode('journey') },
                                                                                                                                 React.createElement('span', null, '\u270F\uFE0F'), ' Word for my situation'
                                                                                                                               ),
                                                                                                   React.createElement('button', { className: 'btn-surprise', onClick: handleSurpriseMe, disabled: surpriseLoading },
                                                                                                                                 surpriseLoading ? React.createElement('span', { style: { width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' } }) : React.createElement('span', null, '\u2728'),
                                                                                                                                 ' Surprise me'
                                                                                                                               )
                                                                                                 )
                                                                     )
                                           );

  // Step indicator
  const stepDots = (current: number, total: number) => React.createElement('div', { className: 'step-indicator' },
                                                                               ...Array.from({ length: total }, (_, i) =>
                                                                                       React.createElement('div', { key: i, className: 'step-dot' + (i + 1 === current ? ' active' : i + 1 < current ? ' done' : '') })
                                                                                                 )
                                                                             );

  // Journey flow steps
  const journeyStep1 = React.createElement('div', { className: 'step-card' },
                                               stepDots(step, 4),
                                               LABEL('How are you feeling?'),
                                               React.createElement('div', { className: 'chip-grid' },
                                                                         ...MOODS.map(m => React.createElement(Chip, { key: m, label: m, selected: mood === m, onClick: () => setMood(mood === m ? '' : m) })),
                                                                         React.createElement(Chip, { key: 'other-mood', label: 'Other', selected: mood === 'Other', onClick: () => setMood(mood === 'Other' ? '' : 'Other') })
                                                                       ),
                                               mood === 'Other' && React.createElement('input', { className: 'custom-input', placeholder: 'Describe how you\'re feeling...', value: customMood, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomMood(e.target.value) }),
                                               React.createElement('div', { className: 'step-nav' },
                                                                         React.createElement('button', { className: 'btn-ghost', onClick: () => setMode('home') }, '\u2190 Back'),
                                                                         React.createElement('div', { className: 'step-nav-right' },
                                                                                                     React.createElement('button', { className: 'btn-ghost', onClick: () => { setMood(''); setStep(2); } }, 'Skip'),
                                                                                                     React.createElement('button', { className: 'btn-next', disabled: mood === '', onClick: () => setStep(2) }, 'Next \u2192')
                                                                                                   )
                                                                       )
                                             );

  const journeyStep2 = React.createElement('div', { className: 'step-card' },
                                               stepDots(step, 4),
                                               LABEL('What are you struggling with?'),
                                               React.createElement('div', { className: 'chip-grid' },
                                                                         ...STRUGGLES.map(s => React.createElement(Chip, { key: s, label: s, selected: struggle === s, onClick: () => setStruggle(struggle === s ? '' : s) })),
                                                                         React.createElement(Chip, { key: 'other-str', label: 'Other', selected: struggle === 'Other', onClick: () => setStruggle(struggle === 'Other' ? '' : 'Other') })
                                                                       ),
                                               struggle === 'Other' && React.createElement('input', { className: 'custom-input', placeholder: 'Describe your struggle...', value: customStruggle, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomStruggle(e.target.value) }),
                                               React.createElement('div', { className: 'step-nav' },
                                                                         React.createElement('button', { className: 'btn-ghost', onClick: () => setStep(1) }, '\u2190 Back'),
                                                                         React.createElement('div', { className: 'step-nav-right' },
                                                                                                     React.createElement('button', { className: 'btn-ghost', onClick: () => { setStruggle(''); setStep(3); } }, 'Skip'),
                                                                                                     React.createElement('button', { className: 'btn-next', onClick: () => setStep(3) }, 'Next \u2192')
                                                                                                   )
                                                                       )
                                             );

  const journeyStep3 = React.createElement('div', { className: 'step-card' },
                                               stepDots(step, 4),
                                               LABEL('Life context'),
                                               React.createElement('div', { className: 'chip-grid' },
                                                                         ...LIFE.map(l => React.createElement(Chip, { key: l, label: l, selected: life === l, onClick: () => setLife(life === l ? '' : l) })),
                                                                         React.createElement(Chip, { key: 'other-life', label: 'Other', selected: life === 'Other', onClick: () => setLife(life === 'Other' ? '' : 'Other') })
                                                                       ),
                                               life === 'Other' && React.createElement('input', { className: 'custom-input', placeholder: 'Describe your context...', value: customLife, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomLife(e.target.value) }),
                                               React.createElement('div', { className: 'step-nav' },
                                                                         React.createElement('button', { className: 'btn-ghost', onClick: () => setStep(2) }, '\u2190 Back'),
                                                                         React.createElement('div', { className: 'step-nav-right' },
                                                                                                     React.createElement('button', { className: 'btn-ghost', onClick: () => { setLife(''); setStep(4); } }, 'Skip'),
                                                                                                     React.createElement('button', { className: 'btn-next', onClick: () => setStep(4) }, 'Next \u2192')
                                                                                                   )
                                                                       )
                                             );

  const journeyStep4 = React.createElement('div', null,
                                               React.createElement('div', { className: 'step-card' },
                                                                         stepDots(step, 4),
                                                                         LABEL('What are you seeking from God?'),
                                                                         React.createElement('div', { className: 'chip-grid' },
                                                                                                     ...SPIRIT.map(s => React.createElement(Chip, { key: s, label: s, selected: spirit === s, onClick: () => setSpirit(spirit === s ? '' : s) })),
                                                                                                     React.createElement(Chip, { key: 'other-sp', label: 'Other', selected: spirit === 'Other', onClick: () => setSpirit(spirit === 'Other' ? '' : 'Other') })
                                                                                                   ),
                                                                         spirit === 'Other' && React.createElement('input', { className: 'custom-input', placeholder: 'What are you seeking?', value: customSpirit, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCustomSpirit(e.target.value) })
                                                                       ),
                                               React.createElement('div', { className: 'step-card', style: { marginTop: 0 } },
                                                                         LABEL('Format'),
                                                                         React.createElement('div', { className: 'chip-grid' },
                                                                                                     ...FORMATS.map(f => React.createElement(Chip, { key: f, label: f, selected: format === f, small: true, onClick: () => setFormat(f) }))
                                                                                                   ),
                                                                         React.createElement('div', { style: { marginTop: 20 } }, LABEL('Tone')),
                                                                         React.createElement('div', { className: 'chip-grid' },
                                                                                                     ...TONES.map(t => React.createElement(Chip, { key: t, label: t, selected: tone === t, small: true, onClick: () => setTone(t) }))
                                                                                                   ),
                                                                         React.createElement('div', { style: { marginTop: 20 } }, LABEL('Length')),
                                                                         React.createElement('div', { className: 'chip-grid' },
                                                                                                     ...LENGTHS.map(l => React.createElement(Chip, { key: l, label: l, selected: length === l, small: true, onClick: () => setLength(l) }))
                                                                                                   ),
                                                                         React.createElement('div', { className: 'step-nav' },
                                                                                                     React.createElement('button', { className: 'btn-ghost', onClick: () => setStep(3) }, '\u2190 Back'),
                                                                                                     React.createElement('div', { className: 'step-nav-right' },
                                                                                                                                   React.createElement('button', { className: 'btn-next', style: { padding: '14px 28px', fontSize: '0.98rem' }, disabled: !canGenerate, onClick: handleGenerate }, 'Receive my word \u2192')
                                                                                                                                 )
                                                                                                   )
                                                                       )
                                             );

  return React.createElement('main', { className: 'allos-main' },
                                 React.createElement('style', null, css),
                                 React.createElement('div', { className: 'allos-inner' },
                                                           header,

                                                           // Rate limit notice
                                                           rateLimitMsg && React.createElement('div', { style: { background: '#FFF3E0', border: '1px solid #FFB74D', borderRadius: 12, padding: '14px 18px', marginBottom: 20, fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.9rem', color: '#7A4A00' } }, rateLimitMsg),

                                                           // Home mode
                                                           mode === 'home' && homeScreen,

                                                           // Surprise mode
                                                           mode === 'surprise' && React.createElement('div', null,
                                                                                                              surpriseCard && React.createElement('div', { className: 'surprise-card' },
                                                                                                                                                            React.createElement('div', { style: { marginBottom: 20 } },
                                                                                                                                                                                            React.createElement('span', { style: { fontSize: 32 } }, '\u2728')
                                                                                                                                                                                          ),
                                                                                                                                                            React.createElement('blockquote', { className: 'surprise-verse' }, surpriseCard.verse),
                                                                                                                                                            React.createElement('p', { className: 'surprise-ref' }, surpriseCard.ref),
                                                                                                                                                            React.createElement('p', { className: 'surprise-reflection' }, surpriseCard.reflection),
                                                                                                                                                            React.createElement('div', { className: 'surprise-actions' },
                                                                                                                                                                                            React.createElement('button', { className: 'btn-surprise', onClick: handleSurpriseMe }, '\u2728 Another one'),
                                                                                                                                                                                            React.createElement('button', { className: 'btn-primary', onClick: () => { setMode('journey'); setStep(1); } }, '\u270F\uFE0F Word for my situation'),
                                                                                                                                                                                            React.createElement('button', { className: 'btn-ghost', onClick: resetAll }, 'Home')
                                                                                                                                                                                          )
                                                                                                                                                          )
                                                                                                            ),

                                                           // Journey mode
                                                           mode === 'journey' && !loading && !result && !unauthenticated && (
                                                                     step === 1 ? journeyStep1 :
                                                                     step === 2 ? journeyStep2 :
                                                                     step === 3 ? journeyStep3 :
                                                                     journeyStep4
                                                                   ),

                                                           // Loading
                                                           mode === 'journey' && loading && React.createElement(LoadingScreen),

                                                           // Unauthenticated
                                                           mode === 'journey' && unauthenticated && React.createElement(SignupPrompt),

                                                           // Result
                                                           mode === 'journey' && result && !loading && React.createElement('div', { className: 'result-card' },
                                                                                                                                   renderOutput(result),
                                                                                                                                   React.createElement('div', { className: 'result-actions' },
                                                                                                                                                                 React.createElement('button', { className: 'btn-ghost', onClick: handleCopy }, 'Copy'),
                                                                                                                                                                 React.createElement('button', { className: 'btn-ghost', onClick: handleSave }, saved ? 'Saved \u2713' : 'Save'),
                                                                                                                                                                 React.createElement('button', { className: 'btn-ghost', onClick: resetAll }, 'Start again')
                                                                                                                                                               )
                                                                                                                                 )
                                                         )
                               );
}
