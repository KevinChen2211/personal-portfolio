"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useHasFinePointer, usePrefersReducedMotion } from "./utils/motion";

// Fraction of the remaining distance the glow covers each frame — low value
// means a long, heavy trail behind the pointer.
const GLOW_LAG = 0.01;
// Park the animation loop once the glow is this close to the pointer. The
// glow drives a full-viewport `mask-image`, which repaints (rather than
// composites) on every change, so a loop that never idles burns the CPU for
// as long as the page is open.
const GLOW_SETTLE_PX = 0.5;
// At a 1% lag the last stretch of the chase crawls in under a subpixel per
// frame. Keep converging, but stop writing the variables — and so stop
// triggering the mask repaint — once the movement is invisible.
const GLOW_REPAINT_PX = 0.25;

export default function NotFound() {
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const currentGlowRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useHasFinePointer();
  // The reveal is pointer-tracking by nature: meaningless without a precise
  // pointer, and exactly the kind of large moving surface reduced motion asks
  // us to drop. The matching `@media` rules in globals.css hide the visual
  // layers before first paint; this only gates the JS.
  const revealEnabled = hasFinePointer && !prefersReducedMotion;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const restoreScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    if (!revealEnabled) return restoreScroll;

    const root = document.documentElement;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetPositionRef.current = { x: centerX, y: centerY };
    currentGlowRef.current = { x: centerX, y: centerY };
    root.style.setProperty("--x", `${centerX}px`);
    root.style.setProperty("--y", `${centerY}px`);
    root.style.setProperty("--glow-x", `${centerX}px`);
    root.style.setProperty("--glow-y", `${centerY}px`);

    let isPageVisible = document.visibilityState === "visible";
    let painted = { x: centerX, y: centerY };

    const ensureAnimation = () => {
      if (animationFrameRef.current === null && isPageVisible) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    function animate() {
      animationFrameRef.current = null;
      if (!isPageVisible) return;

      const target = targetPositionRef.current;
      const current = currentGlowRef.current;
      const next = {
        x: current.x + (target.x - current.x) * GLOW_LAG,
        y: current.y + (target.y - current.y) * GLOW_LAG,
      };
      currentGlowRef.current = next;

      // The glow layers read these directly, so no React re-render is needed
      // on each frame.
      if (
        Math.abs(next.x - painted.x) >= GLOW_REPAINT_PX ||
        Math.abs(next.y - painted.y) >= GLOW_REPAINT_PX
      ) {
        root.style.setProperty("--glow-x", `${next.x}px`);
        root.style.setProperty("--glow-y", `${next.y}px`);
        painted = next;
      }

      const settled =
        Math.abs(target.x - next.x) < GLOW_SETTLE_PX &&
        Math.abs(target.y - next.y) < GLOW_SETTLE_PX;
      if (!settled) ensureAnimation();
    }

    const move = (e: PointerEvent) => {
      // The dot sits on the pointer itself, so it updates without any lag.
      root.style.setProperty("--x", `${e.clientX}px`);
      root.style.setProperty("--y", `${e.clientY}px`);
      targetPositionRef.current = { x: e.clientX, y: e.clientY };
      ensureAnimation();
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
      if (isPageVisible) ensureAnimation();
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    ensureAnimation();

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      root.style.removeProperty("--x");
      root.style.removeProperty("--y");
      root.style.removeProperty("--glow-x");
      root.style.removeProperty("--glow-y");
      restoreScroll();
    };
  }, [revealEnabled]);

  return (
    <main
      className="reveal-page fixed inset-0 bg-black text-white"
      style={{ overflow: "hidden" }}
    >
      {/* Background layer with 404 numbers */}
      <div className="absolute inset-0">
        {/* Giant background number - revealed by mask */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-[clamp(200px,40vw,600px)] font-black leading-none text-white/20 tracking-tighter">
            404
          </div>
        </div>
      </div>

      {/* Dark overlay that gets revealed by the pointer glow */}
      <div className="absolute inset-0 reveal-mask bg-black" />

      {/* Pointer glow - lags behind the pointer */}
      <div
        className="reveal-glow fixed pointer-events-none z-10"
        style={{
          left: 0,
          top: 0,
          width: "400px",
          height: "400px",
          // Positioned with transform rather than left/top so moving it
          // composites instead of triggering layout every frame.
          transform:
            "translate(calc(var(--glow-x, 50vw) - 50%), calc(var(--glow-y, 50vh) - 50%))",
          willChange: "transform",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Custom cursor dot */}
      <div
        className="reveal-cursor fixed pointer-events-none z-30"
        style={{
          left: 0,
          top: 0,
          width: "20px",
          height: "20px",
          transform:
            "translate(calc(var(--x, 50vw) - 50%), calc(var(--y, 50vh) - 50%))",
          willChange: "transform",
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)",
          borderRadius: "50%",
        }}
      />

      {/* Center content - always visible */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-center gap-3 px-6">
        <p
          className="text-xs text-white/60 uppercase"
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
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
          }}
        >
          There is no light here
        </h1>

        <p className="text-sm md:text-base text-white/50 mb-8">
          Sorry, the page you are looking for doesn&apos;t exist.
        </p>

        <Link
          href="/"
          className="mt-4 rounded-sm bg-white px-8 py-3 text-sm text-black transition-transform duration-300 ease-[var(--ease-out)] hover:scale-105 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:scale-100"
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
