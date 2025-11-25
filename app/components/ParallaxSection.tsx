"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  className = "",
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [transform, setTransform] = useState("translateY(0px)");

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const offset = (scrollY - rect.top) * speed;
      setTransform(`translateY(${offset}px)`);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <section ref={sectionRef} className={className} style={{ transform }}>
      {children}
    </section>
  );
}

