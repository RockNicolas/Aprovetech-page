'use client';
import { useEffect } from 'react';

// Um único observador para a página toda: cada elemento com data-in ganha a classe .is-in quando
// entra na tela, uma vez só. Quem prefere menos movimento vê tudo de imediato.
//
// Os títulos (data-in="line") ficam recortados por clip-path até aparecerem, e um elemento
// totalmente recortado pode nunca contar como visível para o observador. Por isso, para eles
// observamos o elemento pai e acendemos o título quando o pai entra na tela.
export function InView() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-in]'));
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const watched = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const target = el.dataset.in === 'line' && el.parentElement ? el.parentElement : el;
      watched.set(target, [...(watched.get(target) ?? []), el]);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          watched.get(e.target)?.forEach((el) => el.classList.add('is-in'));
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    watched.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, []);
  return null;
}
