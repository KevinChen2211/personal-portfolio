"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { blogPosts } from "../data/blogs";

export default function BlogPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          className="inline-block mb-8 text-lg hover:underline transition-all duration-300"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{
            backgroundImage: `linear-gradient(135deg, ${palette.text}, ${palette.primary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Blog
        </h1>
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article
                className="p-8 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                style={{
                  backgroundColor: palette.surface,
                  border: `1px solid ${palette.border}`,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="text-sm mb-3 font-medium"
                  style={{ color: palette.primary }}
                >
                  {formatDate(post.date)}
                </div>
                <h3
                  className="text-3xl font-semibold mb-4 group-hover:underline transition-all duration-300"
                  style={{ color: palette.text }}
                >
                  {post.title}
                </h3>
                <p
                  className="mb-4 leading-relaxed"
                  style={{ color: palette.textSecondary }}
                >
                  {post.excerpt}
                </p>
                <div
                  className="text-sm font-medium inline-flex items-center gap-2"
                  style={{ color: palette.primary }}
                >
                  Read more →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

