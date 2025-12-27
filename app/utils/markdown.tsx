"use client";

import { ReactNode } from "react";
import Image from "next/image";

interface ParseMarkdownOptions {
  palette: {
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
  };
}

export function parseMarkdown(content: string, options: ParseMarkdownOptions): ReactNode[] {
  const { palette } = options;
  const lines = content.split("\n");
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
            <li key={idx} className="leading-relaxed long-content">
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
        const isSvg = imagePath.toLowerCase().endsWith(".svg");
        const isLogo =
          imagePath.includes("next-js") ||
          imagePath.includes("Vercel");
        const isPhoto = !isLogo && !isSvg;
        elements.push(
          <div
            key={`img-${index}`}
            className="my-8 flex flex-col items-center"
          >
            <div
              className={`relative rounded-lg overflow-hidden ${
                isLogo
                  ? "p-4 sm:p-8 max-w-full sm:max-w-[400px]"
                  : ""
              }`}
              style={{
                backgroundColor: isLogo ? "#ffffff" : "transparent",
                border: isLogo
                  ? `1px solid ${palette.border}`
                  : "none",
                boxShadow: isLogo
                  ? `0 4px 12px ${palette.primary}10`
                  : "none",
                width: "100%",
              }}
            >
              {isSvg ? (
                // Use regular img tag for SVGs for better compatibility
                <img
                  src={imagePath}
                  alt=""
                  className="object-contain w-full h-auto"
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      imagePath
                    );
                    (e.target as HTMLImageElement).style.display =
                      "none";
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  onError={(e) => {
                    console.error(
                      "Image failed to load:",
                      imagePath
                    );
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
      <p
        key={`p-${index}`}
        className="mb-4 leading-relaxed long-content"
      >
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  // Flush any remaining list
  flushList();

  return elements;
}

