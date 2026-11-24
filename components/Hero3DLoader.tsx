'use client';
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

// O código da cena 3D (Three.js) é pesado. Começa a baixar assim que este arquivo carrega, sem
// esperar a página terminar de iniciar, e a cena só é montada depois, quando já está no cache.
const loadScene = () => import('./Hero3D');
const Hero3D = dynamic(loadScene, { ssr: false });
if (typeof window !== 'undefined') void loadScene();

// Se o navegador não conseguir criar o contexto WebGL, o site segue só com o escudo estático.
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
      {/* Aparece junto com o HTML. Fica no lugar da cena enquanto ela carrega, e para quem não tem 3D. */}
      <div className="hero-poster">
        <img src="/logo.svg" alt="" width={260} height={293} fetchPriority="high" />
      </div>
      {enabled && (
        <Safe>
          <Hero3D active={visible} onReady={() => setReady(true)} />
        </Safe>
      )}
    </div>
  );
}
