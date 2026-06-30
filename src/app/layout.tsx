import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allos – Scripture for the Season You're In',
  description: 'Bring your heart before the Word and receive Bible-grounded encouragement, prayer, and reflection.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-allos-cream text-allos-navy antialiased">
        {children}
      </body>
    </html>
  );
}