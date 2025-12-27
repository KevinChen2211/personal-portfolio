"use client";

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "../data/blogs";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import Navbar from "../components/Navbar";
import { formatDate } from "../utils/date";

// Extract first image from blog content
function getFirstImage(content: string): string | null {
  const imageMatch = content.match(/!\[IMAGE:(.+?)\]/);
  return imageMatch ? imageMatch[1] : null;
}

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
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";
  const imageUrl = getFirstImage(post.content);

  return (
    <div
      ref={cardRef}
      className="flex flex-col transition-all duration-500 touch-manipulation"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Link href={`/journal/${post.slug}`} className="group">
        {/* Image */}
        <div className="relative w-full mb-3 overflow-hidden">
          <div
            className="relative w-full"
            style={{
              aspectRatio: "0.75 / 1",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 800px"
                quality={100}
                priority={index < 3}
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
                    "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                  opacity: 0.8,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3
          className="text-4xl md:text-4xl lg:text-6xl xl:text-6xl text-center group-hover:underline transition-all mb-2"
          style={{
            color: textColor,
            fontFamily:
              '"Mencken Std Head Narrow", "Juana", var(--font-display), "Playfair Display", "Times New Roman", serif',
          }}
        >
          {post.title}
        </h3>

        {/* Date */}
        <div
          className="text-xs md:text-sm text-center"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            opacity: 0.7,
          }}
        >
          {formatDate(post.date)}
        </div>
      </Link>
    </div>
  );
};

export default function JournalPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-24 md:py-32">
        <div className="max-w-[98vw] xl:max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-12 lg:gap-16 xl:gap-20">
            {blogPosts.map((post, index) => (
              <JournalCard key={post.id} post={post} index={index} />
            ))}
          </div>
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
