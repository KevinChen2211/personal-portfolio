"use client";

import { use, ReactNode, useRef } from "react";
import Image from "next/image";
import { getActivePalette } from "../../color-palettes";
import { useTheme } from "../../components/ThemeProvider";
import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
import { blogPosts } from "../../data/blogs";
import { useScrollAnimation } from "../../components/useScrollAnimation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
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
            href="/blog"
            className="text-lg hover:underline"
            style={{ color: palette.primary }}
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          className="inline-block mb-8 text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
          style={{ color: palette.primary }}
        >
          ← Back to Blog
        </Link>

        <article
          ref={articleRef}
          className="p-8 sm:p-12 rounded-lg transition-all duration-500 hover:shadow-lg"
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
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
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
            {(() => {
              const lines = post.content.split("\n");
              const elements: ReactNode[] = [];
              let currentList: string[] = [];
              let listKey = 0;

              const flushList = () => {
                if (currentList.length > 0) {
                  elements.push(
                    <ul
                      key={`list-${listKey++}`}
                      className="list-disc list-inside mb-4 space-y-2 ml-4"
                    >
                      {currentList.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {parseInlineMarkdown(item)}
                        </li>
                      ))}
                    </ul>
                  );
                  currentList = [];
                }
              };

              const parseInlineMarkdown = (text: string): ReactNode[] => {
                const parts: ReactNode[] = [];
                let currentIndex = 0;

                // Match **bold**, `code`, or regular text
                const patterns = [
                  { regex: /\*\*(.+?)\*\*/g, type: "bold" },
                  { regex: /`(.+?)`/g, type: "code" },
                ];

                let lastIndex = 0;
                const matches: Array<{
                  index: number;
                  length: number;
                  type: string;
                  content: string;
                }> = [];

                // Find all matches
                patterns.forEach(({ regex, type }) => {
                  let match;
                  regex.lastIndex = 0;
                  while ((match = regex.exec(text)) !== null) {
                    matches.push({
                      index: match.index,
                      length: match[0].length,
                      type,
                      content: match[1],
                    });
                  }
                });

                // Sort matches by index
                matches.sort((a, b) => a.index - b.index);

                // Build parts array
                matches.forEach((match) => {
                  // Add text before match
                  if (match.index > lastIndex) {
                    parts.push(text.substring(lastIndex, match.index));
                  }

                  // Add formatted element
                  if (match.type === "bold") {
                    parts.push(
                      <strong
                        key={`bold-${match.index}`}
                        style={{ color: palette.text, fontWeight: 600 }}
                      >
                        {match.content}
                      </strong>
                    );
                  } else if (match.type === "code") {
                    parts.push(
                      <code
                        key={`code-${match.index}`}
                        className="px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: palette.border,
                          color: palette.primary,
                          fontFamily: "monospace",
                        }}
                      >
                        {match.content}
                      </code>
                    );
                  }

                  lastIndex = match.index + match.length;
                });

                // Add remaining text
                if (lastIndex < text.length) {
                  parts.push(text.substring(lastIndex));
                }

                return parts.length > 0 ? parts : [text];
              };

              lines.forEach((line, index) => {
                const trimmed = line.trim();

                // Handle images - format: ![IMAGE:path/to/image.png]
                if (trimmed.startsWith("![IMAGE:")) {
                  flushList();
                  const imageMatch = trimmed.match(/!\[IMAGE:(.+?)\]/);
                  if (imageMatch) {
                    const imagePath = imageMatch[1];
                    const isSvg = imagePath.toLowerCase().endsWith('.svg');
                    const isLogo = imagePath.includes('next-js') || imagePath.includes('Vercel');
                    const isPhoto = !isLogo && !isSvg;
                    elements.push(
                      <div
                        key={`img-${index}`}
                        className="my-8 flex flex-col items-center"
                      >
                        <div
                          className="relative rounded-lg overflow-hidden"
                          style={{
                            backgroundColor: isLogo ? "#ffffff" : "transparent",
                            border: isLogo ? `1px solid ${palette.border}` : "none",
                            boxShadow: isLogo ? `0 4px 12px ${palette.primary}10` : "none",
                            padding: isLogo ? "2rem" : "0",
                            maxWidth: isLogo ? "400px" : "100%",
                            width: "100%",
                          }}
                        >
                          {isSvg ? (
                            // Use regular img tag for SVGs for better compatibility
                            <img
                              src={imagePath}
                              alt=""
                              className="object-contain"
                              style={{
                                maxWidth: "100%",
                                width: "100%",
                                height: "auto",
                                display: "block",
                              }}
                              onError={(e) => {
                                console.error('Image failed to load:', imagePath);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Image
                              src={imagePath}
                              alt=""
                              width={800}
                              height={600}
                              className="object-contain w-full h-auto"
                              style={{
                                maxWidth: "100%",
                                height: "auto",
                                display: "block",
                              }}
                              unoptimized={false}
                              onError={(e) => {
                                console.error('Image failed to load:', imagePath);
                              }}
                            />
                          )}
                        </div>
                        {isPhoto && (
                          <p
                            className="text-sm mt-2 italic"
                            style={{ color: palette.textSecondary }}
                          >
                            Photo by Kevin Chen
                          </p>
                        )}
                      </div>
                    );
                  }
                  return;
                }

                // Handle headings
                if (trimmed.startsWith("# ")) {
                  flushList();
                  elements.push(
                    <h2
                      key={`h2-${index}`}
                      className="text-3xl font-bold mt-8 mb-4"
                      style={{ color: palette.text }}
                    >
                      {parseInlineMarkdown(trimmed.replace("# ", ""))}
                    </h2>
                  );
                  return;
                }

                if (trimmed.startsWith("## ")) {
                  flushList();
                  elements.push(
                    <h3
                      key={`h3-${index}`}
                      className="text-2xl font-semibold mt-6 mb-3"
                      style={{ color: palette.text }}
                    >
                      {parseInlineMarkdown(trimmed.replace("## ", ""))}
                    </h3>
                  );
                  return;
                }

                if (trimmed.startsWith("### ")) {
                  flushList();
                  elements.push(
                    <h4
                      key={`h4-${index}`}
                      className="text-xl font-semibold mt-4 mb-2"
                      style={{ color: palette.text }}
                    >
                      {parseInlineMarkdown(trimmed.replace("### ", ""))}
                    </h4>
                  );
                  return;
                }

                // Handle list items
                if (trimmed.startsWith("- ")) {
                  currentList.push(trimmed.replace("- ", ""));
                  return;
                }

                // Handle empty lines
                if (trimmed === "") {
                  flushList();
                  // Only add br if we have content before
                  if (elements.length > 0) {
                    elements.push(<br key={`br-${index}`} />);
                  }
                  return;
                }

                // Flush list if we hit a non-list item
                flushList();

                // Regular paragraph
                elements.push(
                  <p key={`p-${index}`} className="mb-4 leading-relaxed">
                    {parseInlineMarkdown(trimmed)}
                  </p>
                );
              });

              // Flush any remaining list
              flushList();

              return elements;
            })()}
          </div>
        </article>
      </div>
    </div>
  );
}
