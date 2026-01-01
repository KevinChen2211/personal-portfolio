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
      prevPathnameRef.current = pathname;

      // Very brief fade, then immediate fade in
      // Content stays visible during transition to prevent dark flash
      setIsVisible(false);

      // Fade in immediately - no delay since images are preloaded
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
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

  // Set body background on mount and route changes
  useEffect(() => {
    document.body.style.backgroundColor = "#FAF2E6";
    document.documentElement.style.backgroundColor = "#FAF2E6";

    return () => {
      // Cleanup if needed
    };
  }, [pathname]);

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {/* Background layer to prevent dark flash */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#FAF2E6",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <div
        className="page-transition-wrapper"
        style={{
          opacity: isVisible ? 1 : 0.95, // Keep high opacity to prevent dark flash
          transform: isVisible ? "translateY(0)" : "translateY(2px)",
          transition: isVisible
            ? "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            : "opacity 0.05s cubic-bezier(0.4, 0, 0.2, 1), transform 0.05s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#FAF2E6", // Prevent black flash
          position: "relative",
        }}
      >
        {children}
      </div>
    </>
  );
}
