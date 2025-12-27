"use client";

import Link from "next/link";
import Image from "next/image";
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
      className="flex flex-col transition-all duration-500 hover:scale-[1.02] touch-manipulation"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group">
        <div className="relative w-full mb-3 overflow-hidden">
          <div
            className="relative w-full"
            style={{
              aspectRatio: "0.75 / 1",
            }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:opacity-90 transition-opacity"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: textColor, opacity: 0.1 }}
              >
                {project.icon && (
                  <span className="text-6xl">{project.icon}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <h3
          className="text-lg md:text-xl lg:text-2xl font-semibold text-center group-hover:underline transition-all"
          style={{
            color: textColor,
            fontFamily:
              '"Mencken Std Head Narrow", "Juana", var(--font-display), "Playfair Display", "Times New Roman", serif',
          }}
        >
          {project.title}
        </h3>
      </Link>
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
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-24 md:py-32">
        <div className="max-w-[98vw] xl:max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-12 lg:gap-16 xl:gap-20">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
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
