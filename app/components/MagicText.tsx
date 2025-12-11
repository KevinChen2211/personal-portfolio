"use client";

import { useEffect, useRef } from "react";
import { getActivePalette } from "../color-palettes";
import { useTheme } from "./ThemeProvider";

interface MagicTextProps {
  children: React.ReactNode;
}

const MagicText = ({ children }: MagicTextProps) => {
  const { theme } = useTheme();
  const palette = getActivePalette(theme);
  const magicRef = useRef<HTMLSpanElement>(null);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!magicRef.current) return;

    let index = 0;
    const interval = 1000;

    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const animate = (star: HTMLElement) => {
      if (!magicRef.current || !star.isConnected) return;
      
      try {
        star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
        star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

        star.style.animation = "none";
        // Force reflow
        void star.offsetHeight;
        star.style.animation = "";
      } catch (error) {
        // Silently handle errors during theme transitions
        console.debug("MagicText animation error:", error);
      }
    };

    const stars = magicRef.current.getElementsByClassName("magic-star");
    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    for (const star of Array.from(stars)) {
      const starElement = star as HTMLElement;
      const timeoutId = setTimeout(() => {
        if (!magicRef.current || !starElement.isConnected) return;
        animate(starElement);
        const intervalId = setInterval(() => {
          if (!magicRef.current || !starElement.isConnected) {
            clearInterval(intervalId);
            return;
          }
          animate(starElement);
        }, 1000);
        intervals.push(intervalId);
      }, index++ * (interval / 3));
      timeouts.push(timeoutId);
    }

    intervalsRef.current = intervals;
    timeoutsRef.current = timeouts;

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
      intervals.forEach((id) => clearInterval(id));
      intervalsRef.current = [];
      timeoutsRef.current = [];
    };
  }, []);

  // Convert hex to rgb and enhance brightness/saturation
  const enhanceColor = (hex: string, brightness: number = 1.2, saturation: number = 1.3) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "103, 58, 183"; // fallback
    
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    
    // Convert to HSL for easier manipulation
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    // Enhance saturation and brightness
    s = Math.min(1, s * saturation);
    l = Math.min(0.95, l * brightness);
    
    // Convert back to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let newR, newG, newB;
    if (s === 0) {
      newR = newG = newB = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      newR = hue2rgb(p, q, h + 1/3);
      newG = hue2rgb(p, q, h);
      newB = hue2rgb(p, q, h - 1/3);
    }
    
    return `${Math.round(newR * 255)}, ${Math.round(newG * 255)}, ${Math.round(newB * 255)}`;
  };

  // Set theme-appropriate enhanced colors
  // Dark theme: More vibrant and saturated
  // Light theme: Brighter and warmer
  const brightness = theme === "dark" ? 1.3 : 1.4;
  const saturation = theme === "dark" ? 1.4 : 1.2;
  
  const color1 = enhanceColor(palette.primary, brightness, saturation);
  const color2 = enhanceColor(palette.secondary, brightness, saturation);
  const color3 = enhanceColor(palette.accent, brightness, saturation);

  // Extract RGB values for text-shadow (use color2 for glow)
  const color2Rgb = color2.split(", ").map(v => parseInt(v));
  
  return (
    <span
      ref={magicRef}
      className="magic"
      style={{
        // Set CSS variables for theme-aware colors
        ["--magic-color-1" as string]: `rgb(${color1})`,
        ["--magic-color-2" as string]: `rgb(${color2})`,
        ["--magic-color-3" as string]: `rgb(${color3})`,
        ["--magic-color-2-rgb" as string]: color2, // For text-shadow
      }}
    >
      <span className="magic-star">
        <svg viewBox="0 0 512 512">
          <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
        </svg>
      </span>
      <span className="magic-star">
        <svg viewBox="0 0 512 512">
          <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
        </svg>
      </span>
      <span className="magic-star">
        <svg viewBox="0 0 512 512">
          <path d="M512 255.1c0 11.34-7.406 20.86-18.44 23.64l-171.3 42.78l-42.78 171.1C276.7 504.6 267.2 512 255.9 512s-20.84-7.406-23.62-18.44l-42.66-171.2L18.47 279.6C7.406 276.8 0 267.3 0 255.1c0-11.34 7.406-20.83 18.44-23.61l171.2-42.78l42.78-171.1C235.2 7.406 244.7 0 256 0s20.84 7.406 23.62 18.44l42.78 171.2l171.2 42.78C504.6 235.2 512 244.6 512 255.1z" />
        </svg>
      </span>
      <span className="magic-text">{children}</span>
    </span>
  );
};

export default MagicText;

