import type { NextConfig } from 'next';

// Site público e estático: nenhum outro site pode exibi-lo dentro de um frame e o que ele carrega
// fica restrito ao próprio domínio. A política completa só é reportada por enquanto; o script de
// tema e a hidratação do Next usam código inline.
const security = [
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'",
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
];

const config: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: security }];
  },
};

export default config;
