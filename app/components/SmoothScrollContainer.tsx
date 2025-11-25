"use client";

import { useEffect, useRef, useState } from "react";

interface SmoothScrollContainerProps {
  children: React.ReactNode;
}

export default function SmoothScrollContainer({
  children,
}: SmoothScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollAccumulatorRef = useRef(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScroll = 0;
    let animationFrameId: number;

    // Update scroll position for parallax
    const updateScroll = () => {
      setScrollY(container.scrollTop);
      requestAnimationFrame(updateScroll);
    };
    updateScroll();

    const smoothScrollTo = (target: number) => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      const startScroll = container.scrollTop;
      const distance = target - startScroll;
      const duration = 800; // ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-in-out)
        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        container.scrollTop = startScroll + distance * ease;

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          container.scrollTop = target;
          isScrollingRef.current = false;
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const allSections = container.querySelectorAll("section");
      const nonDuplicateSections = container.querySelectorAll("section:not(.duplicate)");
      const totalSections = nonDuplicateSections.length;
      const viewportHeight = container.clientHeight;
      const currentScroll = container.scrollTop;
      
      // Accumulate scroll delta - require much more scrolling before snapping
      scrollAccumulatorRef.current += e.deltaY;
      const SCROLL_THRESHOLD = 500; // Significantly increased threshold to prevent scrolling 2 tabs at once

      // Only trigger snap if accumulated scroll exceeds threshold
      if (Math.abs(scrollAccumulatorRef.current) < SCROLL_THRESHOLD) {
        // Allow natural scrolling within threshold
        container.scrollTop += e.deltaY * 0.3; // Slower natural scroll
        return;
      }

      if (isScrollingRef.current) {
        return;
      }

      // Reset accumulator
      scrollAccumulatorRef.current = 0;

      // Calculate current section index (only count non-duplicate sections)
      const currentIndex = Math.round(currentScroll / viewportHeight);
      const clampedIndex = Math.max(0, Math.min(currentIndex, totalSections - 1));

      const delta = e.deltaY;
      let nextIndex: number;

      // Check if we're in duplicate section
      const duplicateSection = container.querySelector("section.duplicate");
      let isInDuplicate = false;
      if (duplicateSection) {
        const duplicateRect = duplicateSection.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const duplicateTop = duplicateSection.offsetTop;
        isInDuplicate = container.scrollTop >= duplicateTop - viewportHeight / 2;
      }

      if (delta > 0) {
        // Scrolling down
        if (isInDuplicate) {
          // Already in duplicate - allow continuous scroll
          container.scrollTop += e.deltaY * 0.4;
          return;
        } else if (clampedIndex >= totalSections - 1) {
          // At the end - scroll to duplicate section for infinite loop effect
          if (duplicateSection) {
            const duplicateTop = duplicateSection.offsetTop;
            smoothScrollTo(duplicateTop);
          }
          return;
        } else {
          nextIndex = clampedIndex + 1;
        }
      } else {
        // Scrolling up
        if (isInDuplicate) {
          // In duplicate section scrolling up - jump back to last real section
          smoothScrollTo((totalSections - 1) * viewportHeight);
          return;
        }
        
        if (clampedIndex <= 0) {
          return;
        } else {
          nextIndex = clampedIndex - 1;
        }
      }

      targetScroll = nextIndex * viewportHeight;
      smoothScrollTo(targetScroll);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll hide-scrollbar"
      style={{
        scrollBehavior: "auto",
      }}
    >
      {children}
    </div>
  );
}

