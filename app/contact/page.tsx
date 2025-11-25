import { activePalette } from "../color-palettes";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16"
      style={{
        backgroundColor: activePalette.background,
        color: activePalette.text,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg hover:underline"
          style={{ color: activePalette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{ color: activePalette.text }}
        >
          Get In Touch
        </h1>
        <div
          className="p-8 rounded-lg mb-8"
          style={{
            backgroundColor: activePalette.surface,
            border: `1px solid ${activePalette.border}`,
          }}
        >
          <p
            className="text-xl mb-8"
            style={{ color: activePalette.textSecondary }}
          >
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <div className="space-y-6">
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: activePalette.text }}
              >
                Email
              </h3>
              <a
                href="mailto:contact@kevinchen.com"
                className="hover:underline"
                style={{ color: activePalette.primary }}
              >
                contact@kevinchen.com
              </a>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: activePalette.text }}
              >
                LinkedIn
              </h3>
              <a
                href="https://www.linkedin.com/in/kevinsoftwarewiz"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
                style={{ color: activePalette.primary }}
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
              backgroundColor: activePalette.primary,
              color: activePalette.text,
            }}
          >
            Connect on LinkedIn
          </Link>
          <a
            href="mailto:contact@kevinchen.com"
            className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-center"
            style={{
              backgroundColor: activePalette.surface,
              color: activePalette.text,
              border: `2px solid ${activePalette.primary}`,
            }}
          >
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

