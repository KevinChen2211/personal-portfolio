"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function AboutPage() {
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
      <div className="max-w-4xl mx-auto">
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
          About Me
        </h1>
        <div
          className="p-8 rounded-lg mb-8"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
          }}
        >
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: palette.textSecondary }}
          >
            I'm a software engineer passionate about creating meaningful digital
            experiences. With a focus on clean code, elegant design, and
            user-centered thinking, I build applications that solve real problems.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: palette.textSecondary }}
          >
            My expertise spans full-stack development, with particular interest in
            modern web technologies, performance optimization, and creating
            intuitive user interfaces.
          </p>
          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: palette.textSecondary }}
          >
            This is the expanded about page with more detailed information about my
            background, experience, and interests.
          </p>
        </div>
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
          }}
        >
          <h3
            className="text-2xl font-semibold mb-6"
            style={{ color: palette.text }}
          >
            Skills & Technologies
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "TypeScript",
              "Next.js",
              "Node.js",
              "Python",
              "Design",
              "UI/UX",
              "GraphQL",
              "PostgreSQL",
              "AWS",
              "Docker",
              "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full text-sm"
                style={{
                  backgroundColor: palette.border,
                  color: palette.text,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

