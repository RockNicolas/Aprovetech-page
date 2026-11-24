import type { MetadataRoute } from 'next';
import { SITE_URL } from './content';

// O site tem uma página só. Se criar outras, acrescente aqui.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
