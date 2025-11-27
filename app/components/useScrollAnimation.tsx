"use client";

import { useEffect, useState, RefObject } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: UseScrollAnimationOptions = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { threshold = 0.3, rootMargin = "0px" } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if we're in a smooth scroll container (landing page) or regular page
    const container = document.querySelector('[class*="hide-scrollbar"]') as HTMLElement;
    
    // If no smooth scroll container, use IntersectionObserver for regular pages
    if (!container) {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold, rootMargin }
      );
      observer.observe(element);
      return () => observer.disconnect();
    }

    // Use scroll-based visibility for smooth scroll container
    const updateVisibility = () => {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      const elementTop = elementRect.top - containerRect.top;
      const elementBottom = elementRect.bottom - containerRect.top;
      const containerHeight = containerRect.height;
      
      const visibleTop = Math.max(0, -elementTop);
      const visibleBottom = Math.min(elementRect.height, containerHeight - elementTop);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const progress = Math.min(1, Math.max(0, visibleHeight / containerHeight));
      
      setScrollProgress(progress);
      setIsVisible(progress >= threshold);
    };

    container.addEventListener("scroll", updateVisibility);
    updateVisibility();

    return () => {
      container.removeEventListener("scroll", updateVisibility);
    };
  }, [ref, threshold, rootMargin]);

  return { isVisible, scrollProgress };
}

