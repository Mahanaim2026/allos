import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Allos – Scripture for the Season You're In",
  description: "Allos meets you where you are — whether weary, hopeful, confused, or grateful — and offers Scripture-grounded encouragement for the exact season of your soul.",
  keywords: ["scripture", "bible", "devotional", "encouragement", "Christian", "faith"],
  authors: [{ name: "Allos" }],
  openGraph: {
    title: "Allos – Scripture for the Season You're In",
    description: "Scripture-grounded encouragement for every season of life.",
    url: "https://word2go.com",
    siteName: "Allos",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Allos – Scripture for the Season You're In",
    description: "Scripture-grounded encouragement for every season of life.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1C3154",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}