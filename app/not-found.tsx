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
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* Masked reveal layer */}
      <div className="absolute inset-0 reveal-mask">
        {/* Center content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center gap-3">
          <p className="text-xs tracking-[0.3em] text-white/60">404 ERROR</p>

          <h1 className="text-4xl font-medium">There is no light here</h1>

          <p className="text-sm text-white/50">
            Sorry, the page you are looking for doesn’t exist.
          </p>

          <Link
            href="/"
            className="mt-4 rounded bg-white px-4 py-2 text-sm text-black"
          >
            Home page
          </Link>
        </div>

        {/* Giant background number */}
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[40vw] font-bold leading-none text-white/15">
          404
        </div>
      </div>
    </main>
  );
}
