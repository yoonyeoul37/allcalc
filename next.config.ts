import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  basePath: isDev ? undefined : '/allcalc',
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  images: {
    domains: ['calculator.net'],
    unoptimized: true,
  },
  // 배포 환경에서만 headers와 redirects 사용
  ...(isDev ? {} : {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
    async redirects() {
      return [
        {
          source: '/calculator',
          destination: '/',
          permanent: true,
        },
      ];
    },
  }),
};

export default nextConfig;
