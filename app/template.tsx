"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only show loading screen on initial mount if landing page
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;

      // Only show loading screen if starting on landing page
      if (pathname === "/") {
        setShowLoading(true);
      } else {
        // For other pages, show content immediately
        setIsVisible(true);
      }
      return;
    }

    // On navigation, just update visibility without loading screen
    // (since all images are already preloaded)
    if (prevPathnameRef.current !== pathname) {
      setIsVisible(false);
      prevPathnameRef.current = pathname;

      // Fade in after a short delay
      timeoutRef.current = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }, 150);
    }
  }, [pathname]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Wait a bit longer for images to be ready, then fade in
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    }, 200); // Increased delay to allow images to load
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        className="page-transition-wrapper"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          transition: isVisible
            ? "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            : "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "100vh",
          willChange: isVisible ? "auto" : "opacity, transform",
        }}
      >
        {children}
      </div>
    </>
  );
}
