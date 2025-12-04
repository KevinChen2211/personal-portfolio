import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Recommended for catching issues early
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
