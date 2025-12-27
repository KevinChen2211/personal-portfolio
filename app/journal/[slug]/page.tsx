"use client";

import { use, useRef } from "react";
import Link from "next/link";
import { blogPosts } from "../../data/blogs";
import { useScrollAnimation } from "../../components/useScrollAnimation";
import { formatDate } from "../../utils/date";
import { parseMarkdown } from "../../utils/markdown";
import Navbar from "../../components/Navbar";

interface JournalPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function JournalPostPage({ params }: JournalPostPageProps) {
  const { slug } = use(params);
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";
  const articleRef = useRef<HTMLElement>(null);
  const { isVisible } = useScrollAnimation(articleRef, { threshold: 0.1 });

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div
        className="min-h-screen w-full relative"
        style={{ backgroundColor: bgColor }}
      >
        <Navbar />
        <div className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-24 md:py-32 flex items-center justify-center">
          <div className="text-center">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-6"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              Post Not Found
            </h1>
            <Link
              href="/journal"
              className="text-base md:text-lg hover:underline"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              ← Back to Journal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/journal"
            className="inline-block mb-8 text-sm md:text-base hover:underline"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              opacity: 0.8,
            }}
          >
            ← Back to Journal
          </Link>

          {/* Article */}
          <article
            ref={articleRef}
            className="transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : 30}px)`,
            }}
          >
            {/* Date and Author */}
            <div
              className="text-sm mb-4 font-medium"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                opacity: 0.7,
              }}
            >
              {formatDate(post.date)}
              {post.author && ` • ${post.author}`}
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6 leading-tight"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${textColor}15`,
                      color: textColor,
                      border: `1px solid ${textColor}40`,
                      fontFamily:
                        "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                      opacity: 0.8,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              style={{
                color: textColor,
                lineHeight: "1.8",
              }}
            >
              {parseMarkdown(post.content, {
                palette: {
                  text: textColor,
                  textSecondary: textColor,
                  border: textColor,
                  primary: textColor,
                },
              })}
            </div>
          </article>
        </div>
      </main>
      <footer
        className="w-full py-12 flex justify-center items-center"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: "'Juana', var(--font-display), 'Playfair Display', serif",
        }}
      >
        © Kevin Chen
      </footer>
    </div>
  );
}
