"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate distance from mouse to each digit position
  const getDigitOpacity = (digitIndex: number) => {
    if (!isMounted || !mousePosition) return 0;
    
    // Position of each digit (centered, spaced out)
    const digitPositions = [
      { x: typeof window !== "undefined" ? window.innerWidth * 0.25 : 0, y: typeof window !== "undefined" ? window.innerHeight * 0.5 : 0 }, // First "4"
      { x: typeof window !== "undefined" ? window.innerWidth * 0.5 : 0, y: typeof window !== "undefined" ? window.innerHeight * 0.5 : 0 },  // "0"
      { x: typeof window !== "undefined" ? window.innerWidth * 0.75 : 0, y: typeof window !== "undefined" ? window.innerHeight * 0.5 : 0 }, // Second "4"
    ];

    const digitPos = digitPositions[digitIndex];
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - digitPos.x, 2) +
      Math.pow(mousePosition.y - digitPos.y, 2)
    );

    // Reveal when glow is within 300px
    const maxDistance = 300;
    const opacity = Math.max(0, 1 - distance / maxDistance);
    return Math.min(1, opacity * 1.5); // Boost visibility
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        cursor: "none",
      }}
    >
      {/* Mouse glow effect */}
      {mousePosition && (
        <div
          className="fixed pointer-events-none"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: "400px",
            height: "400px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)",
            borderRadius: "50%",
            transition: "opacity 0.3s ease-out",
            zIndex: 10,
          }}
        />
      )}

      {/* Large 404 numbers in background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          {/* First "4" */}
          <div
            className="absolute"
            style={{
              left: "25%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(200px, 40vw, 600px)",
              fontWeight: 900,
              color: "#1a1a1a",
              opacity: getDigitOpacity(0),
              transition: "opacity 0.2s ease-out",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            4
          </div>
          {/* "0" */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(200px, 40vw, 600px)",
              fontWeight: 900,
              color: "#1a1a1a",
              opacity: getDigitOpacity(1),
              transition: "opacity 0.2s ease-out",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            0
          </div>
          {/* Second "4" */}
          <div
            className="absolute"
            style={{
              left: "75%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(200px, 40vw, 600px)",
              fontWeight: 900,
              color: "#1a1a1a",
              opacity: getDigitOpacity(2),
              transition: "opacity 0.2s ease-out",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            4
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center z-20"
        style={{
          pointerEvents: "auto",
        }}
      >
        {/* 404 ERROR text */}
        <div
          className="text-xs uppercase tracking-widest mb-8"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.3em",
            opacity: 0.7,
          }}
        >
          404 ERROR
        </div>

        {/* Main message */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 text-center px-6"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          There is no light here
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm md:text-base mb-12 text-center px-6"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            opacity: 0.6,
          }}
        >
          Sorry, the page you are looking for doesn't exist.
        </p>

        {/* Home page button */}
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black rounded-sm transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            fontWeight: 500,
            fontSize: "0.95rem",
            letterSpacing: "0.05em",
          }}
        >
          Home page
        </Link>
      </div>

      {/* Custom cursor */}
      {mousePosition && (
        <div
          className="fixed pointer-events-none z-30"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
            borderRadius: "50%",
            transition: "opacity 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
}

