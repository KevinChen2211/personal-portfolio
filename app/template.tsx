"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import LoadingScreen from "./components/LoadingScreen";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const prevPathnameRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // On initial mount, show loading screen first
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      // Loading screen will handle showing content when ready
      return;
    }

    // Only transition if pathname changed
    if (prevPathnameRef.current !== pathname) {
      // Show loading screen and hide content
      setShowLoading(true);
      setIsVisible(false);
      prevPathnameRef.current = pathname;
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

