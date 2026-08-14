import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Aggressive image optimization. AVIF gives ~50% smaller files than JPEG
  // for the photography-heavy gallery; WebP is kept as a fallback for the
  // small slice of clients that still don't support AVIF.
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 828, 1080, 1280, 1920, 2560],
    imageSizes: [64, 96, 128, 256, 384],
    // Every custom `quality` used across the app must be declared here or
    // Next.js logs a warning (and will error in a future major). Gallery
    // photos all render at 85 so the thumbnail, the fullscreen zoom and the
    // collection viewer share one cache entry per size.
    qualities: [60, 70, 75, 80, 85],
  },
  // Strip console.* in production builds (except errors/warnings) to keep
  // the client bundle small.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
};

export default nextConfig;
