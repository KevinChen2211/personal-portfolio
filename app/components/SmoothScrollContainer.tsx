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
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
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

    const smoothScrollTo = (target: number, callback?: () => void) => {
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
          if (callback) callback();
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const nonDuplicateSections = container.querySelectorAll(
        "section:not(.duplicate)"
      );
      const totalSections = nonDuplicateSections.length;
      const viewportHeight = container.clientHeight;
      const currentScroll = container.scrollTop;

      // Don't interfere if already animating
      if (isScrollingRef.current) {
        return;
      }

      // Check if we're in duplicate section
      const duplicateSection = container.querySelector(
        "section.duplicate"
      ) as HTMLElement;
      let isInDuplicate = false;
      let duplicateTop = 0;
      if (duplicateSection) {
        duplicateTop = duplicateSection.offsetTop;
        isInDuplicate =
          container.scrollTop >= duplicateTop - viewportHeight / 2;
      }

      // If in duplicate section and scrolling down, reset to beginning
      if (isInDuplicate && duplicateSection) {
        const distanceIntoDuplicate = container.scrollTop - duplicateTop;

        // When scrolled past halfway into duplicate, seamlessly reset to start
        if (distanceIntoDuplicate >= viewportHeight * 0.3) {
          container.scrollTop = 0;
          scrollAccumulatorRef.current = 0;
          return;
        }

        // Allow scrolling in duplicate but prepare for reset
        if (e.deltaY > 0) {
          container.scrollTop += e.deltaY * 0.5;
          scrollAccumulatorRef.current = 0;
          return;
        } else {
          // Scrolling up from duplicate - go back to last real section
          smoothScrollTo((totalSections - 1) * viewportHeight);
          scrollAccumulatorRef.current = 0;
          return;
        }
      }

      // Calculate current section index
      const currentIndex = Math.floor(currentScroll / viewportHeight);
      const currentSectionTop = currentIndex * viewportHeight;
      const currentSectionBottom = (currentIndex + 1) * viewportHeight;
      const distanceFromTop = currentScroll - currentSectionTop;
      const distanceFromBottom = currentSectionBottom - currentScroll;

      // Accumulate scroll delta - require more scrolling before snapping
      scrollAccumulatorRef.current += e.deltaY;
      const SCROLL_THRESHOLD = 500; // Threshold to prevent scrolling 2 tabs at once

      // Allow continuous scrolling within section boundaries
      const scrollDelta = e.deltaY * 0.5; // Smooth scroll speed
      let newScroll = container.scrollTop + scrollDelta;

      // Check if we're near the edge of a section and have accumulated enough scroll
      const isNearTop = distanceFromTop < 100 && e.deltaY < 0;
      const isNearBottom = distanceFromBottom < 100 && e.deltaY > 0;
      const hasEnoughScroll =
        Math.abs(scrollAccumulatorRef.current) >= SCROLL_THRESHOLD;

      if ((isNearTop || isNearBottom) && hasEnoughScroll) {
        // Snap to next/previous section
        const clampedIndex = Math.max(
          0,
          Math.min(currentIndex, totalSections - 1)
        );
        let nextIndex: number;

        if (e.deltaY > 0) {
          // Scrolling down
          if (clampedIndex >= totalSections - 1) {
            // At the end - scroll to duplicate section for infinite loop effect
            if (duplicateSection) {
              smoothScrollTo(duplicateTop, () => {
                // After reaching duplicate, user continues scrolling and resets
              });
            }
            scrollAccumulatorRef.current = 0;
            return;
          } else {
            nextIndex = clampedIndex + 1;
          }
        } else {
          // Scrolling up
          if (clampedIndex <= 0) {
            scrollAccumulatorRef.current = 0;
            return;
          } else {
            nextIndex = clampedIndex - 1;
          }
        }

        targetScroll = nextIndex * viewportHeight;
        smoothScrollTo(targetScroll);
        scrollAccumulatorRef.current = 0;
      } else {
        // Allow continuous scrolling within section
        // Clamp to section boundaries to prevent seeing next section
        newScroll = Math.max(
          currentSectionTop,
          Math.min(currentSectionBottom, newScroll)
        );
        container.scrollTop = newScroll;
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
