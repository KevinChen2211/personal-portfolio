"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeProvider";
import { getActivePalette } from "../color-palettes";
import ThemeToggle from "../components/ThemeToggle";

export default function GalleryPage() {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const trackRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------------------------------------
     Disable vertical page scrolling
  --------------------------------------------------------- */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = previous);
  }, []);

  /* ---------------------------------------------------------
     Horizontal scroll-wheel logic
  --------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current!;
    let percentage = -50; // starting center
    let targetPercentage = percentage;

    const clamp = (value: number) => Math.max(Math.min(value, 0), -100);

    const handleWheel = (e: WheelEvent) => {
      // vertical scroll → horizontal movement
      targetPercentage = clamp(targetPercentage + e.deltaY * -0.1);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    /* Smooth animation loop */
    const animate = () => {
      percentage += (targetPercentage - percentage) * 0.08;

      track.style.transform = `translate(${percentage}%, -50%)`;

      for (const img of track.getElementsByClassName("image")) {
        (img as HTMLElement).style.objectPosition = `${
          100 + percentage
        }% center`;
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      className="min-h-screen px-6 sm:px-10 py-16 relative overflow-hidden"
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

        <h1 className="text-5xl sm:text-6xl font-bold mb-4">Gallery</h1>

        <div
          className="w-24 h-1 mb-12 rounded-full"
          style={{ backgroundColor: palette.primary }}
        />
      </div>

      {/* IMAGE TRACK */}
      <div
        id="image-track"
        ref={trackRef}
        className="absolute top-3/5 left-1/2 flex gap-[4vmin] select-none"
        style={{
          transform: "translate(-50%, -50%)",
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <img
            key={i}
            src="/gallery-images/test.jpg"
            className="image"
            draggable={false}
            style={{
              width: "40vmin",
              height: "56vmin",
              objectFit: "cover",
              objectPosition: "100% center",
            }}
          />
        ))}
      </div>
    </div>
  );
}
