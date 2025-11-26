"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function ContactPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16 relative"
      style={{
        backgroundColor: palette.background,
        color: palette.text,
      }}
    >
      <ThemeToggle />
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg hover:underline"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{ color: palette.text }}
        >
          Get In Touch
        </h1>
        <div
          className="p-8 rounded-lg mb-8"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p
            className="text-xl mb-8"
            style={{ color: palette.textSecondary }}
          >
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <div className="space-y-6">
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: palette.text }}
              >
                Email
              </h3>
              <a
                href="mailto:contact@kevinchen.com"
                className="hover:underline"
                style={{ color: palette.primary }}
              >
                contact@kevinchen.com
              </a>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: palette.text }}
              >
                LinkedIn
              </h3>
              <a
                href="https://www.linkedin.com/in/kevinsoftwarewiz"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                style={{ color: palette.primary }}
              >
                linkedin.com/in/kevinsoftwarewiz
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="https://www.linkedin.com/in/kevinsoftwarewiz"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-center"
            style={{
              backgroundColor: palette.primary,
              color: palette.text,
            }}
          >
            Connect on LinkedIn
          </Link>
          <a
            href="mailto:contact@kevinchen.com"
            className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-center"
            style={{
              backgroundColor: palette.surface,
              color: palette.text,
              border: `2px solid ${palette.primary}`,
            }}
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

