export const dynamic = 'force-static';
export const revalidate = false;

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://calculator.net',
      lastModified: new Date(),
    },
  ];
} 