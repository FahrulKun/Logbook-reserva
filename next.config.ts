import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel-optimized configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Handle images and assets for Vercel
  images: {
    domains: ['i.ibb.co', 'orea-85.com'],
    unoptimized: false,
  },
  // Output configuration
  output: undefined, // Let Vercel handle the build output
  // Remove trailing slash for better SEO
  trailingSlash: false,
};

export default nextConfig;