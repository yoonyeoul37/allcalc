import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/allcalc' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/allcalc' : '',
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    domains: ['calculator.net'],
    unoptimized: true,
  },
  transpilePackages: ['react-icons'],
};

export default nextConfig;
