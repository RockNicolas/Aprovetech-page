import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './styles.css';
import { DemoModal } from '../components/DemoModal';
import { InView } from '../components/InView';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './content';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: 'AproveTech',
  keywords: [
    'aprovação de pedidos de compra',
    'aprovar pelo celular',
    'aprovação ERP',
    'alçadas de aprovação',
    'aprovação de medições',
    'aprovação de contratos',
    'construção civil',
    'Sienge',
  ],
  authors: [
    { name: 'Rock Software Solutions', url: 'https://rock-software-solutions.vercel.app/' },
    { name: 'NID Consultoria', url: 'https://www.nidconsultoria.com.br/' },
  ],
  creator: 'Rock Software Solutions',
  publisher: 'Rock Software Solutions e NID Consultoria',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  // Código de verificação do Google Search Console (opcional). Veja o README.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: 'AproveTech · Aprovações da plataforma ERP, NO SEU CELULAR!',
    description: 'Aprovações do seu sistema ERP no celular: menos espera, mais obra.',
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'AproveTech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AproveTech · Aprovações da plataforma ERP,  NO SEU CELULAR!',
    description: 'Aprovações do seu sistema ERP no celular: menos espera, mais obra.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e1e22',
};

// Roda antes da primeira pintura: as animações de entrada só valem quando há JavaScript.
const jsScript = `document.documentElement.classList.add('js')`;

// Dados estruturados (schema.org): ajudam o Google a entender o que é o produto e quem o faz.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AproveTech',
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  inLanguage: 'pt-BR',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'iOS, Android, Web',
  creator: [
    {
      '@type': 'Organization',
      name: 'Rock Software Solutions',
      url: 'https://rock-software-solutions.vercel.app/',
      sameAs: ['https://www.instagram.com/rocksoftware.dev/'],
    },
    {
      '@type': 'Organization',
      name: 'NID Consultoria',
      url: 'https://www.nidconsultoria.com.br/',
      sameAs: ['https://www.instagram.com/nidconsultoria/'],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={inter.variable}>
        {children}
        <InView />
        <DemoModal />
      </body>
    </html>
  );
}
