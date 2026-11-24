'use client';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const D = 24; // duração total do filme, em segundos

const CHAPTERS = [
  { at: 0, label: 'O pedido chega', caption: 'O pedido aguarda autorização no sistema ERP.' },
  { at: 5, label: 'O aviso', caption: 'O AproveTech avisa o aprovador no celular.' },
  { at: 9, label: 'A conferência', caption: 'Valor, fornecedor e obra na tela, e a confirmação com biometria.' },
  { at: 15, label: 'A decisão', caption: 'A decisão volta ao sistema ERP e fica registrada no histórico.' },
  { at: 20, label: 'Fim', caption: 'Menos espera. Mais obra.' },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, '0')}`;

function chapterOf(t: number) {
  let idx = 0;
  CHAPTERS.forEach((c, i) => {
    if (t >= c.at) idx = i;
  });
  return idx;
}

function Packet({ p, dir }: { p: number; dir: 'to' | 'back' }) {
  if (p <= 0 || p >= 1) return null;
  const left = dir === 'to' ? p * 100 : (1 - p) * 100;
  return (
    <span className={`packet ${dir}`} style={{ left: `${left}%` }}>
      <i />
    </span>
  );
}

function Stage({ t }: { t: number }) {
  const rowIn = seg(t, 0.8, 1.6);
  const authorized = t >= 17.6;
  const toPhone = seg(t, 5.2, 7);
  const back = seg(t, 15.6, 17.4);
  const phone = t < 7 ? 'idle' : t < 9 ? 'notify' : t < 12 ? 'detail' : t < 15 ? 'bio' : 'ok';
  const ended = t >= 20;

  return (
    <div className="film-stage">
      <div className="film-erp">
        <div className="erp-bar">
          <i />
          <i />
          <i />
          <span>Sistema ERP · Suprimentos · Autorização de pedidos</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fornecedor</th>
              <th>Valor</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>4819</td>
              <td>Ferro Norte</td>
              <td>R$ 21.300,00</td>
              <td>
                <em className="st ok">Autorizado</em>
              </td>
            </tr>
            <tr>
              <td>4820</td>
              <td>Esquadrias Sul</td>
              <td>R$ 9.870,00</td>
              <td>
                <em className="st ok">Autorizado</em>
              </td>
            </tr>
            <tr
              className={`new${authorized ? ' done' : ''}`}
              style={{ opacity: rowIn, transform: `translateY(${(1 - rowIn) * 14}px)` }}
            >
              <td>4821</td>
              <td>Concreto Aurora</td>
              <td>R$ 38.420,00</td>
              <td>
                <em className={`st ${authorized ? 'ok' : 'wait'}`}>
                  {authorized ? 'Autorizado' : 'Aguardando'}
                </em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="film-link" aria-hidden="true">
        <span className="line" />
        <Packet p={toPhone} dir="to" />
        <Packet p={back} dir="back" />
      </div>

      <div className="film-phone" aria-hidden="true">
        <div className="fp-notch" />
        <AnimatePresence mode="wait">
          <motion.div
            key={phone}
            className="fp-screen"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {phone === 'idle' && (
              <div className="fp-idle">
                <img src="/logo.svg" alt="" width={34} height={38} />
                <small>Nenhuma pendência nova</small>
              </div>
            )}
            {phone === 'notify' && (
              <div className="fp-notify">
                <strong>09:41</strong>
                <div className="fp-card">
                  <small>AproveTech · agora</small>
                  <b>Pedido 4821 aguarda sua decisão</b>
                  <span>R$ 38.420,00</span>
                </div>
              </div>
            )}
            {phone === 'detail' && (
              <div className="fp-detail">
                <small>PEDIDO · 4821</small>
                <strong>R$ 38.420,00</strong>
                <p>Concreto Usinado Aurora</p>
                <p>Residencial Aurora</p>
                <span className="fp-btn">Aprovar</span>
              </div>
            )}
            {phone === 'bio' && (
              <div className="fp-bio">
                <small>REVISE SUA DECISÃO</small>
                <b>Aprovar pedido 4821?</b>
                <span className="fp-ring" />
                <small>Confirme com a biometria</small>
              </div>
            )}
            {phone === 'ok' && (
              <div className="fp-ok">
                <span className="fp-check">
                  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <b>Aprovado</b>
                <small>Marina Costa · 09:42</small>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {ended && (
          <motion.div
            className="film-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo.svg" alt="" width={56} height={63} />
            <strong>
              Menos espera. <span className="accent">Mais obra.</span>
            </strong>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Film() {
  const wrap = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const started = useRef(false);
  const last = useRef(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting && !started.current) {
          started.current = true;
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(true);
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    let raf = 0;
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setT((prev) => {
        const next = prev + dt;
        return next >= D ? 0 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible]);

  const ch = chapterOf(t);

  return (
    <section className="section film-section" id="filme">
      <div className="wrap">
        <div className="section-head center">
          <p className="eyebrow">Veja em 24 segundos</p>
          <h2>Do pedido parado à decisão registrada.</h2>
          <p className="section-sub">Animação do fluxo completo, com dados fictícios para fins de ilustração.</p>
        </div>

        <div className="film" ref={wrap}>
          <Stage t={t} />

          <div className="film-caption" aria-live="off">
            <AnimatePresence mode="wait">
              <motion.p
                key={ch}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <b>{ch + 1}.</b> {CHAPTERS[ch].caption}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="film-controls">
            <button
              type="button"
              className="play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pausar animação' : 'Reproduzir animação'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              )}
            </button>
            <input
              className="scrub"
              type="range"
              min={0}
              max={D}
              step={0.1}
              value={t}
              style={{ ['--p' as string]: `${(t / D) * 100}%` }}
              onChange={(e) => {
                setT(Number(e.target.value));
                setPlaying(false);
              }}
              aria-label="Linha do tempo da animação"
            />
            <span className="time">
              {fmt(t)} / {fmt(D)}
            </span>
          </div>

          <ul className="chapters">
            {CHAPTERS.slice(0, 4).map((c, i) => (
              <li key={c.label}>
                <button
                  type="button"
                  className={i === ch ? 'on' : ''}
                  onClick={() => {
                    setT(c.at + 0.01);
                    setPlaying(true);
                  }}
                >
                  <span>{i + 1}</span>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
