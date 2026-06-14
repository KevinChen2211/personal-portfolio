"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";
import { usePrefersReducedMotion } from "./utils/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only show loading screen on initial mount if landing page AND first visit
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;

      // Only show loading screen if starting on landing page AND haven't visited before
      if (pathname === "/") {
        const hasVisitedBefore = sessionStorage.getItem("hasVisitedLanding");
        if (!hasVisitedBefore && !prefersReducedMotion) {
          setShowLoading(true);
        } else {
          if (!hasVisitedBefore) {
            sessionStorage.setItem("hasVisitedLanding", "true");
          }
          // Returning to landing page - show immediately
          setIsVisible(true);
        }
      } else {
        // For other pages, show content immediately
        setIsVisible(true);
      }
      return;
    }

    // On navigation, just update visibility without loading screen
    // (since all images are already preloaded)
    if (prevPathnameRef.current !== pathname) {
      const isCollectionPage = pathname.startsWith("/gallery/collection/");
      const wasCollectionPage = prevPathnameRef.current?.startsWith(
        "/gallery/collection/",
      );
      const navigatingToCollection =
        sessionStorage.getItem("navigatingToCollection") === "true";

      prevPathnameRef.current = pathname;

      if (isCollectionPage || wasCollectionPage || navigatingToCollection) {
        if (prefersReducedMotion) {
          setIsVisible(true);
          if (navigatingToCollection) {
            sessionStorage.removeItem("navigatingToCollection");
          }
          return;
        }

        // Briefly fade out for collection transitions
        setIsVisible(false);

        if (navigatingToCollection) {
          sessionStorage.removeItem("navigatingToCollection");
        }

        timeoutRef.current = setTimeout(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        }, 280);
      } else if (!prefersReducedMotion) {
        // Regular page transition - quick fade
        setIsVisible(false);
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      } else {
        setIsVisible(true);
      }
    }
  }, [pathname, prefersReducedMotion]);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    // Mark that landing page has been visited
    if (pathname === "/") {
      sessionStorage.setItem("hasVisitedLanding", "true");
    }
    timeoutRef.current = setTimeout(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 50);
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
      <div className="film-grain" aria-hidden="true" />
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
          transition: prefersReducedMotion
            ? "none"
            : isVisible
              ? "opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out)"
              : "opacity 0.12s var(--ease-out), transform 0.12s var(--ease-out)",
          transform: prefersReducedMotion
            ? "none"
            : isVisible
              ? "translateY(0)"
              : "translateY(2px)",
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
