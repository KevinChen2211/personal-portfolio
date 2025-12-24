"use client";

import Link from "next/link";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import { projects, type Project } from "../data/projects";
import Navbar from "../components/Navbar";

// Project Card Component for projects page
const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollAnimation(cardRef, { threshold: 0.1 });
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  return (
    <div
      ref={cardRef}
      className="p-4 sm:p-6 rounded-lg transition-all duration-500 hover:shadow-lg hover:scale-[1.02] touch-manipulation border"
      style={{
        backgroundColor: bgColor,
        borderColor: textColor,
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        {project.icon && <span className="text-3xl">{project.icon}</span>}
        <h3
          className="text-xl font-semibold flex-1"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          {project.title}
        </h3>
      </div>
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{
          color: textColor,
          fontFamily:
            "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          opacity: 0.8,
        }}
      >
        {project.description}
      </p>
      <div className="mt-4">
        <h4
          className="text-sm font-semibold mb-2"
          style={{
            color: textColor,
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          Key Achievements:
        </h4>
        <ul className="space-y-2">
          {project.highlights.map((highlight, idx) => (
            <li
              key={idx}
              className="flex items-start text-xs leading-relaxed"
              style={{
                color: textColor,
                fontFamily:
                  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
                opacity: 0.8,
              }}
            >
              <span
                className="mr-2 mt-1 flex-shrink-0"
                style={{ color: textColor }}
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
            Projects
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
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
