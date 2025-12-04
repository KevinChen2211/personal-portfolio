"use client";

import { useEffect, useState } from "react";
import { getActivePalette } from "../color-palettes";
import { useTheme } from "./ThemeProvider";

export default function ScrollIndicator() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(5);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  useEffect(() => {
    const container = document.querySelector(
      '[class*="hide-scrollbar"]'
    ) as HTMLElement;
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

  // Section names corresponding to each index
  const sectionNames = [
    "Home",
    "About",
    "Projects",
    "Blog",
    "Gallery",
    "Contact",
  ];

  const scrollToSection = (index: number) => {
    const container = document.querySelector(
      '[class*="hide-scrollbar"]'
    ) as HTMLElement;
    if (!container) return;

    const viewportHeight = container.clientHeight;
    const targetScroll = index * viewportHeight;

    // Use smoothScrollTo if available, otherwise use native smooth scroll
    const smoothScrollTo = (container as any).smoothScrollTo;
    if (smoothScrollTo && typeof smoothScrollTo === "function") {
      smoothScrollTo(targetScroll);
    } else {
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-5 items-center">
      {/* Progress line - enhanced with glow effect */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 rounded-full pointer-events-none"
        style={{
          width: "3px",
          height: `${scrollProgress}%`,
          background: `linear-gradient(180deg, ${palette.primary}, ${palette.secondary}, ${palette.accent})`,
          transition: "height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          boxShadow: `0 0 8px ${palette.primary}40, 0 0 4px ${palette.secondary}30`,
          opacity: 0.9,
        }}
      />

      {Array.from({ length: totalSections }, (_, index) => {
        const isActive = currentSection === index;
        const isHovered = hoveredSection === index;
        const sectionName = sectionNames[index] || `Section ${index + 1}`;

        return (
          <div
            key={index}
            className="relative flex items-center justify-center"
            style={{
              padding: "16px",
              margin: "-16px",
            }}
            onMouseEnter={() => setHoveredSection(index)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <button
              onClick={() => scrollToSection(index)}
              className="relative rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
              style={{
                width: isActive ? "18px" : isHovered ? "14px" : "10px",
                height: isActive ? "18px" : isHovered ? "14px" : "10px",
                backgroundColor:
                  isActive || isHovered ? palette.primary : palette.border,
                transform: `scale(${isActive ? 1.3 : isHovered ? 1.15 : 1})`,
                opacity: isActive ? 1 : isHovered ? 0.85 : 0.4,
                boxShadow:
                  isActive || isHovered
                    ? `0 0 ${isActive ? "20px" : "14px"} ${palette.primary}${isActive ? "80" : "60"}, 0 0 ${isActive ? "8px" : "6px"} ${palette.secondary}40`
                    : "none",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                border: isActive ? `2px solid ${palette.accent}` : "none",
              }}
              aria-label={`Go to ${sectionName}`}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap pointer-events-none z-10"
                  style={{
                    backgroundColor: palette.surface,
                    color: palette.text,
                    border: `1px solid ${palette.border}`,
                    boxShadow: `0 4px 12px ${palette.primary}20`,
                    animation: "fadeIn 0.2s ease-out forwards",
                  }}
                >
                  {sectionName}
                </div>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
