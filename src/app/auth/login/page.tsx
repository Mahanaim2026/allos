'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => { if (user) router.replace('/app'); });
  }, []);

  const signInGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://www.word2go.com/auth/callback' } });
    if (error) { setMessage(error.message); setLoading(false); }
  };

  const signInEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage(error.message); setLoading(false); } else { router.push('/app'); }
  };

  const magicLink = async () => {
    if (!email) { setMessage('Enter your email address first.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: 'https://www.word2go.com/auth/callback' } });
    setMessage(error ? error.message : 'Check your email \u2014 a sign-in link is on its way.');
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    padding: '13px 16px', border: '1.5px solid #C8D8E8', borderRadius: 12,
    fontSize: '0.9rem', outline: 'none', color: '#0F2B45', background: '#FFFFFF',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0F2B45', borderRadius: '50%', width: 72, height: 72, marginBottom: 16 }}>
            <AllosLogo size={44} variant="dark" />
          </div>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.75rem', fontWeight: 400, color: '#0F2B45', margin: '0 0 6px' }}>Welcome back</h1>
          <p style={{ color: '#3D5166', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', fontFamily: "'Spectral', Georgia, serif" }}>Scripture for the Season You&apos;re In</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #C8D8E8', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,43,69,0.08)' }}>

          <button onClick={signInGoogle} disabled={loading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '13px 16px', border: '1.5px solid #C8D8E8', borderRadius: 12, background: '#FFFFFF', color: '#0F2B45', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#E8EFF6' }} />
            <span style={{ fontSize: '0.78rem', color: '#8FA8BF', letterSpacing: '0.06em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#E8EFF6' }} />
          </div>

          <form onSubmit={signInEmail}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0F2B45', marginBottom: 6, letterSpacing: '0.02em' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 6 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0F2B45', marginBottom: 6, letterSpacing: '0.02em' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required style={inputStyle} />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <Link href="/auth/reset" style={{ fontSize: '0.8rem', color: '#2B6CB0', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            {message && <p style={{ fontSize: '0.85rem', color: message.includes('Check') ? '#2A7A4F' : '#B83A2A', margin: '0 0 12px', padding: '10px 14px', background: message.includes('Check') ? '#F0FFF8' : '#FFF5F5', borderRadius: 8, border: `1px solid ${message.includes('Check') ? '#9AE6B4' : '#FEC7C0'}` }}>{message}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', background: '#0F2B45', color: '#FFFFFF', border: 'none', borderRadius: 100, padding: '14px', fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginBottom: 12 }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button onClick={magicLink} disabled={loading}
            style={{ width: '100%', background: 'none', border: '1.5px solid #C8D8E8', borderRadius: 100, padding: '12px', fontSize: '0.85rem', color: '#3D5166', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>
            Send magic link instead
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#3D5166', margin: 0 }}>
            New here?{' '}
            <Link href="/auth/signup" style={{ color: '#2B6CB0', textDecoration: 'none', fontWeight: 500 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
