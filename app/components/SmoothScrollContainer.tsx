"use client";

import { useEffect, useRef } from "react";

interface SmoothScrollContainerProps {
  children: React.ReactNode;
}

export default function SmoothScrollContainer({
  children,
}: SmoothScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

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

      if (isScrollingRef.current) return;

      const duplicateSection = container.querySelector(
        "section.duplicate"
      ) as HTMLElement;
      let isInDuplicate = false;
      let duplicateTop = 0;
      if (duplicateSection) {
        duplicateTop = duplicateSection.offsetTop;
        isInDuplicate = container.scrollTop >= duplicateTop;
      }

      let justReset = false;

      if (isInDuplicate && duplicateSection) {
        const distanceIntoDuplicate = container.scrollTop - duplicateTop;

        if (e.deltaY > 0) {
          const scrollDelta = e.deltaY * 0.5;
          const newScroll = container.scrollTop + scrollDelta;

          if (distanceIntoDuplicate + scrollDelta >= viewportHeight * 0.5) {
            container.scrollTop = 0;
            scrollAccumulatorRef.current = 0;
            justReset = true;
          } else {
            container.scrollTop = newScroll;
            scrollAccumulatorRef.current = 0;
            return;
          }
        } else {
          smoothScrollTo((totalSections - 1) * viewportHeight);
          scrollAccumulatorRef.current = 0;
          return;
        }
      }

      const actualScroll = justReset ? 0 : container.scrollTop;
      scrollAccumulatorRef.current += e.deltaY;

      const currentIndex = Math.floor(actualScroll / viewportHeight);
      const currentSectionTop = currentIndex * viewportHeight;
      const currentSectionBottom = (currentIndex + 1) * viewportHeight;
      const distanceFromTop = actualScroll - currentSectionTop;
      const distanceFromBottom = currentSectionBottom - actualScroll;
      const SCROLL_THRESHOLD = 500;

      const scrollDelta = e.deltaY * 0.5;
      let newScroll = actualScroll + scrollDelta;

      if (justReset) {
        container.scrollTop = 0;
      }

      const isNearTop = distanceFromTop < 100 && e.deltaY < 0;
      const isNearBottom = distanceFromBottom < 100 && e.deltaY > 0;
      const hasEnoughScroll =
        Math.abs(scrollAccumulatorRef.current) >= SCROLL_THRESHOLD;

      if ((isNearTop || isNearBottom) && hasEnoughScroll) {
        const clampedIndex = Math.max(
          0,
          Math.min(currentIndex, totalSections - 1)
        );
        let nextIndex: number;

        if (e.deltaY > 0) {
          if (clampedIndex >= totalSections - 1) {
            if (duplicateSection) {
              smoothScrollTo(duplicateTop);
            }
            scrollAccumulatorRef.current = 0;
            return;
          } else {
            nextIndex = clampedIndex + 1;
          }
        } else {
          if (clampedIndex <= 0) {
            scrollAccumulatorRef.current = 0;
            return;
          } else {
            nextIndex = clampedIndex - 1;
          }
        }

        const targetScroll = nextIndex * viewportHeight;
        smoothScrollTo(targetScroll);
        scrollAccumulatorRef.current = 0;
      } else {
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
