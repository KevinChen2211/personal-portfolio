"use client";

import { use, useRef } from "react";
import { getActivePalette } from "../../color-palettes";
import { useTheme } from "../../components/ThemeProvider";
import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
import { blogPosts } from "../../data/blogs";
import { useScrollAnimation } from "../../components/useScrollAnimation";
import { formatDate } from "../../utils/date";
import { parseMarkdown } from "../../utils/markdown";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function JournalPostPage({ params }: JournalPostPageProps) {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const { slug } = use(params);
  const articleRef = useRef<HTMLElement>(null);
  const { isVisible } = useScrollAnimation(articleRef, { threshold: 0.1 });

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div
        className="min-h-screen px-6 sm:px-10 py-16 relative flex items-center justify-center"
        style={{
          backgroundColor: palette.background,
          color: palette.text,
        }}
      >
        <ThemeToggle />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link
            href="/journal"
            className="text-lg hover:underline"
            style={{ color: palette.primary }}
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

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
          href="/journal"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: palette.primary }}
        >
          ← Back to Journal
        </Link>

        <article
          ref={articleRef}
          className="p-4 sm:p-8 md:p-12 rounded-lg transition-all duration-500 hover:shadow-lg"
          style={{
            backgroundColor: palette.surface,
            border: `1px solid ${palette.border}`,
            opacity: isVisible ? 1 : 0,
            transform: `translateY(${isVisible ? 0 : 30}px)`,
          }}
        >
          <div
            className="text-sm mb-4 font-medium"
            style={{ color: palette.primary }}
          >
            {formatDate(post.date)}
            {post.author && ` • ${post.author}`}
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
            style={{ color: palette.text }}
          >
            {post.title}
          </h1>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: palette.border,
                    color: palette.textSecondary,
                    border: `1px solid ${palette.primary}20`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            style={{
              color: palette.textSecondary,
              lineHeight: "1.8",
            }}
          >
            {parseMarkdown(post.content, { palette })}
          </div>
        </article>
      </div>
    </div>
  );
}
