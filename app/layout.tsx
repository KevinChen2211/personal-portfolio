import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Playfair Display as fallback for IvyPresto Display Thin
// To use IvyPresto Display Thin, add it via Adobe Fonts and replace this
// Note: Playfair Display doesn't have weight 300, so we use 400 and apply font-weight: 300 in CSS
// which will use browser font synthesis for a thinner appearance
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const siteUrl = "https://kevinchen.com.au";
const siteName = "Kevin Chen";
const siteDescription =
  "Portfolio of Kevin Chen — engineer and creative developer working across robotics, embedded systems, software, and photography.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kevin Chen — Engineer & Creative Developer",
    template: "%s · Kevin Chen",
  },
  description: siteDescription,
  keywords: [
    "Kevin Chen",
    "engineer",
    "creative developer",
    "robotics",
    "embedded systems",
    "photography",
    "portfolio",
  ],
  authors: [{ name: "Kevin Chen", url: siteUrl }],
  creator: "Kevin Chen",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName,
    title: "Kevin Chen — Engineer & Creative Developer",
    description: siteDescription,
    images: [
      {
        url: "/images/KevinChen.jpg",
        alt: "Kevin Chen",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Chen — Engineer & Creative Developer",
    description: siteDescription,
    images: ["/images/KevinChen.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
