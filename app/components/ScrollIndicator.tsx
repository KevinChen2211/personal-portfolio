"use client";

import { useEffect, useState } from "react";
import { activePalette } from "../color-palettes";

export default function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(5);

  useEffect(() => {
    const container = document.querySelector('[class*="hide-scrollbar"]') as HTMLElement;
    if (!container) return;

    const updateProgress = () => {
      const sections = container.querySelectorAll("section");
      const viewportHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      const totalHeight = sections.length * viewportHeight;
      
      setTotalSections(sections.length);
      
      const progress = (scrollTop / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      
      const sectionIndex = Math.floor(scrollTop / viewportHeight);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    };

    container.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => {
      container.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {Array.from({ length: totalSections }, (_, index) => (
        <div
          key={index}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: currentSection === index ? activePalette.primary : activePalette.border,
            transform: `scale(${currentSection === index ? 1.5 : 1})`,
            opacity: currentSection === index ? 1 : 0.4,
          }}
        />
      ))}
      
      {/* Progress line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 rounded-full"
        style={{
          height: `${scrollProgress}%`,
          background: `linear-gradient(180deg, ${activePalette.primary}, ${activePalette.secondary})`,
          transition: "height 0.3s ease-out",
        }}
      />
    </div>
  );
}

