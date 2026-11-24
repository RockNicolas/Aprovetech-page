'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

/*
  A cena 3D (Three.js, cerca de 1 MB) só é baixada e montada em computador com mouse e tela larga.
  Celular e tablet recebem a imagem /hero-scene.webp (41 KB), renderizada a partir da própria cena:
  carrega na hora, não trava e não gasta bateria. Quem prefere menos movimento, ou tem pouco
  processamento, também fica com a imagem. A escolha entre imagem e 3D é feita em CSS (.hero-art),
  então a imagem aparece junto com o HTML, sem esperar JavaScript.
*/
export const DESKTOP_3D = '(min-width: 1041px) and (hover: hover) and (pointer: fine)';

const allow3d = () =>
  window.matchMedia(DESKTOP_3D).matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  (navigator.hardwareConcurrency ?? 4) > 2;

const loadScene = () => import('./Hero3D');
const Hero3D = dynamic(loadScene, { ssr: false });
// Começa a baixar o código da cena assim que este arquivo carrega, sem esperar a página iniciar.
if (typeof window !== 'undefined' && allow3d()) void loadScene();

// Se o navegador não conseguir criar o contexto WebGL, o site segue com a imagem.
class Safe extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero3DLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'wait' | '3d' | 'image'>('wait');
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(allow3d() ? '3d' : 'image');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ['hero-3d', mode === 'image' && 'no-3d', ready && 'is-ready'].filter(Boolean).join(' ');

  return (
    <div className={cls} ref={ref} aria-hidden="true">
      <img className="hero-art" src="/hero-scene.webp" alt="" width={900} height={900} decoding="async" />
      {mode === '3d' && (
        <Safe onFail={() => setMode('image')}>
          <Hero3D active={visible} onReady={() => setReady(true)} />
        </Safe>
      )}
    </div>
  );
}
