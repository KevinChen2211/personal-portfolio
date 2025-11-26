"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function ProjectsPage() {
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
      <div className="max-w-6xl mx-auto">
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
          Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <div
              key={project}
              className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: palette.surface,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div
                className="h-48 rounded-md mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: palette.border,
                }}
              >
                <span style={{ color: palette.textSecondary }}>
                  Project {project}
                </span>
              </div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: palette.text }}
              >
                Project Title {project}
              </h3>
              <p style={{ color: palette.textSecondary }}>
                Detailed description of the project, technologies used, and key
                features. This is the expanded projects page.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

