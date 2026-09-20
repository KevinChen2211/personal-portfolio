import { ReactNode } from "react";
import Image from "next/image";
import { parseImageMarker } from "./image-marker";

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
  let currentQuote: string[] = [];
  let listKey = 0;
  let quoteKey = 0;

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

  // Consecutive `>` lines become a centered epigraph: first line display-size,
  // any following lines a smaller caption (used for 物の哀れ / mono no aware).
  const flushQuote = () => {
    if (currentQuote.length === 0) return;
    const [lead, ...rest] = currentQuote;
    elements.push(
      <figure
        key={`quote-${quoteKey++}`}
        className="my-10 md:my-14 mx-auto max-w-2xl text-center"
      >
        <p
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
          style={{
            color: palette.text,
            fontFamily:
              'var(--font-serif-title), "Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "Noto Serif JP", serif',
          }}
        >
          {parseInlineMarkdown(lead)}
        </p>
        {rest.map((line, idx) => (
          <p
            key={idx}
            className="text-xl sm:text-2xl md:text-3xl mt-3 italic leading-snug"
            style={{
              color: palette.text,
              fontFamily: "var(--font-serif)",
              opacity: 0.8,
            }}
          >
            {parseInlineMarkdown(line)}
          </p>
        ))}
      </figure>
    );
    currentQuote = [];
  };

  const flushBlocks = () => {
    flushList();
    flushQuote();
  };

  const parseInlineMarkdown = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];

    // Match **bold**, *italic*, `code`, or regular text.
    // Italic uses lookaround so `*word*` does not steal the inner pair of `**word**`.
    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, type: "bold" },
      { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, type: "italic" },
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
      } else if (match.type === "italic") {
        parts.push(
          <em
            key={`italic-${match.index}`}
            style={{ color: palette.text, fontStyle: "italic" }}
          >
            {match.content}
          </em>
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

    // Handle YouTube embeds - format: [YOUTUBE:url] or just a YouTube URL
    const youtubeMatch = trimmed.match(/(?:\[YOUTUBE:\s*)?(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\])?/);
    if (youtubeMatch) {
      flushBlocks();
      const videoId = youtubeMatch[1];
      elements.push(
        <div
          key={`youtube-${index}`}
          className="my-8 flex flex-col items-center"
        >
          <div
            className="relative w-full"
            style={{
              maxWidth: "800px",
              aspectRatio: "16 / 9",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full rounded-lg"
              style={{
                border: "none",
              }}
            />
          </div>
        </div>
      );
      return;
    }

    // Handle images - format: ![IMAGE:path/to/image.png] with optional alt
    // text after a pipe: ![IMAGE:path/to/image.png|What the photo shows]
    if (trimmed.startsWith("![IMAGE:")) {
      flushBlocks();
      const marker = parseImageMarker(trimmed);
      if (marker) {
        const imagePath = marker.path;
        const markerAlt = marker.alt;
        const isSvg = imagePath.toLowerCase().endsWith(".svg");
        const isLogo =
          imagePath.includes("next-js") ||
          imagePath.includes("Vercel");
        const isPhoto = !isLogo && !isSvg;
        const logoAlt = imagePath.includes("Vercel")
          ? "Vercel logo"
          : imagePath.includes("next-js")
            ? "Next.js logo"
            : "";
        // A marker that supplies its own alt always wins. Without one, fall
        // back to empty rather than a canned credit line — photos already
        // carry a visible "Photo by Kevin Chen" caption below them, so
        // repeating it in alt tells a screen reader nothing about the image.
        const altText = markerAlt || logoAlt;
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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={imagePath}
                  src={imagePath}
                  alt={altText}
                  className="object-contain w-full h-auto"
                  style={{
                    maxWidth: "100%",
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              ) : (
                <Image
                  key={imagePath}
                  src={imagePath}
                  alt={altText}
                  width={800}
                  height={600}
                  className="object-contain w-full h-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                  quality={70}
                  loading="lazy"
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
      flushBlocks();
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
      flushBlocks();
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
      flushBlocks();
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

    // Handle horizontal rule (---)
    if (trimmed === "---" || trimmed.match(/^-{3,}$/)) {
      flushBlocks();
      elements.push(
        <hr
          key={`hr-${index}`}
          className="my-8 border-t"
          style={{
            borderColor: palette.border,
            opacity: 0.3,
          }}
        />
      );
      return;
    }

    // Handle list items
    if (trimmed.startsWith("- ")) {
      flushQuote();
      currentList.push(trimmed.replace("- ", ""));
      return;
    }

    // Consecutive `>` lines: centered epigraph (display line + optional caption)
    if (trimmed.startsWith(">")) {
      flushList();
      const quoted = trimmed.replace(/^>\s*/, "");
      if (quoted) currentQuote.push(quoted);
      return;
    }

    // Handle empty lines
    if (trimmed === "") {
      const flushingQuote = currentQuote.length > 0;
      flushBlocks();
      // Quotes already have their own vertical margin — skip the extra br
      if (elements.length > 0 && !flushingQuote) {
        elements.push(<br key={`br-${index}`} />);
      }
      return;
    }

    // Flush open lists / quotes if we hit a non-list item
    flushBlocks();

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

  // Flush any remaining list or quote
  flushBlocks();

  return elements;
}

