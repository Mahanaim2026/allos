'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/app');
  }

  return (
    <main className="min-h-screen bg-allos-cream flex flex-col items-center justify-center px-6">
      <Link href="/" className="text-2xl font-serif font-bold text-allos-navy mb-10">Allos</Link>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-allos-warm p-8">
        <h2 className="text-xl font-serif font-bold text-allos-navy mb-6">Welcome back</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-sans font-medium text-allos-navy mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-allos-warm rounded-lg px-4 py-3 text-sm font-sans text-allos-navy bg-allos-cream focus:outline-none focus:border-allos-navy/40" />
          </div>
          <div>
            <label className="block text-xs font-sans font-medium text-allos-navy mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-allos-warm rounded-lg px-4 py-3 text-sm font-sans text-allos-navy bg-allos-cream focus:outline-none focus:border-allos-navy/40" />
          </div>
          {error && <p className="text-red-600 text-xs font-sans">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-allos-navy text-allos-cream py-3 rounded-lg font-sans font-medium text-sm hover:bg-allos-navy/90 transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-xs font-sans text-center text-allos-navy/50">
          Don't have an account? <Link href="/auth/signup" className="text-allos-olive hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}