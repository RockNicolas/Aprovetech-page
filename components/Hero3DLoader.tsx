'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

// Sem { ssr: false } de propósito: assim o Next coloca o código da cena 3D (Three.js, a parte mais
// pesada do site) na lista de arquivos pré-carregados do próprio HTML, e o navegador o baixa em
// paralelo com o resto da página, em vez de só começar depois que ela inicia. No servidor o
// componente não desenha nada (enabled é falso até a página abrir no navegador).
const Hero3D = dynamic(() => import('./Hero3D'));

// Se o navegador não conseguir criar o contexto WebGL, o site segue sem a cena 3D.
class Safe extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function Hero3DLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const weak = (navigator.hardwareConcurrency ?? 4) <= 2;
    setEnabled(!calm && !weak);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`hero-3d${ready ? ' is-ready' : ''}`} ref={ref} aria-hidden="true">
      <Safe>
        <Hero3D enabled={enabled} active={visible} onReady={() => setReady(true)} />
      </Safe>
    </div>
  );
}
