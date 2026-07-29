"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";
import { usePrefersReducedMotion } from "../utils/motion";
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const textColor = "#2C2C2C";

  return (
    <div
      ref={cardRef}
      className="flex flex-col touch-manipulation"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: prefersReducedMotion
          ? "none"
          : `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: prefersReducedMotion ? "0ms" : `${index * 180}ms`,
        transitionProperty: prefersReducedMotion ? "opacity" : "opacity, transform",
        transitionDuration: "var(--duration-slow)",
        transitionTimingFunction: "var(--ease-out)",
      }}
    >
      <Link href={`/projects/${project.slug}`} className="group">
        <div className="relative w-full mb-2 overflow-hidden">
          <div
            className="relative w-full"
            style={{
              aspectRatio: "0.75 / 1",
              maxHeight: "calc(100vh - 280px)",
            }}
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-opacity duration-700 group-hover:opacity-88"
                sizes="(max-width: 640px) 100vw, (max-width: 1279px) 50vw, 400px"
                quality={70}
                priority={index === 0}
                loading={index < 3 ? "eager" : "lazy"}
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
        <h2
          className="text-3xl md:text-3xl lg:text-4xl xl:text-4xl text-center transition-opacity duration-500 group-hover:opacity-75"
          style={{
            color: textColor,
            fontFamily:
              "var(--font-serif-title)",
          }}
        >
          {project.title}
        </h2>
      </Link>
    </div>
  );
};

export default function ProjectsPage() {
  const bgColor = "#FAF2E6";

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar />
      <main className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-20 pb-24 md:pt-24 md:pb-32">
        <div className="site-container">
          <h1 className="sr-only">Engineering and creative projects</h1>
          <div className="mx-auto grid w-full grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
