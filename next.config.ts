import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    domains: ['calculator.net'],
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/allcalc' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/allcalc' : '',
};

export default nextConfig;
