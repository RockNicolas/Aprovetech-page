import { ImageResponse } from 'next/og';

// Imagem que aparece quando o link é compartilhado no WhatsApp, LinkedIn, Instagram, Google etc.
export const alt = 'AproveTech: aprovações do seu ERP no celular';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#17171b',
          color: '#f6f5f2',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="56" height="64" viewBox="130 20 140 170">
            <path d="M200 30L262 52V108C262 144 236 166 200 180C164 166 138 144 138 108V52Z" fill="#2A2A30" />
            <path d="M172 104L192 124L229 78" fill="none" stroke="#FF7A3D" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            Aprove<span style={{ color: '#ff8c51', fontWeight: 400 }}>Tech</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -4 }}>
          <div style={{ display: 'flex' }}>Aprovações da</div>
          <div style={{ display: 'flex' }}>plataforma ERP,</div>
          <div style={{ display: 'flex', color: '#ff8c51' }}>NO SEU CELULAR!</div>
        </div>

        <div style={{ display: 'flex', fontSize: 30, color: '#b1b0b7' }}>
          Pedidos, solicitações, cotações, contratos e medições do seu ERP no celular.
        </div>
      </div>
    ),
    { ...size },
  );
}
