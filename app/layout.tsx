import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './styles.css';
import { InView } from '../components/InView';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'AproveTech · Aprovações do seu ERP no celular',
  description:
    'Aprove pedidos, solicitações, cotações, contratos e medições do seu sistema ERP pelo celular, com confirmação segura, alçadas respeitadas e histórico de cada decisão.',
  applicationName: 'AproveTech',
  openGraph: {
    title: 'AproveTech · Decisões em movimento',
    description: 'Aprovações do seu sistema ERP no celular: menos espera, mais obra.',
    type: 'website',
    locale: 'pt_BR',
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

// Roda antes da primeira pintura para o tema salvo não piscar.
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');var t='dark';try{var s=localStorage.getItem('aprovetech-theme');if(s==='light'||s==='dark')t=s;else if(window.matchMedia('(prefers-color-scheme: light)').matches)t='light'}catch(e){}r.setAttribute('data-theme',t)})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.variable}>
        {children}
        <InView />
      </body>
    </html>
  );
}
