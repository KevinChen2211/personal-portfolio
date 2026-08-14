"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(pointer: fine)";

export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    getPrefersReducedMotion,
    () => false,
  );
}

// Mouse, trackpad or stylus rather than touch. Use it to gate pointer-tracking
// work (listeners, animation loops); prefer a `(pointer: coarse)` media query
// for anything purely visual, since that applies before first paint and this
// hook only resolves after hydration.
export function useHasFinePointer(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(FINE_POINTER_QUERY).matches,
    () => false,
  );
}
