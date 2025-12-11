"use client";

import { useTheme } from "./ThemeProvider";
import { getActivePalette } from "../color-palettes";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const palette = getActivePalette(theme);

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation"
      style={{
        backgroundColor: palette.surface,
        border: `2px solid ${palette.border}`,
        color: palette.text,
        boxShadow: `0 4px 12px ${palette.primary}20`,
        minWidth: "44px",
        minHeight: "44px",
      }}
      aria-label="Toggle theme"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {theme === "light" ? (
          // Moon icon for dark mode
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        ) : (
          // Sun icon for light mode
          <>
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </>
        )}
      </svg>
    </button>
  );
}

