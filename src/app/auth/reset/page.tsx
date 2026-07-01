'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function ResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setMessage('Please enter your email address.'); return; }
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.word2go.com/auth/update-password',
    });
    if (error) {
      setMessage(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    padding: '13px 16px', border: '1.5px solid #C8D8E8', borderRadius: 12,
    fontSize: '0.9rem', outline: 'none', color: '#0F2B45', background: '#FFFFFF',
    width: '100%', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#0F2B45', borderRadius: '50%', width: 72, height: 72, marginBottom: 16 }}>
            <AllosLogo size={44} variant="dark" />
          </div>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.75rem', fontWeight: 400, color: '#0F2B45', margin: '0 0 6px' }}>
            Reset your password
          </h1>
          <p style={{ color: '#3D5166', fontSize: '0.9rem', margin: 0, fontStyle: 'italic', fontFamily: "'Spectral', Georgia, serif" }}>
            We&apos;ll send a reset link to your email
          </p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #C8D8E8', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(15,43,69,0.08)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>\u2709\uFE0F</div>
              <p style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.1rem', color: '#0F2B45', margin: '0 0 8px' }}>
                Check your inbox
              </p>
              <p style={{ color: '#3D5166', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 24px' }}>
                A password reset link has been sent to <strong>{email}</strong>. It may take a minute to arrive.
              </p>
              <Link href="/auth/login" style={{ color: '#2B6CB0', fontSize: '0.875rem', textDecoration: 'none' }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0F2B45', marginBottom: 6, letterSpacing: '0.02em' }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
              {message && (
                <p style={{ fontSize: '0.85rem', color: '#B83A2A', margin: '0 0 12px', padding: '10px 14px', background: '#FFF5F5', borderRadius: 8, border: '1px solid #FEC7C0' }}>
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: '#0F2B45', color: '#FFFFFF', border: 'none', borderRadius: 100, padding: '14px', fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, marginBottom: 16 }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#3D5166', margin: 0 }}>
                Remembered it?{' '}
                <Link href="/auth/login" style={{ color: '#2B6CB0', textDecoration: 'none', fontWeight: 500 }}>
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
