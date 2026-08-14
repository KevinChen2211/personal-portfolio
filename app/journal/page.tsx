"use client";

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../data/blogs";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import { usePrefersReducedMotion } from "../utils/motion";
import Navbar from "../components/Navbar";
import { formatDate } from "../utils/date";
import { readingTime } from "../utils/reading-time";
import { extractFirstImagePath } from "../utils/image-marker";

// Journal Card Component with scroll animations
const JournalCard = ({
  post,
  index,
}: {
  post: (typeof blogPosts)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollAnimation(cardRef, { threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const textColor = "#2C2C2C";
  const imageUrl = extractFirstImagePath(post.content);

  return (
    <div
      ref={cardRef}
      className="flex flex-col touch-manipulation"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: prefersReducedMotion
          ? "none"
          : `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 180}ms`,
        transitionProperty: prefersReducedMotion ? "opacity" : "opacity, transform",
        transitionDuration: "var(--duration-slow)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <Link href={`/journal/${post.slug}`} className="group">
        {/* Image */}
        <div className="relative w-full mb-2 overflow-hidden">
          <div
            className="relative w-full"
            style={{
              aspectRatio: "0.75 / 1",
              maxHeight: "calc(100vh - 320px)",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-opacity duration-700 group-hover:opacity-88"
                sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 400px"
                quality={70}
                priority={index === 0}
                loading={index < 3 ? "eager" : "lazy"}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: textColor, opacity: 0.1 }}
              >
                <span
                  className="text-4xl"
                  style={{ color: textColor, opacity: 0.3 }}
                >
                  📝
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 justify-center">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${textColor}15`,
                  color: textColor,
                  border: `1px solid ${textColor}40`,
                  fontFamily:
                    "var(--font-serif)",
                  opacity: 0.8,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2
          className="text-4xl md:text-4xl lg:text-6xl xl:text-6xl text-center transition-opacity duration-500 group-hover:opacity-75 mb-2"
          style={{
            color: textColor,
            fontFamily:
              "var(--font-serif-title)",
          }}
        >
          {post.title}
        </h2>

        {/* Date · reading time */}
        <div
          className="text-xs md:text-sm text-center"
          style={{
            color: textColor,
            fontFamily:
              "var(--font-serif)",
            opacity: 0.7,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatDate(post.date)} · {readingTime(post.content)} min read
        </div>
      </Link>
    </div>
  );
};

export default function JournalPage() {
  const bgColor = "#FAF2E6";

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-24 md:pt-24 md:pb-32">
        <div className="site-container">
          <h1 className="sr-only">Journal</h1>
          <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            {blogPosts.map((post, index) => (
              <JournalCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
