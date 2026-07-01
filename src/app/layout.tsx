import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allos â Scripture for the Season You\'re In',
  description: 'Bring your heart before the Word. Receive Bible-grounded encouragement for the season you\'re walking through.',
  keywords: ['scripture', 'Bible', 'prayer', 'devotional', 'Christian', 'encouragement'],
  openGraph: {
    title: 'Allos',
    description: 'Scripture for the Season You\'re In',
    url: 'https://www.word2go.com',
    siteName: 'Allos',
    type: 'website',
  },
  themeColor: '#1B3A57',
  viewport: { width: 'device-width', initialScale: 1 },,
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
