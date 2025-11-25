"use client";

import { useEffect, useState, useRef } from "react";
import { activePalette } from "../color-palettes";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"large" | "transitioning" | "complete">("large");
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show large name for 1.2 seconds
    const largeTimer = setTimeout(() => {
      setPhase("transitioning");
    }, 1200);

    // Transition phase - smoothly shrink and fade
    const transitionTimer = setTimeout(() => {
      setPhase("complete");
      setTimeout(() => {
        onComplete();
      }, 400);
    }, 2800);

    return () => {
      clearTimeout(largeTimer);
      clearTimeout(transitionTimer);
    };
  }, [onComplete]);

  return (
    <div
      ref={introRef}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        phase === "complete" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: activePalette.background,
        zIndex: phase === "complete" ? -1 : 50,
      }}
    >
      <h1
        className={`font-bold transition-all duration-1500 ease-in-out ${
          phase === "large"
            ? "text-[10rem] sm:text-[14rem] md:text-[18rem] lg:text-[22rem] scale-100 opacity-100"
            : phase === "transitioning"
            ? "text-6xl sm:text-8xl scale-[0.15] opacity-0"
            : "opacity-0 scale-0"
        }`}
        style={{
          color: activePalette.text,
          transformOrigin: "center center",
          letterSpacing: phase === "large" ? "0.05em" : "0.02em",
        }}
      >
        Kevin Chen
      </h1>
    </div>
  );
}

