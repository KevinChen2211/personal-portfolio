"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavInner from "./NavInner";

export default function Navbar() {
  const pathname = usePathname();
  const [compactWordmark, setCompactWordmark] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    const updateWordmark = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        setCompactWordmark(window.scrollY > 72);
        frameId = null;
      });
    };

    updateWordmark();
    window.addEventListener("scroll", updateWordmark, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateWordmark);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [pathname]);

  return (
    <header
      className="w-full px-6 md:px-12 lg:px-16 py-5 md:py-6 fixed z-50 top-0 transition-colors duration-[1800ms]"
      style={{
        backgroundColor: "#FAF2E6",
        color: "#2C2C2C",
      }}
    >
      <div className="site-container flex items-center justify-between">
        <NavInner activePath={pathname} compact={compactWordmark} />
      </div>
    </header>
  );
}
