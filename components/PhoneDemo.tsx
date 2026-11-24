'use client';
import { useEffect, useRef, useState } from 'react';
import { demoDocs, type DemoDoc } from '../app/content';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = (cents: number) => brl.format(cents / 100);

type Phase = 'idle' | 'sending' | 'done' | 'leaving';

// Demonstração do aplicativo com dados fictícios: nada aqui fala com o sistema ERP.
export function PhoneDemo() {
  const [pending, setPending] = useState<DemoDoc[]>(demoDocs);
  const [selected, setSelected] = useState<DemoDoc | null>(null);
  const [active, setActive] = useState<{ id: number; phase: Phase } | null>(null);
  const timers = useRef<number[]>([]);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (selected) confirmRef.current?.focus({ preventScroll: true });
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  function confirm() {
    if (!selected || active) return;
    const doc = selected;
    setSelected(null);
    setActive({ id: doc.id, phase: 'sending' });
    later(() => setActive({ id: doc.id, phase: 'done' }), 900);
    later(() => setActive({ id: doc.id, phase: 'leaving' }), 1600);
    later(() => {
      setPending((list) => list.filter((d) => d.id !== doc.id));
      setActive(null);
    }, 2000);
  }

  const total = pending.reduce((sum, d) => sum + d.cents, 0);

  return (
    <div className="hero-demo">
      <div className="phone" role="group" aria-label="Demonstração interativa do aplicativo">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">
          <div className="app-head">
            <img src="/logo.svg" alt="" width={24} height={27} />
            <div>
              <strong>Suas aprovações</strong>
              <small>Vértice Engenharia</small>
            </div>
          </div>
          <div className="app-total">
            <small>Valor aguardando decisão</small>
            <strong>{money(total)}</strong>
            <span>{pending.length === 1 ? '1 documento' : `${pending.length} documentos`}</span>
          </div>
          <ul className="app-list" aria-live="polite">
            {pending.map((d) => {
              const phase = active?.id === d.id ? active.phase : 'idle';
              return (
                <li key={d.id} className={`doc${phase === 'leaving' ? ' out' : ''}`}>
                  <div className="doc-top">
                    <span>
                      {d.type} · {d.num}
                    </span>
                    {phase === 'sending' ? (
                      <span className="badge sending">Enviando</span>
                    ) : phase === 'done' || phase === 'leaving' ? (
                      <span className="badge done">Aprovado</span>
                    ) : d.urgent ? (
                      <span className="badge">Prioridade alta</span>
                    ) : null}
                  </div>
                  <div className="doc-main">
                    <div>
                      <b>{d.supplier}</b>
                      <small>{d.site}</small>
                    </div>
                    <span className="doc-value">{money(d.cents)}</span>
                  </div>
                  <button
                    type="button"
                    className="mini"
                    disabled={phase !== 'idle' || active !== null}
                    onClick={() => setSelected(d)}
                  >
                    {phase === 'sending'
                      ? 'Enviando…'
                      : phase === 'idle'
                        ? 'Aprovar'
                        : 'Aprovado ✓'}
                  </button>
                </li>
              );
            })}
          </ul>
          {pending.length === 0 && (
            <div className="app-empty">
              <span className="app-empty-mark" aria-hidden="true" />
              <p>Tudo em dia. Nenhuma pendência na sua alçada.</p>
              <button type="button" className="link-btn" onClick={() => setPending(demoDocs)}>
                Recomeçar demonstração
              </button>
            </div>
          )}
          {selected && (
            <div className="sheet" role="dialog" aria-labelledby="sheet-title">
              <small className="sheet-eyebrow">REVISE SUA DECISÃO</small>
              <h3 id="sheet-title">
                Aprovar {selected.type.toLowerCase()} {selected.num}?
              </h3>
              <dl>
                <div>
                  <dt>Fornecedor</dt>
                  <dd>{selected.supplier}</dd>
                </div>
                <div>
                  <dt>Obra</dt>
                  <dd>{selected.site}</dd>
                </div>
                <div>
                  <dt>Valor</dt>
                  <dd>{money(selected.cents)}</dd>
                </div>
              </dl>
              <div className="sheet-actions">
                <button type="button" className="mini mini-ghost" onClick={() => setSelected(null)}>
                  Voltar
                </button>
                <button type="button" className="mini" ref={confirmRef} onClick={confirm}>
                  Confirmar aprovação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="demo-note">
        Toque em <strong>Aprovar</strong> e experimente. Dados fictícios.
      </p>
    </div>
  );
}
