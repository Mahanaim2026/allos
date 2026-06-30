'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AllosLogo from '@/components/AllosLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = '/journey';
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: \`\${window.location.origin}/auth/callback\` }
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  }

  async function handleMagicLink() {
    if (!email) { setError('Enter your email first'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: \`\${window.location.origin}/auth/callback\` } });
    if (error) { setError(error.message); } else { setMagicSent(true); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <AllosLogo size="md" variant="full" />
        </div>

        <h1 className="text-2xl font-serif font-medium text-allos-navy text-center mb-1">Welcome back</h1>
        <p className="text-sm text-slate-400 text-center mb-8">Sign in to continue your journey</p>

        {magicSent ? (
          <div className="bg-allos-mist/40 rounded-2xl p-6 text-center">
            <p className="text-allos-navy font-medium mb-2">Check your email</p>
            <p className="text-sm text-slate-500">We sent a sign-in link to <strong>{email}</strong></p>
          </div>
        ) : (
          <>
            {/* Google */}
            <button onClick={handleGoogleLogin} disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors mb-4 disabled:opacity-50">
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-300">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Email/password */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="Email address"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Password"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue" />
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-allos-navy text-white py-3.5 rounded-2xl font-medium text-sm hover:bg-allos-blue transition-colors disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <button onClick={handleMagicLink} className="w-full mt-3 text-allos-blue text-sm hover:underline">
              Email me a sign-in link instead
            </button>
          </>
        )}

        <p className="text-center text-sm text-slate-400 mt-6">
          No account?{' '}
          <Link href="/auth/signup" className="text-allos-blue font-medium hover:underline">Create one free</Link>
        </p>
        <p className="text-center text-xs text-slate-300 mt-3">
          <Link href="/app" className="hover:underline">Continue without account</Link>
        </p>
      </div>
    </div>
  );
}