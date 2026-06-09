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
      className="h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Navbar />

      {/* Top chrome — back link + collection title. Floats above the stage so
          the image stays vertically centred in the viewport. */}
      <header
        className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-24 md:pt-28 pb-3 md:pb-4 flex items-end justify-between pointer-events-none"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transform: chromeVisible ? "translateY(0)" : "translateY(-8px)",
          transition:
            "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Link
          href="/gallery"
          className="text-xs md:text-sm transition-all duration-300 hover:underline hover:translate-x-[-3px] pointer-events-auto"
          style={{ color: textColor, fontFamily: SERIF, opacity: 0.85 }}
        >
          ← Back to Gallery
        </Link>
        <h1
          className="text-base md:text-lg tracking-wide italic text-right pointer-events-auto"
          style={{ color: textColor, fontFamily: SERIF }}
        >
          {title}
        </h1>
      </header>

      {/* Stage — pinned to the viewport so the photo sits at the true vertical
          centre (50vh) regardless of header/footer height. The chrome above
          and below floats over it. */}
      <main
        className="absolute inset-0 flex items-center justify-center px-16 sm:px-20 md:px-28 lg:px-36 py-24 md:py-28"
      >
        {visibleIndices.map((idx) => (
          <div
            key={idx}
            aria-hidden={idx !== currentIndex}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              padding: "0.5rem",
              opacity: idx === currentIndex && imageVisible ? 1 : 0,
              transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
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

        {/* Prev arrow — frosted-glass pill so it stays readable over both
            light and dark photos. */}
        <button
          type="button"
          onClick={goPrev}
          disabled={!hasPrev}
          aria-label="Previous image"
          className="absolute left-3 sm:left-5 md:left-7 top-1/2 -translate-y-1/2 z-10 rounded-full transition-all duration-300 focus:outline-none flex items-center justify-center"
          style={{
            color: "#1a1a1a",
            opacity: chromeVisible ? (hasPrev ? 1 : 0.3) : 0,
            cursor: hasPrev ? "pointer" : "default",
            width: 48,
            height: 48,
            backgroundColor: "rgba(250, 242, 230, 0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(26, 26, 26, 0.12)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
          }}
          onMouseEnter={(e) => {
            if (hasPrev) {
              e.currentTarget.style.backgroundColor = "rgba(250, 242, 230, 0.98)";
              e.currentTarget.style.transform =
                "translateY(-50%) scale(1.06)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(250, 242, 230, 0.85)";
            e.currentTarget.style.transform = "translateY(-50%)";
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
          className="absolute right-3 sm:right-5 md:right-7 top-1/2 -translate-y-1/2 z-10 rounded-full transition-all duration-300 focus:outline-none flex items-center justify-center"
          style={{
            color: "#1a1a1a",
            opacity: chromeVisible ? (hasNext ? 1 : 0.3) : 0,
            cursor: hasNext ? "pointer" : "default",
            width: 48,
            height: 48,
            backgroundColor: "rgba(250, 242, 230, 0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(26, 26, 26, 0.12)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
          }}
          onMouseEnter={(e) => {
            if (hasNext) {
              e.currentTarget.style.backgroundColor = "rgba(250, 242, 230, 0.98)";
              e.currentTarget.style.transform =
                "translateY(-50%) scale(1.06)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(250, 242, 230, 0.85)";
            e.currentTarget.style.transform = "translateY(-50%)";
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </main>

      {/* Bottom: counter + progress dashes inside a frosted-glass pill so
          they remain readable regardless of the photo behind them. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pb-5 md:pb-8 flex justify-center"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transition: "opacity 0.6s ease-out",
          pointerEvents: "none",
        }}
      >
        <div
          className="flex flex-col items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-full"
          style={{
            backgroundColor: "rgba(250, 242, 230, 0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(26, 26, 26, 0.12)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
            pointerEvents: "auto",
          }}
        >
          <div
            className="text-xs md:text-sm italic leading-none"
            style={{
              color: "#1a1a1a",
              fontFamily: SERIF,
              fontVariantNumeric: "tabular-nums",
              opacity: 0.9,
            }}
          >
            {String(currentIndex + 1).padStart(2, "0")} —{" "}
            {String(images.length).padStart(2, "0")}
          </div>
          <div className="flex items-center gap-2">
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
                    width: active ? "32px" : "14px",
                    height: "4px",
                    backgroundColor: "#1a1a1a",
                    opacity: active ? 1 : 0.45,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.opacity = "0.75";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.opacity = "0.45";
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
