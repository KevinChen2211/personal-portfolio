import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Recommended for catching issues early
  images: {
    remotePatterns: [],
    qualities: [100, 75],
  },
};

export default nextConfig;
