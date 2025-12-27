"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "../../data/projects";
import Navbar from "../../components/Navbar";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = use(params);
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
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
              Project Not Found
            </h1>
            <Link
              href="/projects"
              className="text-base md:text-lg hover:underline"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              ← Back to Projects
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
            href="/projects"
            className="inline-block mb-8 text-sm md:text-base hover:underline"
            style={{
              color: textColor,
              fontFamily:
                "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              opacity: 0.8,
            }}
          >
            ← Back to Projects
          </Link>

          {/* Project Image */}
          {project.image && (
            <div className="relative w-full mb-8 flex justify-center">
              <div className="relative w-full max-w-4xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={1200}
                  height={1600}
                  className="object-contain w-full h-auto"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
                  quality={90}
                  priority
                />
              </div>
            </div>
          )}

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
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
              }}
            >
              {project.title}
            </h1>
          </div>

          {/* Project Description */}
          <p
            className="text-base md:text-lg mb-8 leading-relaxed long-content"
            style={{
              color: textColor,
              opacity: 0.85,
            }}
          >
            {project.description}
          </p>

          {/* Key Achievements */}
          <div className="mt-8">
            <h2
              className="text-xl md:text-2xl font-semibold mb-4"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
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
