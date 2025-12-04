"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import { projects, type Project } from "../data/projects";

// Project Card Component for projects page
const ProjectCard = ({
  project,
  index,
  palette,
}: {
  project: Project;
  index: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollAnimation(cardRef, { threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className="p-4 sm:p-6 rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-[1.02] touch-manipulation"
      style={{
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        {project.icon && <span className="text-3xl">{project.icon}</span>}
        <h3
          className="text-xl font-semibold flex-1"
          style={{ color: palette.text }}
        >
          {project.title}
        </h3>
      </div>
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: palette.textSecondary }}
      >
        {project.description}
      </p>
      <div className="mt-4">
        <h4
          className="text-sm font-semibold mb-2"
          style={{ color: palette.text }}
        >
          Key Achievements:
        </h4>
        <ul className="space-y-2">
          {project.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="flex items-start text-xs leading-relaxed"
              style={{ color: palette.textSecondary }}
            >
              <span
                className="mr-2 mt-1 flex-shrink-0"
                style={{ color: palette.primary }}
              >
                •
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function ProjectsPage() {
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
          Projects
        </h1>
        <div
          className="w-24 h-1 mb-12 rounded-full"
          style={{ backgroundColor: palette.primary }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              palette={palette}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
