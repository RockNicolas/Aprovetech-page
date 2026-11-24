'use client';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Magnetic } from './Magnetic';

export function Nav({ links, contactHref }: { links: { href: string; label: string }[]; contactHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`} id="topo">
      <div className="wrap nav-inner">
        <a className="brand" href="#topo" aria-label="AproveTech, início">
          <img src="/logo.svg" alt="" width={34} height={38} />
          <span>
            Aprove<span className="brand-light">Tech</span>
          </span>
        </a>
        <nav className="nav-links" aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <Magnetic strength={0.2}>
            <a className="btn btn-sm" href={contactHref}>
              <span className="lbl-long">Pedir demonstração</span>
              <span className="lbl-short">Demonstração</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
