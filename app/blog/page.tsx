"use client";

import Link from "next/link";
import { blogPosts } from "../data/blogs";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import Navbar from "../components/Navbar";

// Blog Card Component with scroll animations
const BlogCard = ({
  post,
  index,
}: {
  post: (typeof blogPosts)[0];
  index: number;
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const { isVisible } = useScrollAnimation(cardRef, { threshold: 0.1 });
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

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
        className="p-4 sm:p-6 rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer touch-manipulation border"
        style={{
          backgroundColor: bgColor,
          borderColor: textColor,
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : 30}px)`,
          transitionDelay: `${index * 100}ms`,
        }}
      >
        <div
          className="text-sm mb-3 font-medium"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            opacity: 0.7,
          }}
        >
          {formatDate(post.date)}
        </div>
        <h3
          className="text-xl font-semibold mb-4 group-hover:underline transition-all duration-300"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          {post.title}
        </h3>
        <p
          className="text-sm mb-4 leading-relaxed long-content"
          style={{
            color: textColor,
            opacity: 0.8,
          }}
        >
          {post.excerpt}
        </p>
        <div
          className="text-sm font-medium inline-flex items-center gap-2"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          Read more →
        </div>
      </article>
    </Link>
  );
};

export default function BlogPage() {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            }}
          >
            Journal
          </h1>
          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
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
