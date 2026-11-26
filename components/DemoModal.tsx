'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CONTACT_EMAILS, CONTACT_TO } from '../app/content';

// Qualquer link com data-demo abre esta janela. Sem JavaScript, o link segue como mailto normal.
// O envio é feito por /api/demonstracao. Se falhar, a janela oferece o programa de e-mail do
// visitante com a mensagem pronta, para o pedido não se perder.

// (85) 91234-5678
function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function DemoModal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'form' | 'sending' | 'sent' | 'failed'>('form');
  const [fallback, setFallback] = useState('');

  useEffect(() => {
    const open = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-demo]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      setStatus((s) => (s === 'sending' ? s : 'form'));
      ref.current?.showModal();
    };
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, []);

  const close = () => ref.current?.close();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    const lines = [
      'Olá! Quero uma demonstração do AproveTech.',
      '',
      `Responsável: ${get('nome')}`,
      `Empresa: ${get('empresa')}`,
      `E-mail: ${get('email')}`,
      `Telefone: ${get('telefone') || 'não informado'}`,
    ];
    if (get('mensagem')) lines.push('', 'Como as aprovações funcionam hoje:', get('mensagem'));
    const href = `mailto:${CONTACT_TO}?subject=${encodeURIComponent(
      `Quero uma demonstração do AproveTech · ${get('empresa')}`,
    )}&body=${encodeURIComponent(lines.join('\n'))}`;
    setFallback(href);
    setStatus('sending');
    try {
      const res = await fetch('/api/demonstracao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      if (!res.ok) throw new Error(String(res.status));
      setPhone('');
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="demo-title"
      onClick={(e) => {
        // Clique no fundo escurecido (fora do cartão) fecha a janela.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-card">
        <button type="button" className="modal-x" onClick={close} aria-label="Fechar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="modal-done" role="status">
            <h2 id="demo-title">Pedido enviado</h2>
            <p>Recebemos os seus dados. Vamos responder no e-mail que você informou.</p>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={close}>
                Fechar
              </button>
            </div>
          </div>
        ) : status === 'failed' ? (
          <div className="modal-done" role="alert">
            <h2 id="demo-title">Não conseguimos enviar</h2>
            <p>
              Envie pelo seu programa de e-mail: a mensagem já vai preenchida. Ou escreva para{' '}
              <strong>{CONTACT_EMAILS.join(' e ')}</strong>.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close}>
                Fechar
              </button>
              <a className="btn" href={fallback}>
                Abrir meu e-mail
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h2 id="demo-title">Pedir demonstração</h2>
            <p className="modal-lead">
              Preencha os dados e mostramos o AproveTech com o fluxo da sua empresa.
            </p>

            <div className="field">
              <label htmlFor="d-nome">Nome do responsável</label>
              <input id="d-nome" name="nome" type="text" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="d-empresa">Nome da empresa</label>
              <input id="d-empresa" name="empresa" type="text" required autoComplete="organization" />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="d-email">Seu e-mail</label>
                <input id="d-email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="field">
                <label htmlFor="d-tel">
                  Telefone <span>(opcional)</span>
                </label>
                <input
                  id="d-tel"
                  name="telefone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="d-msg">
                Como as aprovações funcionam hoje? <span>(opcional)</span>
              </label>
              <textarea id="d-msg" name="mensagem" rows={3} />
            </div>

            {/* Armadilha para robôs: fica fora da tela e uma pessoa não preenche. */}
            <input
              name="site"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px' }}
            />

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close}>
                Cancelar
              </button>
              <button type="submit" className="btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Enviar pedido'}
              </button>
            </div>
            <p className="modal-hint">Vamos responder no e-mail que você informar.</p>
          </form>
        )}
      </div>
    </dialog>
  );
}
