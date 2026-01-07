import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export configuration for shared hosting
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Remove standalone for shared hosting compatibility
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
