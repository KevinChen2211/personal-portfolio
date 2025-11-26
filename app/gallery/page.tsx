"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

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
          className="inline-block mb-8 text-lg hover:underline"
          style={{ color: palette.primary }}
        >
          ← Back to Home
        </Link>
        <h1
          className="text-5xl sm:text-6xl font-bold mb-12"
          style={{ color: palette.text }}
        >
          Gallery
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((photo) => (
            <div
              key={photo}
              className="relative rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: palette.surface,
                border: `1px solid ${palette.border}`,
                aspectRatio: "4/3",
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: palette.border,
                }}
              >
                <span style={{ color: palette.textSecondary }}>
                  Photo {photo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

