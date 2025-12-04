"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";

// Gallery Item Component with scroll animations
const GalleryItem = ({
  photo,
  index,
  palette,
}: {
  photo: number;
  index: number;
  palette: ReturnType<typeof getActivePalette>;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollAnimation(itemRef, { threshold: 0.1 });

  return (
    <div
      ref={itemRef}
      className="relative rounded-lg overflow-hidden transition-all duration-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      style={{
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        aspectRatio: "4/3",
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 30}px)`,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          backgroundColor: palette.border,
        }}
      >
        <span style={{ color: palette.textSecondary }}>Photo {photo}</span>
      </div>
    </div>
  );
};

export default function GalleryPage() {
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
          className="text-5xl sm:text-6xl font-bold mb-4 transition-all duration-300 hover:scale-105"
          style={{ color: palette.text }}
        >
          Gallery
        </h1>
        <div
          className="w-24 h-1 mb-12 rounded-full"
          style={{ backgroundColor: palette.primary }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((photo, index) => (
            <GalleryItem
              key={photo}
              photo={photo}
              index={index}
              palette={palette}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

