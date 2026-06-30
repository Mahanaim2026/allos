import Link from 'next/link';
import AllosLogo from '@/components/AllosLogo';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-allos-sand via-white to-allos-sky/10 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <AllosLogo size="md" variant="full" />
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="max-w-md mx-auto">
          {/* Icon mark large */}
          <div className="flex justify-center mb-8">
            <AllosLogo size="xl" variant="icon" />
          </div>

          <h1 className="text-3xl font-serif font-semibold text-allos-navy mb-4 leading-tight">
            Scripture for the Season{' '}
            <span className="text-allos-gold">You&apos;re In</span>
          </h1>

          <p className="text-allos-clay/80 text-lg mb-2 font-serif italic">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </p>
          <p className="text-allos-olive text-sm mb-10">— Psalm 119:105 (WEB)</p>

          <p className="text-gray-600 mb-10 leading-relaxed">
            Allos meets you where you are — whether weary, hopeful, confused, or grateful —
            and offers Scripture-grounded encouragement for the exact season of your soul.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              href="/app"
              className="w-full bg-allos-navy text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-allos-navy/90 transition-colors shadow-md"
            >
              Find My Scripture
            </Link>
            <Link
              href="/auth/login"
              className="w-full border-2 border-allos-navy text-allos-navy py-3 px-8 rounded-xl font-medium hover:bg-allos-navy/5 transition-colors"
            >
              Sign In to Save Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-16">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/70 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl mb-2">✝️</div>
            <p className="text-xs text-allos-navy font-medium">Scripture-First</p>
            <p className="text-xs text-gray-500 mt-1">Every response grounded in God&apos;s Word</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🗺️</div>
            <p className="text-xs text-allos-navy font-medium">Your Journey</p>
            <p className="text-xs text-gray-500 mt-1">Save and revisit what speaks to you</p>
          </div>
          <div className="bg-white/70 rounded-2xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🕊️</div>
            <p className="text-xs text-allos-navy font-medium">Spirit-Led</p>
            <p className="text-xs text-gray-500 mt-1">Not a chatbot — a devotional companion</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 text-center">
        <p className="text-xs text-gray-400">
          © 2026 Allos · Built with reverence · Not a replacement for pastoral care
        </p>
        <p className="text-xs text-gray-300 mt-1">word2go.com</p>
      </footer>
    </main>
  );
}