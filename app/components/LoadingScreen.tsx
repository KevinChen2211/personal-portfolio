"use client";

import { useEffect, useState } from "react";

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
  onComplete: () => void;
  minDisplayTime?: number;
};

export default function LoadingScreen({
  onComplete,
  minDisplayTime = 1400,
}: LoadingScreenProps) {
  const [nameVisible, setNameVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startTime = Date.now();

    const run = async () => {
      requestAnimationFrame(() => {
        if (!cancelled) setNameVisible(true);
      });

      try {
        await preloadFonts();
      } catch {}

      if (cancelled) return;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));
      if (cancelled) return;

      setIsExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      if (!cancelled) onComplete();
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [minDisplayTime, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: "#FAF2E6",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 0.9s var(--ease-out)",
        pointerEvents: isExiting ? "none" : "auto",
      }}
    >
      <div
        className="text-4xl md:text-5xl font-bold tracking-wide"
        style={{
          color: "#2C2C2C",
          fontFamily:
            "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          opacity: nameVisible ? 1 : 0,
          transform: nameVisible ? "translateY(0)" : "translateY(12px)",
          transition:
            "opacity 1.2s var(--ease-out), transform 1.2s var(--ease-out)",
        }}
      >
        KEVIN CHEN
      </div>
    </div>
  );
}
