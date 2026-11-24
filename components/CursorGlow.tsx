'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

// Brilho laranja que acompanha o mouse. Só aparece com mouse de verdade, nunca no toque.
export function CursorGlow() {
  const [on, setOn] = useState(false);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 140, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 22, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || calm) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  if (!on) return null;
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />;
}
