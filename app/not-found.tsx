"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", move);
    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
      style={{ cursor: "none" }}
    >
      {/* Background layer with 404 numbers */}
      <div className="absolute inset-0">
        {/* Giant background number - revealed by mask */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div className="text-[clamp(200px,40vw,600px)] font-black leading-none text-white/20 tracking-tighter">
            404
          </div>
        </div>
      </div>

      {/* Dark overlay that gets revealed by mouse glow */}
      <div className="absolute inset-0 reveal-mask bg-black" />

      {/* Mouse glow effect */}
      <div
        className="fixed pointer-events-none z-10"
        style={{
          left: "var(--x)",
          top: "var(--y)",
          width: "400px",
          height: "400px",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
          borderRadius: "50%",
          transition: "opacity 0.1s ease-out",
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

        <p
          className="text-sm md:text-base text-white/50 mb-8"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
          }}
        >
          Sorry, the page you are looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="mt-4 rounded-sm bg-white px-8 py-3 text-sm text-black transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
          style={{
            fontFamily:
              "'Juana', var(--font-display), 'Playfair Display', 'Times New Roman', serif",
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
