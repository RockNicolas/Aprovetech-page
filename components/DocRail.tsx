'use client';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const PANELS = [
  {
    key: 'pedido',
    n: '01',
    title: 'Pedidos de compra',
    text: 'Fornecedor, itens e valor, com as condições de pagamento e de entrega na mesma tela.',
    chips: ['Fornecedor', 'Itens', 'Pagamento', 'Entrega'],
    tone: '#ff7a3d',
  },
  {
    key: 'solicitacao',
    n: '02',
    title: 'Solicitações',
    text: 'Quem pediu, para qual obra e o que está sendo pedido, antes de virar compra.',
    chips: ['Solicitante', 'Obra', 'Itens pedidos'],
    tone: '#f2c979',
  },
  {
    key: 'cotacao',
    n: '03',
    title: 'Cotações',
    text: 'O comparativo entre fornecedores para decidir sem abrir planilha.',
    chips: ['Comparativo', 'Fornecedores', 'Valores'],
    tone: '#7edbb6',
  },
  {
    key: 'contrato',
    n: '04',
    title: 'Contratos',
    text: 'Escopo e saldos do contrato à vista na hora de autorizar.',
    chips: ['Escopo', 'Saldos', 'Fornecedor'],
    tone: '#9db4ff',
  },
  {
    key: 'medicao',
    n: '05',
    title: 'Medições',
    text: 'A execução medida e a composição financeira, para liberar o pagamento certo.',
    chips: ['Execução', 'Composição financeira', 'Obra'],
    tone: '#ff9aa7',
  },
];

// Ao rolar para baixo, a faixa anda para o lado. A velocidade da rolagem entorta os cartões um
// pouco, como se a página fosse puxada.
export function DocRail({ icons }: { icons: Record<string, React.ReactNode> }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(raw, { stiffness: 200, damping: 34, mass: 0.4 });

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skewRaw = useTransform(velocity, [-2500, 0, 2500], [7, 0, -7]);
  const skewX = useSpring(skewRaw, { stiffness: 260, damping: 30 });
  const bar = useSpring(scrollYProgress, { stiffness: 200, damping: 34 });

  return (
    <section className="rail" id="documentos" ref={ref} style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="rail-sticky">
        <motion.div className="rail-track" ref={track} style={{ x }}>
          <div className="rail-intro">
            <p className="eyebrow">TUDO NUM LUGAR SÓ</p>
            <h2>
              Cinco documentos.
              <br />
              <span className="accent">Um só aplicativo.</span>
            </h2>
            <p className="section-sub">Cada tipo de documento mostra o que importa para a decisão. Continue rolando.</p>
            <span className="rail-hint" aria-hidden="true">
              <i />
            </span>
          </div>

          {PANELS.map((pn) => (
            <motion.article
              key={pn.key}
              className="rail-card"
              style={{ skewX, ['--tone' as string]: pn.tone }}
            >
              <span className="rail-n">{pn.n}</span>
              <div className="rail-icon">{icons[pn.key]}</div>
              <h3>{pn.title}</h3>
              <p>{pn.text}</p>
              <ul>
                {pn.chips.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </motion.article>
          ))}

          <div className="rail-end">
            <strong>
              E tudo com a mesma
              <br />
              confirmação segura.
            </strong>
          </div>
        </motion.div>
        <div className="rail-bar" aria-hidden="true">
          <motion.i style={{ scaleX: bar }} />
        </div>
      </div>
    </section>
  );
}
