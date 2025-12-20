"use client";

import Link from "next/link";
import { projects } from "./data/projects";

export default function Home() {
  const bgColor = "#F0EEE9";
  const textColor = "#2C2C2C";
  const textSecondary = "#6B6B6B";
  const accentColor = "#8B7355";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* Main Content Container */}
      <div className="max-w-5xl w-full space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1
            className="text-5xl md:text-7xl font-light tracking-tight"
            style={{ color: textColor }}
          >
            Kevin Chen
          </h1>
          <p
            className="text-xl md:text-2xl font-light"
            style={{ color: textSecondary }}
          >
            Engineer & Creative Developer
          </p>
          <div
            className="w-16 h-px mx-auto mt-6"
            style={{ backgroundColor: accentColor }}
          />
        </section>

        {/* About Section */}
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <p
            className="text-base md:text-lg leading-relaxed font-light"
            style={{ color: textSecondary }}
          >
            I love to build things and push myself to see what I can create. I'm
            a learner and always looking for opportunities to refine my skills
            and expand my technical capabilities.
          </p>
        </section>

        {/* Featured Projects */}
        <section className="space-y-8">
          <h2
            className="text-2xl md:text-3xl font-light text-center tracking-wide"
            style={{ color: textColor }}
          >
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.title}
                className="p-6 space-y-3 border transition-all duration-300 hover:shadow-sm"
                style={{
                  borderColor: `${accentColor}20`,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                {project.icon && (
                  <div className="text-3xl mb-2">{project.icon}</div>
                )}
                <h3
                  className="text-lg font-medium"
                  style={{ color: textColor }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: textSecondary }}
                >
                  {project.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center pt-4">
            <Link
              href="/projects"
              className="inline-block px-6 py-2 text-sm border transition-all duration-300 hover:bg-white/50"
              style={{
                borderColor: accentColor,
                color: textColor,
              }}
            >
              View All Projects
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center space-y-6 pt-8">
          <div
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: accentColor }}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://www.linkedin.com/in/kevinsoftwarewiz"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2 text-sm border transition-all duration-300 hover:bg-white/50"
              style={{
                borderColor: accentColor,
                color: textColor,
              }}
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/KevinChen2211"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2 text-sm border transition-all duration-300 hover:bg-white/50"
              style={{
                borderColor: accentColor,
                color: textColor,
              }}
            >
              GitHub
            </Link>
            <Link
              href="/blog"
              className="px-6 py-2 text-sm border transition-all duration-300 hover:bg-white/50"
              style={{
                borderColor: accentColor,
                color: textColor,
              }}
            >
              Blog
            </Link>
            <Link
              href="/gallery"
              className="px-6 py-2 text-sm border transition-all duration-300 hover:bg-white/50"
              style={{
                borderColor: accentColor,
                color: textColor,
              }}
            >
              Gallery
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
