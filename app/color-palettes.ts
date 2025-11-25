/**
 * COLOR PALETTE SELECTION
 *
 * To switch between color palettes, change the activePalette export at the bottom:
 * - palette1: Modern Dark Minimal (Deep Blue & Warm Gray) - Currently Active
 * - palette2: Warm Minimal (Cream & Sage)
 * - palette3: Cool Minimal (Slate & Cyan)
 * - palette4: Earthy Minimal (Beige & Terracotta)
 *
 * Example: Change `colorPalettes.palette1` to `colorPalettes.palette2` to switch themes
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

  // Palette 2: Warm Minimal (Cream & Sage)
  palette2: {
    name: "Warm Minimal",
    background: "#faf9f6",
    surface: "#ffffff",
    primary: "#10b981", // Emerald
    secondary: "#84cc16", // Lime
    accent: "#f59e0b", // Amber
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
  },

  // Palette 3: Cool Minimal (Slate & Cyan)
  palette3: {
    name: "Cool Minimal",
    background: "#0f172a",
    surface: "#1e293b",
    primary: "#06b6d4", // Cyan
    secondary: "#3b82f6", // Blue
    accent: "#8b5cf6", // Purple
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    border: "#334155",
  },

  // Palette 4: Earthy Minimal (Beige & Terracotta)
  palette4: {
    name: "Earthy Minimal",
    background: "#fefbf7",
    surface: "#ffffff",
    primary: "#d97706", // Amber
    secondary: "#dc2626", // Red
    accent: "#ea580c", // Orange
    text: "#292524",
    textSecondary: "#78716c",
    border: "#d6d3d1",
  },
};

// Set the active palette here (palette1, palette2, palette3, or palette4)
export const activePalette = colorPalettes.palette1;
