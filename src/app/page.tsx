import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="w-full px-6 pt-7 pb-4 flex items-center justify-between max-w-2xl mx-auto">
        <AllosLogo size="sm" variant="full" />
        <Link
          href="/auth/login"
          className="text-sm font-medium text-allos-blue hover:text-allos-navy transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center px-6 pt-10 pb-6 max-w-2xl mx-auto w-full">

        {/* Large mark */}
        <div className="mb-8">
          <AllosLogo size="xl" variant="icon" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-serif font-medium text-allos-navy text-center leading-tight tracking-tight mb-5">
          Scripture for the<br />
          <span className="text-allos-blue">Season You&rsquo;re In</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-base text-slate-500 text-center leading-relaxed max-w-sm mb-10">
          Not a chatbot. Not an AI pastor.<br />
          A quiet space where Scripture meets your real life.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs mb-14">
          <Link
            href="/app"
            className="w-full bg-allos-navy text-white text-center py-4 px-6 rounded-2xl font-medium text-base tracking-wide hover:bg-allos-blue transition-colors shadow-sm"
          >
            Find My Scripture
          </Link>
          <Link
            href="/auth/signup"
            className="w-full border border-allos-navy/20 text-allos-navy text-center py-3.5 px-6 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors"
          >
            Create a free account
          </Link>
        </div>

        {/* ── About section ───────────────────────────────── */}
        <div className="w-full border-t border-slate-100 pt-12 pb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-allos-blue uppercase text-center mb-8">
            What is Allos?
          </p>

          <div className="space-y-7 text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            <p>
              In John 14:16, Jesus promised{' '}
              <em className="text-allos-navy not-italic font-medium">
                &ldquo;another Comforter&rdquo;
              </em>{' '}
              — using the Greek word{' '}
              <strong className="text-allos-navy font-semibold">allos</strong>,
              meaning <em>another of the same kind</em>. He was speaking of the Holy Spirit,
              the <em>Parakletos</em> — the one called alongside to help, counsel, and comfort.
            </p>

            <p>
              <strong className="text-allos-navy font-semibold">Allos</strong> is named in
              that spirit. It does not speak for God, invent revelation, or replace pastoral
              care. It does something simpler: it holds Scripture out to you — gently,
              faithfully — and lets the Word speak for itself.
            </p>

            <p>
              Tell Allos what season you are in. Receive something real.
            </p>
          </div>
        </div>

        {/* ── Features ────────────────────────────────────── */}
        <div className="w-full grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
          {[
            { icon: '✦', label: 'Scripture-First', desc: 'Every word grounded in the Bible' },
            { icon: '◎', label: 'Your Journey',    desc: 'Save what speaks to you' },
            { icon: '◈', label: 'Spirit-Led',      desc: 'Devotional, not diagnostic' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50">
              <span className="text-allos-blue text-lg mb-2">{icon}</span>
              <p className="text-allos-navy text-xs font-semibold mb-1">{label}</p>
              <p className="text-slate-400 text-xs leading-snug">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Scripture pull-quote ─────────────────────────── */}
        <blockquote className="w-full max-w-sm mx-auto border-l-2 border-allos-blue/30 pl-5 mb-14">
          <p className="font-serif text-base text-allos-navy italic leading-relaxed">
            &ldquo;Your word is a lamp to my feet,<br />and a light to my path.&rdquo;
          </p>
          <cite className="block mt-2 text-xs text-slate-400 not-italic tracking-wide">
            Psalm 119:105 &mdash; World English Bible
          </cite>
        </blockquote>

      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="w-full border-t border-slate-100 px-6 py-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by{' '}
            <a
              href="https://www.mahanaiminstitute.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-allos-blue hover:underline font-medium"
            >
              Mahanaim Institute
            </a>
          </p>
          <p className="text-xs text-slate-300">
            &copy; {new Date().getFullYear()} Allos &nbsp;·&nbsp; Scripture only, never counsel &nbsp;·&nbsp; word2go.com
          </p>
        </div>
      </footer>

    </main>
  );
}
