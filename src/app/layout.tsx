import type { Metadata } from 'next';
import { Spectral, Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Allos — Scripture for the Season You\'re In',
  description: 'Bring your heart before the Word. Receive Bible-grounded encouragement for the season you\'re walking through.',
  keywords: ['scripture', 'Bible', 'prayer', 'devotional', 'Christian', 'encouragement'],
  openGraph: {
    title: 'Allos',
    description: 'Scripture for the Season You\'re In',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spectral.variable} ${hanken.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
