"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { blogPosts } from "../data/blogs";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";

// Blog Card Component with scroll animations
const BlogCard = ({
  post,
  index,
  palette,
}: {
  post: (typeof blogPosts)[0];
  index: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const { isVisible } = useScrollAnimation(cardRef, { threshold: 0.1 });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        ref={cardRef}
        className="p-4 sm:p-6 rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer touch-manipulation"
        style={{
          backgroundColor: palette.surface,
          border: `1px solid ${palette.border}`,
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 30}px)`,
          transitionDelay: `${index * 100}ms`,
        }}
      >
        <div
          className="text-sm mb-3 font-medium"
          style={{ color: palette.primary }}
        >
          {formatDate(post.date)}
        </div>
        <h3
          className="text-xl font-semibold mb-4 group-hover:underline transition-all duration-300"
          style={{ color: palette.text }}
        >
          {post.title}
        </h3>
        <p
          className="text-sm mb-4 leading-relaxed"
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
  );
};

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
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 transition-all duration-300 hover:scale-105"
          style={{ color: palette.text }}
        >
          Blog
        </h1>
        <div
          className="w-24 h-1 mb-12 rounded-full"
          style={{ backgroundColor: palette.primary }}
        />
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              palette={palette}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
