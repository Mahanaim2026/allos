import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
    themeColor: '#0A2342',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'Allos \u2014 Scripture for the Season You\'re In',
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
          apple: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
                ],
          shortcut: '/favicon.svg',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
          <html lang="en" className={`${spectral.variable} ${hanken.variable}`}>
                  <head>
                    {/* Mobile web app meta */}
                          <meta name="mobile-web-app-capable" content="yes" />
                          <meta name="apple-mobile-web-app-capable" content="yes" />
                          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                          <meta name="apple-mobile-web-app-title" content="Allos" />
                  </head>head>
                <body>{children}</body>body>
          </html>html>
        );
}</head>
