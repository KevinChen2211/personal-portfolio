import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import ReactDOM from "react-dom";
import "./globals.css";
import { siteConfig } from "./lib/site";
import { personSchema, websiteSchema } from "./lib/structured-data";
import JsonLd from "./components/JsonLd";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s · Kevin Chen",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Kevin Chen",
    "engineer",
    "creative developer",
    "robotics",
    "embedded systems",
    "photography",
    "portfolio",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },
  // Explicit indexing directives. `max-image-preview: large` lets Google show
  // full-size image previews for the photography work, and `max-snippet: -1`
  // removes the text-snippet length cap in results.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload the two above-the-fold custom fonts (loaded via @font-face in
  // globals.css, which the browser only discovers after CSS parses). Juana
  // drives the hero/nav/titles and Sweet Rosetia Sans the wordmark, so getting
  // them in flight early cuts the flash-of-unstyled-text and helps LCP.
  // `crossOrigin: "anonymous"` is required — fonts are always fetched in CORS
  // mode, so without it the preload wouldn't match the @font-face request.
  ReactDOM.preload("/fonts/Juana%20ExtraLight.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload("/fonts/sweet-sans-pro-regular.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd data={[personSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
