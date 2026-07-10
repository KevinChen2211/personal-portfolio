import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "../../data/projects";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import JsonLd from "../../components/JsonLd";
import { creativeWorkSchema, breadcrumbSchema } from "../../lib/structured-data";
import { parseMarkdown } from "../../utils/markdown";
import React from "react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Strip image / video markers, links, and lightweight markdown so the
// description can be reused as a plain-text meta/OG description.
function toExcerpt(markdown: string, max = 155): string {
  const text = markdown
    .replace(/!\[IMAGE:[^\]]+\]/g, " ")
    .replace(/\[IMAGE PLACEHOLDER:[^\]]+\]/g, " ")
    .replace(/\[YOUTUBE:[^\]]+\]/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#*`>_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "").trimEnd() + "…";
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  const description = toExcerpt(project.description);
  const images = project.image ? [project.image] : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.title} · Kevin Chen`,
      description,
      url: `/projects/${project.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Kevin Chen`,
      description,
      images,
    },
  };
}

// Parse project description with support for image placeholders and markdown
function parseProjectDescription(description: string, textColor: string) {
  const lines = description.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let elementKey = 0;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphText = currentParagraph.join(" ");
      if (paragraphText.trim()) {
        // Parse the paragraph with markdown for inline formatting
        const parsed = parseMarkdown(paragraphText, {
          palette: {
            text: textColor,
            textSecondary: textColor,
            border: textColor,
            primary: textColor,
          },
        });
        // Add unique keys to prevent duplicates
        parsed.forEach((el, idx) => {
          if (React.isValidElement(el)) {
            elements.push(
              React.cloneElement(el, {
                key: `para-${elementKey}-${idx}`,
              }),
            );
          } else {
            elements.push(el);
          }
        });
        elementKey++;
      }
      currentParagraph = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Handle image placeholders: [IMAGE PLACEHOLDER: ...]
    if (trimmed.startsWith("[IMAGE PLACEHOLDER:")) {
      flushParagraph();
      const placeholderMatch = trimmed.match(/\[IMAGE PLACEHOLDER:(.+?)\]/);
      if (placeholderMatch) {
        const placeholderText = placeholderMatch[1].trim();
        elements.push(
          <div
            key={`placeholder-${elementKey++}`}
            className="my-8 flex flex-col items-center"
          >
            <div
              className="relative w-full max-w-4xl border-2 border-dashed rounded-lg p-8"
              style={{
                borderColor: `${textColor}40`,
                backgroundColor: `${textColor}08`,
                minHeight: "200px",
              }}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="text-4xl mb-4 opacity-50"
                  style={{ color: textColor }}
                >
                  🖼️
                </div>
                <p
                  className="text-sm md:text-base italic max-w-2xl px-4"
                  style={{
                    color: textColor,
                    opacity: 0.7,
                  }}
                >
                  {placeholderText}
                </p>
                <p
                  className="text-xs mt-2"
                  style={{
                    color: textColor,
                    opacity: 0.5,
                  }}
                >
                  Image placeholder
                </p>
              </div>
            </div>
          </div>,
        );
      }
      return;
    }

    // Handle regular markdown images: ![IMAGE:path]
    if (trimmed.startsWith("![IMAGE:")) {
      flushParagraph();
      // Let markdown parser handle it
      const parsed = parseMarkdown(trimmed, {
        palette: {
          text: textColor,
          textSecondary: textColor,
          border: textColor,
          primary: textColor,
        },
      });
      // Add unique keys to prevent duplicates
      parsed.forEach((el, idx) => {
        if (React.isValidElement(el)) {
          elements.push(
            React.cloneElement(el, { key: `img-${elementKey}-${idx}` }),
          );
        } else {
          elements.push(el);
        }
      });
      elementKey++;
      return;
    }

    // Handle empty lines
    if (trimmed === "") {
      flushParagraph();
      return;
    }

    // Accumulate text for paragraph
    currentParagraph.push(trimmed);
  });

  // Flush any remaining paragraph
  flushParagraph();

  return elements.length > 0
    ? elements
    : [<p key="empty">No description available.</p>];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ backgroundColor: bgColor }}
    >
      <JsonLd
        data={[
          creativeWorkSchema({
            title: project.title,
            description: toExcerpt(project.description),
            slug: project.slug,
            image: project.image,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <main className="px-6 sm:px-10 md:px-12 lg:px-20 xl:px-24 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            href="/projects"
            className="inline-block mb-8 text-sm md:text-base transition-opacity duration-500 hover:underline hover:opacity-70"
            style={{
              color: textColor,
              fontFamily:
                "var(--font-serif)",
              opacity: 0.8,
            }}
          >
            ← Back to Projects
          </Link>

          {/* Project Title */}
          <div className="flex items-center gap-4 mb-6">
            {project.icon && (
              <span className="text-4xl md:text-5xl">{project.icon}</span>
            )}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold"
              style={{
                color: textColor,
                fontFamily:
                  "var(--font-serif)",
              }}
            >
              {project.title}
            </h1>
          </div>

          {/* Project Description with Markdown Support */}
          <div
            className="prose prose-lg max-w-none mb-8"
            style={{
              color: textColor,
              opacity: 0.85,
              lineHeight: "1.8",
            }}
          >
            {parseProjectDescription(project.description, textColor)}
          </div>

          {/* Key Achievements */}
          <div className="mt-8">
            <h2
              className="text-xl md:text-2xl font-semibold mb-4"
              style={{
                color: textColor,
                fontFamily:
                  "var(--font-serif)",
              }}
            >
              Key Achievements
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((highlight, idx) => {
                // Check if highlight contains a URL
                const urlRegex = /(https?:\/\/[^\s]+)/g;
                const parts = highlight.split(urlRegex);

                return (
                  <li
                    key={idx}
                    className="flex items-start text-sm md:text-base leading-relaxed long-content"
                    style={{
                      color: textColor,
                      opacity: 0.8,
                    }}
                  >
                    <span
                      className="mr-3 mt-2 flex-shrink-0"
                      style={{ color: textColor }}
                    >
                      •
                    </span>
                    <span>
                      {parts.map((part, partIdx) => {
                        if (part.match(urlRegex)) {
                          return (
                            <a
                              key={partIdx}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:opacity-70 transition-opacity"
                              style={{ color: textColor }}
                            >
                              {part}
                            </a>
                          );
                        }
                        return part;
                      })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
