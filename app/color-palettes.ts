/**
 * COLOR PALETTE SELECTION
 *
 * To switch between color palettes, change the activePalette export at the bottom:
 * - palette1: Modern Dark Minimal (Deep Blue & Warm Gray)
 * - palette2: Warm Minimal (Cream & Sage)
 * - palette3: Cool Minimal (Slate & Cyan)
 * - palette4: Earthy Minimal (Beige & Terracotta)
 * - mochaMousse: Mocha Mousse (Rich Browns & Cream)
 *
 * Example: Change `colorPalettes.palette1` to `colorPalettes.mochaMousse` to switch themes
 */

export const colorPalettes = {
  // Palette 1: Modern Dark Minimal (Deep Blue & Warm Gray)
  palette1: {
    name: "Modern Dark Minimal",
    background: "#0a0a0f",
    surface: "#141420",
    primary: "#6366f1", // Indigo
    secondary: "#8b5cf6", // Purple
    accent: "#ec4899", // Pink
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    border: "#1e293b",
  },

  // Mocha Mousse: Rich Browns & Cream
  mochaMousse: {
    name: "Mocha Mousse",
    background: "#3c2414", // Deep mocha brown
    surface: "#4a2c1a", // Rich brown
    primary: "#d4a574", // Mocha cream
    secondary: "#b8865b", // Caramel
    accent: "#e6c99f", // Light mousse
    text: "#f5e6d3", // Cream text
    textSecondary: "#c9a882", // Muted cream
    border: "#5a3a28", // Darker brown border
  },
};

// Get active palette based on theme
// Default: mochaMousse (light), palette1 (dark)
export function getActivePalette(theme: "light" | "dark" = "light") {
  return theme === "dark" ? colorPalettes.palette1 : colorPalettes.mochaMousse;
}

// Default export for backward compatibility (will be overridden by ThemeProvider)
export const activePalette = colorPalettes.mochaMousse;
