import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION } from './content';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AproveTech',
    short_name: 'AproveTech',
    description: SITE_DESCRIPTION,
    lang: 'pt-BR',
    start_url: '/',
    display: 'browser',
    background_color: '#17171b',
    theme_color: '#1e1e22',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
