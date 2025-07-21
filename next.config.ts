import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    domains: ['calculator.net'],
    unoptimized: true,
  },
};

export default nextConfig;
