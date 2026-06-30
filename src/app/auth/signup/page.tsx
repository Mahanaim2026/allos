'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/app` } });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true);
  }

  if (done) return (
    <main className="min-h-screen bg-allos-cream flex flex-col items-center justify-center px-6">
      <Link href="/" className="text-2xl font-serif font-bold text-allos-navy mb-10">Allos</Link>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-allos-warm p-8 text-center">
        <p className="text-2xl mb-3">✉️</p>
        <h2 className="text-xl font-serif font-bold text-allos-navy mb-2">Check your email</h2>
        <p className="text-allos-navy/60 font-sans text-sm">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-allos-cream flex flex-col items-center justify-center px-6">
      <Link href="/" className="text-2xl font-serif font-bold text-allos-navy mb-10">Allos</Link>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-allos-warm p-8">
        <h2 className="text-xl font-serif font-bold text-allos-navy mb-6">Create your account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-sans font-medium text-allos-navy mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-allos-warm rounded-lg px-4 py-3 text-sm font-sans text-allos-navy bg-allos-cream focus:outline-none focus:border-allos-navy/40" />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-allos-navy mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              className="w-full border border-allos-warm rounded-lg px-4 py-3 text-sm font-sans text-allos-navy bg-allos-cream focus:outline-none focus:border-allos-navy/40" />
          </div>
          {error && <p className="text-red-600 text-xs font-sans">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-allos-navy text-allos-cream py-3 rounded-lg font-sans font-medium text-sm hover:bg-allos-navy/90 transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-xs font-sans text-center text-allos-navy/50">
          Already have an account? <Link href="/auth/login" className="text-allos-olive hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}