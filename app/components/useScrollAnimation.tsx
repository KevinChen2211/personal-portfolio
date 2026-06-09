"use client";

import { useEffect, useState, RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

// Lightweight IntersectionObserver-based visibility hook. We disconnect once
// the element has been seen so we're not paying for ongoing observation on
// long pages with many cards.
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollAnimationOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.3, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return { isVisible, scrollProgress: isVisible ? 1 : 0 };
}
