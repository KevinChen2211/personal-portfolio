"use client";

import { usePathname } from "next/navigation";
import NavInner from "./NavInner";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="w-full px-6 md:px-12 lg:px-16 py-5 md:py-6 flex items-center justify-between fixed z-50 top-0 transition-colors duration-[1800ms]"
      style={{
        backgroundColor: "#FAF2E6",
        color: "#2C2C2C",
      }}
    >
      <NavInner activePath={pathname} />
    </header>
  );
}
