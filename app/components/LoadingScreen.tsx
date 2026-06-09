"use client";

import { useEffect, useState } from "react";

// Preload fonts only — Next.js <Image priority> already injects the right
// preload tags for above-the-fold images, so we don't need to fetch the
// raw multi-MB JPGs here (which used to block first paint by 5–10s on
// slow connections).
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
      setTimeout(() => resolve(), 300);
    }
  });
};

type LoadingScreenProps = {
  onComplete: () => void;
  minDisplayTime?: number;
};

export default function LoadingScreen({
  onComplete,
  minDisplayTime = 400,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    let cancelled = false;

    // Animate the progress bar smoothly while the small amount of
    // critical work (fonts) finishes.
    const interval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 4 : p));
    }, 30);

    const finish = async () => {
      try {
        await preloadFonts();
      } catch {}
      if (cancelled) return;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDisplayTime - elapsed);
      await new Promise((resolve) => setTimeout(resolve, remaining));
      if (cancelled) return;

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        if (cancelled) return;
        setIsLoading(false);
        setTimeout(() => {
          if (!cancelled) onComplete();
        }, 200);
      }, 80);
    };

    finish();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [minDisplayTime, onComplete]);

  if (!isLoading && progress === 100) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: "#FAF2E6",
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? "auto" : "none",
      }}
    >
      <div className="text-center">
        <div
          className="text-4xl md:text-5xl font-bold mb-8"
          style={{
            color: "#2C2C2C",
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          KEVIN CHEN
        </div>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2C2C2C] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
