import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="w-full px-6 pt-7 pb-4 flex items-center justify-between max-w-2xl mx-auto">
        <AllosLogo size="sm" variant="full" />
        <Link href="/auth/login" className="text-sm font-medium text-allos-blue hover:text-allos-navy transition-colors">
          Sign in
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center px-6 pt-8 pb-6 max-w-2xl mx-auto w-full">

        <div className="mb-7">
          <AllosLogo size="xl" variant="icon" />
        </div>

        {/* Primary headline — from original handoff vision */}
        <h1 className="text-4xl font-serif font-medium text-allos-navy text-center leading-tight tracking-tight mb-3">
          God&rsquo;s Word.<br />
          <span className="text-allos-blue">Your Exact Season.</span>
        </h1>

        <p className="text-base text-slate-500 text-center leading-relaxed max-w-sm mb-3">
          Allos is not an AI pastor, a chatbot, or a spiritual algorithm.<br />
          It is a quiet place where Scripture meets<br />
          the exact moment you are living right now.
        </p>

        <p className="text-sm text-allos-blue font-medium text-center mb-10 italic">
          Tell Allos what season you are in. Receive something real.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs mb-14">
          <Link href="/app"
            className="w-full bg-allos-navy text-white text-center py-4 px-6 rounded-2xl font-medium text-base tracking-wide hover:bg-allos-blue transition-colors shadow-sm">
            Find My Scripture
          </Link>
          <Link href="/auth/signup"
            className="w-full border border-allos-navy/20 text-allos-navy text-center py-3.5 px-6 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors">
            Create a free account
          </Link>
        </div>

        {/* ── About: Allos Parakletos ──────────────────────── */}
        <div className="w-full border-t border-slate-100 pt-12 pb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-allos-blue uppercase text-center mb-8">
            What is Allos?
          </p>

          <div className="space-y-6 text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            <p>
              In John 14:16, Jesus made a promise:{' '}
              <em className="text-allos-navy not-italic font-medium">
                &ldquo;I will ask the Father, and he will give you another Comforter, that he may be with you forever.&rdquo;
              </em>{' '}
              The word He used was{' '}
              <strong className="text-allos-navy font-semibold">allos</strong>{' '}
              — Greek for <em>&ldquo;another of the same kind.&rdquo;</em> Another Paraclete. One called alongside to help.
            </p>

            <p>
              That is the spirit this app is built in. Allos does not speak <em>for</em> God — it holds the Word <em>out</em> to you, faithfully and gently, so that the Spirit who lives in you can do what only He can do.
            </p>

            <p>
              Whether you are{' '}
              <span className="text-allos-navy font-medium">anxious at 2am</span>,{' '}
              <span className="text-allos-navy font-medium">grieving a loss</span>,{' '}
              <span className="text-allos-navy font-medium">waiting on a promise</span>, or{' '}
              <span className="text-allos-navy font-medium">on the verge of breakthrough</span>{' '}
              — there is a Scripture for this season. Let Allos find it for you.
            </p>
          </div>
        </div>

        {/* ── How it works ────────────────────────────────── */}
        <div className="w-full mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-allos-blue uppercase text-center mb-8">
            How it works
          </p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {[
              { n: '1', t: 'Share your season', d: 'Tell Allos your mood, struggle, life challenge, and spiritual need' },
              { n: '2', t: 'Choose your format', d: 'Prayer, Sermonette, Declaration, Meditation, and more' },
              { n: '3', t: 'Receive your Word', d: 'Scripture-grounded, personally addressed to your exact moment' },
              { n: '4', t: 'Save your journey', d: 'Every entry saved, searchable, with space for your own reflection' },
            ].map(({ n, t, d }) => (
              <div key={n} className="bg-slate-50 rounded-2xl p-4">
                <span className="inline-block w-6 h-6 rounded-full bg-allos-blue text-white text-xs font-bold text-center leading-6 mb-2">{n}</span>
                <p className="text-allos-navy text-xs font-semibold mb-1">{t}</p>
                <p className="text-slate-400 text-xs leading-snug">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scripture quote ──────────────────────────────── */}
        <blockquote className="w-full max-w-sm mx-auto border-l-2 border-allos-blue/30 pl-5 mb-14">
          <p className="font-serif text-base text-allos-navy italic leading-relaxed">
            &ldquo;Your word is a lamp to my feet,<br />and a light to my path.&rdquo;
          </p>
          <cite className="block mt-2 text-xs text-slate-400 not-italic tracking-wide">
            Psalm 119:105 &mdash; World English Bible
          </cite>
        </blockquote>

        {/* ── Safety note ─────────────────────────────────── */}
        <div className="w-full max-w-sm mx-auto bg-slate-50 rounded-2xl p-4 mb-10 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Not a replacement for pastoral care.</strong><br />
            If you are in crisis, Allos will always direct you to the 988 Lifeline first.
          </p>
        </div>

      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-100 px-6 py-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by{' '}
            <a href="https://www.mahanaiminstitute.com" target="_blank" rel="noopener noreferrer"
              className="text-allos-blue hover:underline font-medium">
              Mahanaim Institute
            </a>
          </p>
          <p className="text-xs text-slate-300">
            &copy; {new Date().getFullYear()} Allos &nbsp;&middot;&nbsp; Scripture only, never counsel &nbsp;&middot;&nbsp; word2go.com
          </p>
        </div>
      </footer>

    </main>
  );
}
