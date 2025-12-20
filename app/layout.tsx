import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

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
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Kevin Chen — Portfolio",
  description: "Engineer & Creative Developer. Portfolio for Kevin Chen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          To use IvyPresto Display Thin via Adobe Fonts:
          1. Get your Adobe Fonts kit ID from fonts.adobe.com
          2. Add this line before the script tag:
             <link rel="stylesheet" href="https://use.typekit.net/[your-kit-id].css">
          3. Update the fontFamily in page.tsx to use "ivypresto-display" as the first font
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  const palette = theme === 'dark' 
                    ? { background: '#0a0a0f' }
                    : { background: '#3c2414' };
                  document.documentElement.style.setProperty('--initial-bg', palette.background);
                  if (document.body) {
                    document.body.style.backgroundColor = palette.background;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
