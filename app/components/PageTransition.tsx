"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isVisible, setIsVisible] = useState(true);
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip transition on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setDisplayChildren(children);
      setIsVisible(true);
      return;
    }

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only trigger transition if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      // Start fade out
      setIsVisible(false);

      // After fade out completes, update content
      timeoutRef.current = setTimeout(() => {
        setDisplayChildren(children);
        prevPathnameRef.current = pathname;
        
        // Use double RAF to ensure DOM update before fade in
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }, 300); // Wait for fade out to complete (300ms)
    } else {
      // Update children without transition if pathname didn't change
      setDisplayChildren(children);
      setIsVisible(true);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, children]);

  return (
    <div
      className="page-transition-wrapper"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
        transition: isVisible
          ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          : "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: "100vh",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {displayChildren}
    </div>
  );
}

