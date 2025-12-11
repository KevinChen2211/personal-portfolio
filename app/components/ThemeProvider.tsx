"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getActivePalette } from "../color-palettes";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme - always start with "light" to match server render
  // Then update on client side to prevent hydration mismatch
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read theme from localStorage or system preference after mount
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme) {
        setTheme(savedTheme);
        return;
      }
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    } catch {
      // Fallback to light if there's an error
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Update body background color when theme changes
    const palette = getActivePalette(theme);
    document.body.style.backgroundColor = palette.background;
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", newTheme);
      } catch {}
      return newTheme;
    });
  };

  // Always provide context value
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

