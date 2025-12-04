"use client";

import { getActivePalette } from "../color-palettes";
import { useTheme } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useScrollAnimation } from "../components/useScrollAnimation";

// Horizontal scroll-controlled image track (prototype effect)
const ImageTrack = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const percentageRef = useRef(0); // current translate percentage
  const minPercentageRef = useRef(-100); // updated based on content width
  const lastTouchYRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate how far we can scroll based on content width vs viewport
    const updateBounds = () => {
      const viewportWidth = window.innerWidth || 1;
      const contentWidth = track.scrollWidth || viewportWidth;
      const overflow = contentWidth - viewportWidth;

      if (overflow <= 0) {
        minPercentageRef.current = 0;
      } else {
        const maxShiftRatio = overflow / contentWidth; // 0..1
        minPercentageRef.current = -maxShiftRatio * 100;
      }
    };

    const applyTransform = (nextPercentage: number) => {
      track.animate(
        {
          transform: `translate(${nextPercentage}%, -50%)`,
        },
        { duration: 600, fill: "forwards" }
      );

      const images = track.getElementsByClassName(
        "image"
      ) as HTMLCollectionOf<HTMLElement>;

      for (const image of Array.from(images)) {
        image.animate(
          {
            objectPosition: `${100 + nextPercentage}% center`,
          },
          { duration: 600, fill: "forwards" }
        );
      }
    };

    const clampPercentage = (value: number) =>
      Math.max(Math.min(value, 0), minPercentageRef.current);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const intensity = 0.3; // tune how fast it moves
      const delta = e.deltaY * intensity;

      const nextUnconstrained = percentageRef.current + delta * -1;
      const nextPercentage = clampPercentage(nextUnconstrained);
      percentageRef.current = nextPercentage;

      applyTransform(nextPercentage);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        lastTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0] || lastTouchYRef.current === null) return;
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - lastTouchYRef.current;
      lastTouchYRef.current = currentY;

      const intensity = 0.7;
      const nextUnconstrained = percentageRef.current + deltaY * intensity;
      const nextPercentage = clampPercentage(nextUnconstrained);
      percentageRef.current = nextPercentage;

      applyTransform(nextPercentage);
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    // Initial bounds + position
    updateBounds();
    applyTransform(0);

    window.addEventListener("resize", updateBounds);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Reuse the same local image multiple times
  const images = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div
      id="image-track"
      ref={trackRef}
      style={{
        display: "flex",
        gap: "4vmin",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(0%, -50%)",
        userSelect: "none",
      }}
    >
      {images.map((i) => (
        <img
          key={i}
          className="image"
          src="/gallery-images/test.jpg"
          draggable={false}
          style={{
            width: "40vmin",
            height: "56vmin",
            objectFit: "cover",
            objectPosition: "100% center",
          }}
          alt={`Gallery test ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default function GalleryPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);

  // Disable default page scrolling while on gallery
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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
        {/* Prototype-style scroll-controlled gallery */}
        <div>
          <ImageTrack />
        </div>
      </div>
    </div>
  );
}
