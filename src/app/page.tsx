'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function Home() {
  
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/app');
    });
  }, []);

return (
    <div style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif", background: '#F6F9FB', color: '#1B3A57', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid #DBE5EE', background: '#F6F9FB', position: 'sticky', top: 0, zIndex: 50 }}>
        <AllosLogo size={36} variant="light" showWordmark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/auth/login" style={{ color: '#54677A', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Sign in</Link>
          <Link href="/auth/signup" style={{ background: '#1B3A57', color: '#F6F9FB', padding: '10px 22px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Begin a season</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <p style={{ fontFamily: "'Hanken Grotesk'", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', marginBottom: 20, margin: '0 0 20px' }}>SCRIPTURE-GUIDED ENCOURAGEMENT</p>
          <h1 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, lineHeight: 1.25, color: '#1B3A57', margin: '0 0 24px', maxWidth: 480 }}>
            Bring your heart before the Word. Receive encouragement for the season you&apos;re walking through.
          </h1>
          <p style={{ color: '#54677A', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 420, margin: '0 0 36px' }}>
            Allos is a Scripture-guided companion. Share your mood, struggle, or spiritual need â and receive Bible-grounded prayer, meditation, sermonette, or declaration.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/auth/signup" style={{ background: '#1B3A57', color: '#F6F9FB', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 600, display: 'inline-block' }}>Begin a season</Link>
            <Link href="/app" style={{ border: '1px solid #DBE5EE', color: '#1B3A57', padding: '14px 28px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 500, display: 'inline-block' }}>Try as guest</Link>
          </div>
        </div>

        {/* MARK DISPLAY */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#1B3A57', borderRadius: '50%', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 64px rgba(27,58,87,0.18)' }}>
            <AllosLogo size={120} variant="dark" />
          </div>
        </div>
      </section>

      {/* EYEBROW â THE NAME */}
      <section style={{ background: '#E8F0F7', borderTop: '1px solid #DBE5EE', borderBottom: '1px solid #DBE5EE', padding: '56px 32px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Hanken Grotesk'", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', marginBottom: 16 }}>THE NAME</p>
          <h2 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 300, color: '#1B3A57', margin: '0 0 20px', lineHeight: 1.3 }}>
            Allos â Another Comforter
          </h2>
          <p style={{ color: '#54677A', fontSize: '1.05rem', lineHeight: 1.75, margin: 0 }}>
            In John 14, Jesus promised <em>allos parakletos</em> â another Helper, another Comforter. The same Greek word He used to describe the Holy Spirit. Allos is built on that same promise: that you are not alone in your season, and that the Word of God speaks directly into where you are.
          </p>
          <div style={{ marginTop: 28, fontFamily: "'Spectral', Georgia, serif", fontSize: '1.2rem', fontStyle: 'italic', color: '#6E9CC4' }}>
            &ldquo;I will not leave you as orphans; I will come to you.&rdquo;
          </div>
          <div style={{ marginTop: 8, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6E9CC4' }}>John 14:18 &middot; WEB</div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 32px' }}>
        <p style={{ fontFamily: "'Hanken Grotesk'", fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#6E9CC4', textAlign: 'center', marginBottom: 12 }}>HOW IT WORKS</p>
        <h2 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 400, textAlign: 'center', color: '#1B3A57', margin: '0 0 48px' }}>Four steps. One season at a time.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {[
            { n: '01', t: 'Name your season', d: 'Choose your mood, a struggle, a life challenge, or a spiritual need â whatever is most present right now.' },
            { n: '02', t: 'Choose your format', d: 'Prayer, sermonette, meditation, declaration, exhortation, or a worshipful song or poem.' },
            { n: '03', t: 'Receive the Word', d: 'Allos generates a Scripture-grounded response using real Bible passages â never invented verses.' },
            { n: '04', t: 'Save to your Journey', d: 'Every response is saved to your personal Journey. Add reflections. Return to it. Grow.' },
          ].map((s) => (
            <div key={s.n} style={{ background: '#F6F9FB', border: '1px solid #DBE5EE', borderRadius: 16, padding: '28px 24px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.28em', color: '#C8943F', marginBottom: 12, textTransform: 'uppercase' }}>{s.n}</div>
              <div style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: '1.15rem', fontWeight: 500, color: '#1B3A57', marginBottom: 10 }}>{s.t}</div>
              <div style={{ color: '#54677A', fontSize: '0.9rem', lineHeight: 1.65 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ background: '#1B3A57', padding: '56px 32px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Spectral', Georgia, serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: '#F6F9FB', margin: '0 0 12px' }}>Your season is not wasted.</h2>
        <p style={{ color: '#CFE0EE', fontSize: '1.05rem', marginBottom: 32, fontStyle: 'italic', fontFamily: "'Spectral', Georgia, serif" }}>The Word speaks into it.</p>
        <Link href="/auth/signup" style={{ background: '#F6F9FB', color: '#1B3A57', padding: '15px 32px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, display: 'inline-block' }}>Begin a season â it is free</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#122A40', color: '#CFE0EE', padding: '32px', textAlign: 'center', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          <AllosLogo size={24} variant="dark" />
          <span style={{ fontFamily: "'Spectral', Georgia, serif", color: '#F6F9FB' }}>Allos</span>
        </div>
        <p style={{ margin: '0 0 6px', color: '#CFE0EE' }}>Scripture for the Season You&apos;re In</p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6E9CC4' }}>
          Powered by{' '}
          <a href="https://www.mahanaiminstitute.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6E9CC4', textDecoration: 'underline' }}>
            Mahanaim Institute
          </a>
        </p>
      </footer>
    </div>
  );
}
