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

      // Get the scroll container instead of window
      const container = document.querySelector(
        '[class*="hide-scrollbar"]'
      ) as HTMLElement;

      if (!container) return;

      const containerScrollTop = container.scrollTop;
      const containerRect = container.getBoundingClientRect();
      const sectionRect = sectionRef.current.getBoundingClientRect();

      // Calculate offset relative to container
      const sectionTopRelativeToContainer =
        sectionRect.top - containerRect.top + containerScrollTop;
      const offset =
        (containerScrollTop - sectionTopRelativeToContainer) * speed;

      setTransform(`translateY(${offset}px)`);
    };

    const container = document.querySelector('[class*="hide-scrollbar"]');
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [speed]);

  return (
    <section ref={sectionRef} className={className} style={{ transform }}>
      {children}
    </section>
  );
}
