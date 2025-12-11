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
  const velocityRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number | undefined;
    let momentumAnimationId: number | undefined;

    // Enhanced easing function - smooth ease-out cubic
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    // Even smoother easing - ease-in-out with custom curve
    const smoothEase = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const smoothScrollTo = (target: number, callback?: () => void) => {
      if (isScrollingRef.current) {
        // Cancel any existing momentum scroll
        if (momentumAnimationId) {
          cancelAnimationFrame(momentumAnimationId);
        }
      }
      
      isScrollingRef.current = true;

      const startScroll = container.scrollTop;
      const distance = target - startScroll;
      const duration = Math.min(800, Math.max(400, Math.abs(distance) * 0.8)); // Dynamic duration based on distance
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use smooth easing for more natural feel
        const ease = smoothEase(progress);

        container.scrollTop = startScroll + distance * ease;

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          container.scrollTop = target;
          isScrollingRef.current = false;
          velocityRef.current = 0;
          if (callback) callback();
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    // Expose smoothScrollTo for external use (e.g., ScrollIndicator)
    (container as any).smoothScrollTo = smoothScrollTo;

    // Track scroll velocity for momentum
    const updateVelocity = () => {
      const now = performance.now();
      const currentScroll = container.scrollTop;
      const timeDelta = now - lastScrollTimeRef.current;
      
      if (timeDelta > 0) {
        const scrollDelta = currentScroll - lastScrollTopRef.current;
        velocityRef.current = scrollDelta / timeDelta;
      }
      
      lastScrollTimeRef.current = now;
      lastScrollTopRef.current = currentScroll;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const sections = container.querySelectorAll("section");
      const totalSections = sections.length;
      const viewportHeight = container.clientHeight;
      const currentScroll = container.scrollTop;

      // Update velocity tracking
      updateVelocity();

      if (isScrollingRef.current) return;

      scrollAccumulatorRef.current += e.deltaY;

      const currentIndex = Math.floor(currentScroll / viewportHeight);
      const currentSectionTop = currentIndex * viewportHeight;
      const currentSectionBottom = (currentIndex + 1) * viewportHeight;
      const distanceFromTop = currentScroll - currentSectionTop;
      const distanceFromBottom = currentSectionBottom - currentScroll;
      
      // More responsive thresholds
      const SCROLL_THRESHOLD = 40; // Lower threshold for quicker response
      const EDGE_DETECTION_DISTANCE = 150; // Optimized detection distance

      // Smoother scroll delta with momentum consideration
      const scrollDelta = e.deltaY * 0.4; // Reduced multiplier for smoother feel
      let newScroll = currentScroll + scrollDelta;

      const isNearTop =
        distanceFromTop < EDGE_DETECTION_DISTANCE && e.deltaY < 0;
      const isNearBottom =
        distanceFromBottom < EDGE_DETECTION_DISTANCE && e.deltaY > 0;
      const hasEnoughScroll =
        Math.abs(scrollAccumulatorRef.current) >= SCROLL_THRESHOLD;

      if ((isNearTop || isNearBottom) && hasEnoughScroll) {
        const clampedIndex = Math.max(
          0,
          Math.min(currentIndex, totalSections - 1)
        );
        let nextIndex: number;

        if (e.deltaY > 0) {
          // Scrolling down - prevent going past last section
          if (clampedIndex >= totalSections - 1) {
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

        const targetScroll = nextIndex * viewportHeight;
        smoothScrollTo(targetScroll);
        scrollAccumulatorRef.current = 0;
        velocityRef.current = 0;
      } else {
        // Smooth free scrolling with momentum
        const maxScroll = (totalSections - 1) * viewportHeight;
        newScroll = Math.max(
          currentSectionTop,
          Math.min(Math.min(currentSectionBottom, maxScroll), newScroll)
        );
        
        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          container.scrollTop = newScroll;
        });
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (momentumAnimationId) {
        cancelAnimationFrame(momentumAnimationId);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll hide-scrollbar"
      style={{
        scrollBehavior: "auto",
        // Add smooth momentum scrolling
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </div>
  );
}
