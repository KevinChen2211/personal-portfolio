"use client";

import { useEffect, useState, useMemo } from "react";
import { activePalette } from "../color-palettes";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);

  // Generate particles
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    // Show text when progress reaches 30%
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 600);

    // Reveal text animation
    const revealTimer = setTimeout(() => {
      setTextRevealed(true);
    }, 1200);

    // Complete animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: activePalette.background,
      }}
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${activePalette.primary} 0%, transparent 70%)`,
              opacity: particle.opacity,
              animation: `particleFloat ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated text */}
        <div className="relative">
          <h1
            className={`text-6xl sm:text-7xl md:text-8xl font-bold transition-all duration-1000 ${
              showText ? "opacity-100" : "opacity-0"
            }`}
            style={{
              color: activePalette.text,
              letterSpacing: "0.05em",
            }}
          >
            <span
              className={`inline-block transition-all duration-700 ${
                textRevealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              Kevin
            </span>
            <span className="mx-2" />
            <span
              className={`inline-block transition-all duration-700 ${
                textRevealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              Chen
            </span>
          </h1>

          {/* Glowing effect */}
          <div
            className={`absolute inset-0 blur-2xl transition-opacity duration-1000 ${
              textRevealed ? "opacity-30" : "opacity-0"
            }`}
            style={{
              background: `radial-gradient(circle, ${activePalette.primary} 0%, transparent 70%)`,
              transform: "scale(1.5)",
            }}
          />
        </div>

        {/* Progress bar */}
        <div className="w-64 sm:w-80 h-1 bg-opacity-20 rounded-full overflow-hidden" style={{ backgroundColor: activePalette.border }}>
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${activePalette.primary}, ${activePalette.secondary})`,
              boxShadow: `0 0 20px ${activePalette.primary}40`,
            }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: activePalette.primary,
                animation: `pulse 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
