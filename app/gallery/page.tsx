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
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* ---------------------------------------------------------
     Horizontal scroll-wheel logic
  --------------------------------------------------------- */
  useEffect(() => {
    const track = trackRef.current!;
    if (!track) return;

    let percentage = -50; // starting center
    let targetPercentage = percentage;
    let velocity = 60;
    let lastTime = performance.now();

    const clamp = (value: number) => Math.max(Math.min(value, 0), -100);

    // Optimize for transform animations
    track.style.willChange = "transform";
    const images = track.getElementsByClassName("image");
    for (const img of images) {
      (img as HTMLElement).style.willChange = "object-position";
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // vertical scroll → horizontal movement with very reduced sensitivity
      const delta = e.deltaY * -0.02;
      targetPercentage = clamp(targetPercentage + delta);
      // Add slight momentum
      velocity = delta * 0.1;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    /* Smooth animation loop with improved easing */
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2); // Cap at 2x normal frame time
      lastTime = currentTime;

      // Apply momentum decay
      if (Math.abs(velocity) > 0.01) {
        targetPercentage = clamp(targetPercentage + velocity);
        velocity *= 0.82; // Faster decay for much slower scrolling
      }

      // Smoother interpolation with adaptive lerp
      const distance = targetPercentage - percentage;
      const lerpFactor = Math.abs(distance) > 1 ? 0.015 : 0.01; // Much slower for very smooth scrolling
      percentage += distance * lerpFactor;

      // Stop animation when very close to target
      if (Math.abs(distance) < 0.01 && Math.abs(velocity) < 0.01) {
        percentage = targetPercentage;
      }

      track.style.transform = `translate(${percentage}%, -50%)`;

      for (const img of images) {
        (img as HTMLElement).style.objectPosition = `${
          100 + percentage
        }% center`;
      }

      requestAnimationFrame(animate);
    };
    animate(performance.now());

    return () => {
      window.removeEventListener("wheel", handleWheel);
      track.style.willChange = "auto";
      for (const img of images) {
        (img as HTMLElement).style.willChange = "auto";
      }
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
