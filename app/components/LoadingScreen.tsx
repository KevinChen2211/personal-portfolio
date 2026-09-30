"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../utils/motion";

const preloadFonts = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const fontPromises = [
          document.fonts.load('400 1em "Juana"'),
          document.fonts.load('400 italic 1em "Juana"'),
          document.fonts.load('400 1em "Playfair Display"'),
          document.fonts.load('400 italic 1em "Playfair Display"'),
        ];
        Promise.all(fontPromises)
          .then(() => resolve())
          .catch(() => resolve());
      });
    } else {
      setTimeout(() => resolve(), 500);
    }
  });
};

type LoadingScreenProps = {
  // False while this is only the server-rendered markup that CSS shows or
  // hides; true once the template has confirmed a first visit.
  active: boolean;
  onComplete: () => void;
  minDisplayTime?: number;
};

export default function LoadingScreen({
  active,
  onComplete,
  // Kept short so first paint of the real page happens quickly; long enough to
  // register the wordmark as a brand moment. Fonts are also preloaded, so the
  // screen rarely needs to wait on them.
  minDisplayTime = 800,
}: LoadingScreenProps) {
  const [isExiting, setIsExiting] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    // On a fresh load the name has been fading in since the server HTML
    // painted, well before hydration; count that toward the minimum.
    const shownFor =
      Number(nameRef.current?.getAnimations?.()[0]?.currentTime) || 0;
    const startTime = Date.now() - shownFor;
    const effectiveMin = prefersReducedMotion ? 200 : minDisplayTime;
    const exitMs = prefersReducedMotion ? 120 : 900;

    const run = async () => {
      try {
        await preloadFonts();
      } catch {}

      if (cancelled) return;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, effectiveMin - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));
      if (cancelled) return;

      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, exitMs));
      if (!cancelled) onComplete();
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [active, minDisplayTime, onComplete, prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-[9999] items-center justify-center"
      style={{
        // Pinned once the intro plays: the home page drops [data-first-visit]
        // part-way through, which would otherwise hide the overlay mid-fade.
        display: active ? "flex" : undefined,
        backgroundColor: "#FAF2E6",
        opacity: isExiting ? 0 : 1,
        transition: prefersReducedMotion
          ? "opacity 0.15s ease-out"
          : "opacity 0.9s var(--ease-out)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      <div
        ref={nameRef}
        className="intro-overlay-name text-4xl md:text-5xl font-bold tracking-wide"
        style={{
          color: "#2C2C2C",
          fontFamily:
            "var(--font-serif)",
        }}
      >
        KEVIN CHEN
      </div>
    </div>
  );
}
