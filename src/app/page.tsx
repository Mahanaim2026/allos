import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-allos-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-allos-warm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-allos-navy tracking-wide">Allos</h1>
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/journey" className="text-allos-olive hover:text-allos-navy transition-colors">Journey</Link>
          <Link href="/auth/login" className="text-allos-olive hover:text-allos-navy transition-colors">Sign In</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-allos-olive text-sm uppercase tracking-widest mb-4 font-sans">A devotional companion</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-allos-navy leading-snug mb-6">
            Scripture for the<br />Season You're In
          </h2>
          <p className="text-allos-navy/70 text-lg leading-relaxed mb-10 font-sans">
            Bring your heart before the Word and receive Bible-grounded encouragement, prayer, and reflection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app"
              className="bg-allos-navy text-allos-cream px-8 py-4 rounded-lg font-sans font-medium text-base hover:bg-allos-navy/90 transition-colors shadow-sm"
            >
              Begin
            </Link>
            <Link
              href="/journey"
              className="border border-allos-navy/30 text-allos-navy px-8 py-4 rounded-lg font-sans font-medium text-base hover:bg-allos-warm transition-colors"
            >
              View Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Trust note */}
      <footer className="px-6 py-6 text-center border-t border-allos-warm">
        <p className="text-xs text-allos-navy/50 font-sans max-w-md mx-auto leading-relaxed">
          Scripture-guided encouragement — not a replacement for Scripture, church, pastoral care, licensed counseling, medical care, or emergency support.
        </p>
        <p className="text-xs text-allos-navy/30 font-sans mt-2">© 2026 Allos</p>
      </footer>
    </main>
  );
}