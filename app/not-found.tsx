"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function NotFound() {
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const currentGlowRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Initialize positions to center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetPositionRef.current = { x: centerX, y: centerY };
    currentGlowRef.current = { x: centerX, y: centerY };
    setGlowPosition({ x: centerX, y: centerY });
    document.documentElement.style.setProperty("--glow-x", `${centerX}px`);
    document.documentElement.style.setProperty("--glow-y", `${centerY}px`);

    const move = (e: MouseEvent) => {
      // Update cursor position immediately
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);

      // Update target position (where glow should eventually reach)
      targetPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    // Continuous animation loop - updates glow position every frame
    const animate = () => {
      const lagFactor = 0.01; // Lower = more lag (reduced from 0.15 for more lag)
      const target = targetPositionRef.current;
      const current = currentGlowRef.current;

      // Calculate new position with lag
      currentGlowRef.current = {
        x: current.x + (target.x - current.x) * lagFactor,
        y: current.y + (target.y - current.y) * lagFactor,
      };

      // Update state and CSS variables
      setGlowPosition(currentGlowRef.current);
      document.documentElement.style.setProperty(
        "--glow-x",
        `${currentGlowRef.current.x}px`
      );
      document.documentElement.style.setProperty(
        "--glow-y",
        `${currentGlowRef.current.y}px`
      );

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", move);
    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.body.style.cursor = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <main
      className="fixed inset-0 bg-black text-white"
      style={{ cursor: "none", overflow: "hidden" }}
    >
      {/* Background layer with 404 numbers */}
      <div className="absolute inset-0">
        {/* Giant background number - revealed by mask */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-[clamp(200px,40vw,600px)] font-black leading-none text-white/20 tracking-tighter tracking-wide">
            404
          </div>
        </div>
      </div>

      {/* Dark overlay that gets revealed by mouse glow */}
      <div className="absolute inset-0 reveal-mask bg-black" />

      {/* Mouse glow effect - lags behind cursor */}
      <div
        className="fixed pointer-events-none z-10"
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
          borderRadius: "50%",
          transition: "none",
        }}
      />

      {/* Custom cursor dot */}
      <div
        className="fixed pointer-events-none z-30"
        style={{
          left: "var(--x)",
          top: "var(--y)",
          width: "20px",
          height: "20px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)",
          borderRadius: "50%",
        }}
      />

      {/* Center content - always visible */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center gap-3 px-6">
        <p
          className="text-xs tracking-[0.3em] text-white/60 uppercase"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.3em",
          }}
        >
          404 ERROR
        </p>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-light mb-2"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          There is no light here
        </h1>

        <p className="text-sm md:text-base text-white/50 mb-8">
          Sorry, the page you are looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="mt-4 rounded-sm bg-white px-8 py-3 text-sm text-black transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
          style={{
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          Home page
        </Link>
      </div>
    </main>
  );
}
