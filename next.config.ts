import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

const nextConfig: NextConfig = {
  /* config options here */
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  // GitHub Pages 배포를 위해 basePath와 assetPrefix 설정
  basePath: isDev ? undefined : '/allcalc',
  assetPrefix: isDev ? undefined : '/allcalc/',
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    domains: ['calculator.net'],
    unoptimized: true,
  },
};

export default nextConfig;
