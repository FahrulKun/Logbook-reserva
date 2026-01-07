import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for development mode
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Handle images and assets
  images: {
    domains: ['orea-85.com'],
    unoptimized: true,
  },
};

export default nextConfig;