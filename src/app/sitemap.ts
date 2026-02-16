import { baseUrl, blog } from '@/lib/source';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = blog.getPages().map((page) => ({
    url: `${baseUrl}/${page.slugs[0]}`,
    lastModified: page.data.lastModified
      ? new Date(page.data.lastModified)
      : new Date(page.data.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...posts,
  ];
}
