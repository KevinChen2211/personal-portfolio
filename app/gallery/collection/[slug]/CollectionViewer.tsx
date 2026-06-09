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

// Frosted-glass surface shared by every floating control so their look stays
// in sync. Translucent enough to feel like a glass overlay, opaque enough to
// keep dark icons readable over dark photos.
const GLASS_BG = "rgba(250, 242, 230, 0.55)";
const GLASS_BG_HOVER = "rgba(250, 242, 230, 0.78)";
const GLASS_BORDER = "1px solid rgba(26, 26, 26, 0.08)";
const GLASS_SHADOW = "0 2px 10px rgba(0, 0, 0, 0.06)";
const GLASS_BLUR = "blur(14px) saturate(1.4)";

function NavButton({
  direction,
  onClick,
  disabled,
  chromeVisible,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  chromeVisible: boolean;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous image" : "Next image"}
      className={`absolute top-1/2 z-10 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center ${
        isPrev
          ? "left-2 sm:left-5 md:left-7"
          : "right-2 sm:right-5 md:right-7"
      }`}
      style={{
        // Tailwind's -translate-y-1/2 plus an inline translate would clash;
        // we keep all transforms inline so press/hover never adds vertical
        // motion (which previously caused the "raise" on click).
        transform: "translateY(-50%)",
        color: "#1a1a1a",
        opacity: chromeVisible ? (disabled ? 0.25 : 1) : 0,
        cursor: disabled ? "default" : "pointer",
        width: 40,
        height: 40,
        backgroundColor: GLASS_BG,
        backdropFilter: GLASS_BLUR,
        WebkitBackdropFilter: GLASS_BLUR,
        border: GLASS_BORDER,
        boxShadow: GLASS_SHADOW,
      }}
      onMouseEnter={(e) => {
        if (!disabled)
          e.currentTarget.style.backgroundColor = GLASS_BG_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = GLASS_BG;
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isPrev ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

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

      {/* Top chrome — opaque cream band so the photo can never bleed up
          behind the title text. Visually merges with the navbar (same
          colour) into a single editorial top strip. */}
      <header
        className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 pt-20 md:pt-28 pb-2 md:pb-4 pointer-events-none"
        style={{
          backgroundColor: bgColor,
          opacity: chromeVisible ? 1 : 0,
          transform: chromeVisible ? "translateY(0)" : "translateY(-8px)",
          transition:
            "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/gallery"
            className="text-xs md:text-sm transition-all duration-300 hover:underline hover:translate-x-[-3px] pointer-events-auto"
            style={{ color: textColor, fontFamily: SERIF, opacity: 0.85 }}
          >
            ← Back to Gallery
          </Link>
          <h1
            className="hidden md:block text-base md:text-lg tracking-wide italic text-right pointer-events-auto truncate"
            style={{ color: textColor, fontFamily: SERIF, maxWidth: "60vw" }}
          >
            {title}
          </h1>
        </div>
        {/* Mobile-only title — sits tight under the back link so portrait
            photos never crowd it. */}
        <h1
          className="md:hidden mt-0.5 text-[13px] italic text-center pointer-events-auto leading-tight"
          style={{ color: textColor, fontFamily: SERIF, opacity: 0.85 }}
        >
          {title}
        </h1>
      </header>

      {/* Stage — pinned to the viewport so the photo sits at the true vertical
          centre (50vh) regardless of header/footer height. The chrome above
          and below floats over it. */}
      <main
        className="absolute inset-0 flex items-center justify-center px-12 sm:px-20 md:px-28 lg:px-36 pt-28 md:pt-32 pb-24 md:pb-28"
      >
        {/* Image stage — a regular flex child of <main> so it lives inside
            main's content box and respects the top/bottom padding. Each
            image is then absolutely placed within this stage, which means
            portrait photos can never extend up into the header band. */}
        <div className="relative w-full h-full">
          {visibleIndices.map((idx) => (
            <div
              key={idx}
              aria-hidden={idx !== currentIndex}
              className="absolute inset-0 flex items-center justify-center"
              style={{
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
        </div>

        {/* Prev / next arrow buttons — translucent frosted pills that read on
            both light and dark photos without dominating either. */}
        <NavButton
          direction="prev"
          onClick={goPrev}
          disabled={!hasPrev}
          chromeVisible={chromeVisible}
        />
        <NavButton
          direction="next"
          onClick={goNext}
          disabled={!hasNext}
          chromeVisible={chromeVisible}
        />
      </main>

      {/* Bottom strip — counter + progress dashes inside a translucent glass
          pill that picks up the colour behind it without going opaque. */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pb-4 md:pb-8 flex justify-center px-3"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transition: "opacity 0.6s ease-out",
          pointerEvents: "none",
        }}
      >
        <div
          className="flex flex-col items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full"
          style={{
            backgroundColor: GLASS_BG,
            backdropFilter: GLASS_BLUR,
            WebkitBackdropFilter: GLASS_BLUR,
            border: GLASS_BORDER,
            boxShadow: GLASS_SHADOW,
            pointerEvents: "auto",
          }}
        >
          <div
            className="text-[11px] md:text-sm italic leading-none"
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
          <div className="flex items-center gap-1.5 md:gap-2">
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
                    height: "3px",
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
