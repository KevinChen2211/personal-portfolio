"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";

type CollectionViewerProps = {
  images: string[];
  title: string;
};

const SERIF =
  "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif";

export default function CollectionViewer({
  images,
  title,
}: CollectionViewerProps) {
  const bgColor = "#FAF2E6";
  const textColor = "#2C2C2C";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (images.length === 0) return;
      const clamped = Math.max(0, Math.min(idx, images.length - 1));
      setCurrentIndex(clamped);
    },
    [images.length]
  );
  const goNext = useCallback(
    () => goTo(currentIndex + 1),
    [currentIndex, goTo]
  );
  const goPrev = useCallback(
    () => goTo(currentIndex - 1),
    [currentIndex, goTo]
  );

  // Soft fade-ins on mount.
  useEffect(() => {
    const t1 = setTimeout(() => setChromeVisible(true), 80);
    const t2 = setTimeout(() => setImageVisible(true), 180);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Keyboard navigation. Esc returns to the gallery so users always have a
  // way out without scrolling for the back link.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        if (typeof window !== "undefined") {
          window.location.href = "/gallery";
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Touch swipe — only horizontal swipes navigate; vertical motion is
  // ignored so users can still naturally scroll if needed.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  if (images.length === 0) {
    return (
      <div
        className="min-h-screen w-full relative overflow-y-auto pt-6 md:pt-8"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24 md:pt-30">
          <div className="text-center px-6">
            <p
              className="text-sm md:text-base mb-4"
              style={{ fontFamily: SERIF }}
            >
              No images found for this collection.
            </p>
            <Link
              href="/gallery"
              className="inline-block text-lg transition-all duration-300 hover:underline hover:translate-x-[-4px]"
              style={{ color: textColor, fontFamily: SERIF }}
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Mount only the current image and its immediate neighbours so navigation
  // feels instant without loading the entire collection up front.
  const visibleIndices = [
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
  ].filter((i) => i >= 0 && i < images.length);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div
      className="h-screen w-full relative overflow-hidden flex flex-col"
      style={{ backgroundColor: bgColor }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Navbar />

      {/* Top bar: back link (left) + collection name (right) */}
      <header
        className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-24 md:pt-28 pb-3 md:pb-4 flex items-end justify-between"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transform: chromeVisible ? "translateY(0)" : "translateY(-8px)",
          transition:
            "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Link
          href="/gallery"
          className="text-xs md:text-sm transition-all duration-300 hover:underline hover:translate-x-[-3px]"
          style={{ color: textColor, fontFamily: SERIF, opacity: 0.85 }}
        >
          ← Back to Gallery
        </Link>
        <h1
          className="text-base md:text-lg tracking-wide italic text-right"
          style={{ color: textColor, fontFamily: SERIF }}
        >
          {title}
        </h1>
      </header>

      {/* Stage — a single image fills this region; previous/next are mounted
          but transparent so they're warm in the cache for instant navigation. */}
      <main
        className="relative flex-1 flex items-center justify-center px-12 sm:px-16 md:px-24 lg:px-32 pb-32 md:pb-36"
        style={{ minHeight: 0 }}
      >
        {visibleIndices.map((idx) => (
          <div
            key={idx}
            aria-hidden={idx !== currentIndex}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              padding: "0.5rem",
              opacity: idx === currentIndex && imageVisible ? 1 : 0,
              transition:
                "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: idx === currentIndex ? "auto" : "none",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[idx]}
                alt={`${title} — image ${idx + 1} of ${images.length}`}
                fill
                sizes="(max-width: 768px) 90vw, 80vw"
                quality={85}
                priority={idx === currentIndex}
                className="object-contain select-none"
                draggable={false}
              />
            </div>
          </div>
        ))}

        {/* Prev arrow */}
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous image"
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-3 transition-all duration-300 focus:outline-none"
          style={{
            color: textColor,
            opacity: chromeVisible ? (hasPrev ? 0.55 : 0.15) : 0,
            cursor: hasPrev ? "pointer" : "default",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            if (hasPrev) e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = hasPrev ? "0.55" : "0.15";
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          type="button"
          onClick={goNext}
          disabled={!hasNext}
          aria-label="Next image"
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 sm:p-3 transition-all duration-300 focus:outline-none"
          style={{
            color: textColor,
            opacity: chromeVisible ? (hasNext ? 0.55 : 0.15) : 0,
            cursor: hasNext ? "pointer" : "default",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            if (hasNext) e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = hasNext ? "0.55" : "0.15";
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </main>

      {/* Bottom: counter + progress dashes */}
      <div
        className="absolute bottom-0 left-0 right-0 pb-6 md:pb-9 flex flex-col items-center gap-3"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transition: "opacity 0.6s ease-out",
          pointerEvents: "none",
        }}
      >
        <div
          className="text-xs md:text-sm italic"
          style={{
            color: textColor,
            fontFamily: SERIF,
            fontVariantNumeric: "tabular-nums",
            opacity: 0.7,
          }}
        >
          {String(currentIndex + 1).padStart(2, "0")} —{" "}
          {String(images.length).padStart(2, "0")}
        </div>
        <div
          className="flex items-center gap-1.5 px-4"
          style={{ pointerEvents: "auto" }}
        >
          {images.map((_, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to image ${idx + 1}`}
                aria-current={active ? "true" : undefined}
                className="transition-all duration-300 focus:outline-none"
                style={{
                  width: active ? "26px" : "10px",
                  height: "2px",
                  backgroundColor: textColor,
                  opacity: active ? 0.85 : 0.25,
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "1px",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.opacity = "0.55";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.opacity = "0.25";
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
