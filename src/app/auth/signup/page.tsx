'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

const DENOMINATIONS = ['Non-denominational', 'Baptist', 'Pentecostal / Charismatic', 'Anglican / Episcopal', 'Methodist', 'Presbyterian / Reformed', 'Lutheran', 'Catholic', 'Orthodox', 'Adventist', 'Other'];
const COUNTRIES = ['United States', 'United Kingdom', 'Nigeria', 'Ghana', 'South Africa', 'Kenya', 'Canada', 'Australia', 'Jamaica', 'Trinidad', 'India', 'Philippines', 'Other'];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const signUpGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.word2go.com/auth/callback' } });
    if (error) { setMessage(error.message); setLoading(false); }
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setMessage('Password must be at least 8 characters.'); return; }
    setStep(2);
    setMessage('');
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: 'https://www.word2go.com/auth/callback' } });
    if (error) { setMessage(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, first_name: firstName, last_name: lastName, denomination, country, updated_at: new Date().toISOString() });
    }
    setMessage('Account created! Check your email to verify, then sign in.');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = { padding: '13px 16px', border: '1px solid #DBE5EE', borderRadius: 12, fontSize: '0.9rem', outline: 'none', color: '#1B3A57', background: '#F6F9FB', width: '100%', boxSizing: 'border-box' };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: 'auto' };

  return (
    <div style={{ minHeight: '100vh', background: '#F6F9FB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#1B3A57', borderRadius: '50%', width: 72, height: 72, marginBottom: 16 }}>
            <AllosLogo size={44} variant="dark" />
          </div>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.75rem', fontWeight: 400, color: '#1B3A57', margin: '0 0 6px' }}>
            {step === 1 ? 'Begin your journey' : 'Tell us about yourself'}
          </h1>
          <p style={{ color: '#54677A', fontSize: '0.9rem', margin: 0 }}>
            {step === 1 ? 'Step 1 of 2 — Create your account' : 'Step 2 of 2 — Your profile'}
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #DBE5EE', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(27,58,87,0.07)' }}>

          {step === 1 && (
            <>
              <button onClick={signUpGoogle} disabled={loading}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 20px', border: '1px solid #DBE5EE', borderRadius: '100px', background: '#F6F9FB', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#1B3A57', marginBottom: 20 }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Sign up with Google
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: '#DBE5EE' }}/>
                <span style={{ color: '#54677A', fontSize: '0.8rem' }}>or use email</span>
                <div style={{ flex: 1, height: 1, background: '#DBE5EE' }}/>
              </div>
              <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                <input type="password" placeholder="Password (min. 8 characters)" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                <button type="submit" style={{ padding: '13px', background: '#1B3A57', color: '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  Continue
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} />
                <input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} />
              </div>
              <select value={denomination} onChange={e => setDenomination(e.target.value)} style={selectStyle}>
                <option value="">Church background (optional)</option>
                {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
                <option value="">Country (optional)</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" disabled={loading}
                style={{ padding: '13px', background: '#1B3A57', color: '#F6F9FB', border: 'none', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Creating account...' : 'Create my account'}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: '#54677A', cursor: 'pointer', fontSize: '0.85rem' }}>
                Back
              </button>
            </form>
          )}

          {message && <p style={{ marginTop: 14, fontSize: '0.85rem', color: '#C8943F', textAlign: 'center' }}>{message}</p>}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#54677A', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#6E9CC4', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
