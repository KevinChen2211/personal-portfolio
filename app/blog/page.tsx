"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function BlogPage() {
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
          Blog
        </h1>
        <div className="space-y-12">
          {[1, 2, 3, 4, 5].map((post) => (
            <article
              key={post}
              className="p-8 rounded-lg"
              style={{
                backgroundColor: palette.surface,
                border: `1px solid ${palette.border}`,
              }}
            >
              <div
                className="text-sm mb-3 font-medium"
                style={{ color: palette.primary }}
              >
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h3
                className="text-3xl font-semibold mb-4"
                style={{ color: palette.text }}
              >
                Blog Post Title {post}
              </h3>
              <p
                className="mb-4 leading-relaxed"
                style={{ color: palette.textSecondary }}
              >
                This is the expanded blog page with full blog post content. Here
                you would write about your thoughts, experiences, and insights on
                software development, design, or other topics of interest.
              </p>
              <p style={{ color: palette.textSecondary }}>
                More detailed content would go here. This is placeholder text for
                the blog post content.
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

