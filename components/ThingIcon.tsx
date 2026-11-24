// Ícones de linha numa cor só (os ícones 3D coloridos de public/3d não são mais usados).
const GLYPHS: Record<string, string> = {
  pedido: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6',
  solicitacao: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  cotacao: 'M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01',
  contrato: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5',
  medicao: 'M3 15 15 3l6 6L9 21zM7 11l2 2M10 8l2 2M13 5l2 2',
  escudo: 'M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-3zM8.5 12l2.5 2.5L16 9.5',
  sino: 'M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0',
  sinal: 'M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01',
  lote: 'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5',
  cadeado: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  celular: 'M7 3h10v18H7zM11 18h2',
  aprovado: 'M5 12.5l4.5 4.5L19 7.5',
  dinheiro: 'M12 8v8M9.5 10a2.5 2 0 0 1 5 0c0 2.5-5 1.5-5 4a2.5 2 0 0 0 5 0M4 12a8 8 0 1 0 16 0 8 8 0 1 0-16 0',
};

type Props = { name: string; size?: number; className?: string; bare?: boolean };

// Com bare, só o traço, sem a moldura quadrada em volta.
export function ThingIcon({ name, size = 44, className = '', bare = false }: Props) {
  const glyph = bare ? size : Math.round(size * 0.5);
  return (
    <span
      className={`thing${bare ? ' bare' : ''} ${className}`.trim()}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={glyph}
        height={glyph}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={GLYPHS[name] ?? GLYPHS.escudo} />
      </svg>
    </span>
  );
}
