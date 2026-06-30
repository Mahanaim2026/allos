'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import AllosLogo from '@/components/AllosLogo';

const DENOMINATIONS = ['Non-denominational','Baptist','Pentecostal / Charismatic','Methodist','Anglican / Episcopal','Presbyterian','Lutheran','Catholic','Orthodox','Reformed','Adventist','Other / Prefer not to say'];

const GoogleIcon = () => (<svg width='18' height='18' viewBox='0 0 18 18' fill='none'><path d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z' fill='#4285F4'/><path d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z' fill='#34A853'/><path d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z' fill='#FBBC05'/><path d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z' fill='#EA4335'/></svg>);

export default function SignupPage() {
  const [step, setStep] = useState<'account' | 'profile'>('account');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function handleGoogleSignup() {
    setGoogleLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } });
    if (error) { setError(error.message); setGoogleLoading(false); }
  }

  async function handleAccountStep(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setStep('profile'); setError('');
  }

  async function createAccount() {
    setLoading(true); setError('');
    const displayName = [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0];
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: displayName, first_name: firstName, last_name: lastName }, emailRedirectTo: window.location.origin + '/auth/callback' } });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) { await supabase.from('profiles').upsert({ id: data.user.id, email, display_name: displayName, first_name: firstName, last_name: lastName, denomination, country }); }
    window.location.href = '/journey';
  }

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10'>
      <div className='w-full max-w-sm'>
        <div className='flex justify-center mb-8'><AllosLogo size='md' variant='full' /></div>
        {step === 'account' && (<>
          <h1 className='text-2xl font-serif font-medium text-allos-navy text-center mb-1'>Begin your journey</h1>
          <p className='text-sm text-slate-400 text-center mb-8'>Free account — your Scripture history, saved forever</p>
          <button onClick={handleGoogleSignup} disabled={googleLoading} className='w-full flex items-center justify-center gap-3 border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors mb-4 disabled:opacity-50'>
            <GoogleIcon />{googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>
          <div className='flex items-center gap-3 mb-4'><div className='flex-1 h-px bg-slate-100' /><span className='text-xs text-slate-300'>or</span><div className='flex-1 h-px bg-slate-100' /></div>
          <form onSubmit={handleAccountStep} className='space-y-3'>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='Email address' className='w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue' />
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} required placeholder='Password (8+ characters)' className='w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue' />
            {error && <p className='text-red-500 text-xs'>{error}</p>}
            <button type='submit' className='w-full bg-allos-navy text-white py-3.5 rounded-2xl font-medium text-sm hover:bg-allos-blue transition-colors'>Continue</button>
          </form>
        </>)}
        {step === 'profile' && (<>
          <h1 className='text-2xl font-serif font-medium text-allos-navy text-center mb-1'>About you</h1>
          <p className='text-sm text-slate-400 text-center mb-8'>All optional — helps personalise your journey</p>
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <input type='text' value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='First name' className='flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue' />
              <input type='text' value={lastName} onChange={e => setLastName(e.target.value)} placeholder='Last name' className='flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue' />
            </div>
            <select value={denomination} onChange={e => setDenomination(e.target.value)} className='w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 focus:outline-none focus:border-allos-blue bg-white'>
              <option value=''>Church tradition (optional)</option>
              {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type='text' value={country} onChange={e => setCountry(e.target.value)} placeholder='Country (optional)' className='w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-allos-blue' />
            {error && <p className='text-red-500 text-xs'>{error}</p>}
            <button onClick={createAccount} disabled={loading} className='w-full bg-allos-navy text-white py-3.5 rounded-2xl font-medium text-sm hover:bg-allos-blue transition-colors disabled:opacity-50'>{loading ? 'Creating...' : 'Create my account'}</button>
            <button type='button' onClick={createAccount} className='w-full text-slate-400 text-xs hover:underline'>Skip for now</button>
          </div>
        </>)}
        <p className='text-center text-sm text-slate-400 mt-6'>Already have an account?{' '}<Link href='/auth/login' className='text-allos-blue font-medium hover:underline'>Sign in</Link></p>
      </div>
    </div>
  );
}