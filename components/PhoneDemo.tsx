'use client';
import { useEffect, useRef, useState } from 'react';
import { demoDocs, type DemoDoc } from '../app/content';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = (cents: number) => brl.format(cents / 100);

type Phase = 'idle' | 'sending' | 'done' | 'leaving';

// Arquivo fictício de cada tipo de documento, para a demonstração dos anexos.
const attachmentName: Record<string, string> = {
  Pedido: 'Proposta do fornecedor.pdf',
  Medição: 'Boletim de medição.pdf',
  Contrato: 'Minuta do contrato.pdf',
};

// Demonstração do aplicativo com dados fictícios: nada aqui fala com o sistema ERP.
export function PhoneDemo() {
  const [pending, setPending] = useState<DemoDoc[]>(demoDocs);
  const [selected, setSelected] = useState<DemoDoc | null>(null);
  const [active, setActive] = useState<{ id: number; phase: Phase } | null>(null);
  const timers = useRef<number[]>([]);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<DemoDoc | null>(null);
  const [view, setView] = useState<'list' | 'open' | 'download'>('list');
  const closeFilesRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (selected) confirmRef.current?.focus({ preventScroll: true });
  }, [selected]);

  useEffect(() => {
    if (files) closeFilesRef.current?.focus({ preventScroll: true });
  }, [files]);

  useEffect(() => {
    if (!selected && !files) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setSelected(null);
      setFiles(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected, files]);

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
            <small>Valor aguardando autorização</small>
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
                  <div className="doc-actions">
                    <button
                      type="button"
                      className="mini mini-ghost"
                      disabled={phase !== 'idle'}
                      onClick={() => {
                        setSelected(null);
                        setView('list');
                        setFiles(d);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m21 11-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l9-9a3.7 3.7 0 0 1 5.2 5.2l-9 9a1.8 1.8 0 0 1-2.6-2.6L15.5 6" />
                      </svg>
                      Anexo
                    </button>
                    <button
                      type="button"
                      className="mini"
                      disabled={phase !== 'idle' || active !== null}
                      onClick={() => {
                        setFiles(null);
                        setSelected(d);
                      }}
                    >
                      {phase === 'sending'
                        ? 'Enviando…'
                        : phase === 'idle'
                          ? 'Aprovar'
                          : 'Aprovado ✓'}
                    </button>
                  </div>
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
          {files && (
            <div className="sheet" role="dialog" aria-labelledby="files-title">
              <small className="sheet-eyebrow">ANEXOS</small>
              <h3 id="files-title">
                {files.type} {files.num}
              </h3>
              <div className="att">
                <b>{attachmentName[files.type]}</b>
                <small>{files.supplier}</small>
              </div>
              {view === 'open' && (
                <div className="att-page" role="img" aria-label="Prévia de exemplo do anexo">
                  <i />
                  <i />
                  <i />
                  <i />
                  <span>Exemplo fictício</span>
                </div>
              )}
              {view === 'download' && (
                <p className="att-note" role="status">
                  No aplicativo, o arquivo é salvo no celular. Aqui nada é baixado.
                </p>
              )}
              <div className="att-actions">
                <button type="button" className="mini mini-ghost" onClick={() => setView('open')}>
                  Abrir
                </button>
                <button type="button" className="mini" onClick={() => setView('download')}>
                  Baixar
                </button>
              </div>
              <button
                type="button"
                className="link-btn"
                ref={closeFilesRef}
                onClick={() => setFiles(null)}
              >
                Fechar
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
        Toque em <strong>Anexo</strong> ou <strong>Aprovar</strong> e experimente. Dados fictícios.
      </p>
    </div>
  );
}
