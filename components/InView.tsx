'use client';
import { useEffect } from 'react';

// Um único observador para a página toda: cada elemento com data-in ganha a classe .is-in quando
// entra na tela, uma vez só. Quem prefere menos movimento vê tudo de imediato.
export function InView() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-in]'));
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
