'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CONTACT_EMAIL } from '../app/content';

// Qualquer link com data-demo abre esta janela. Sem JavaScript, o link segue como mailto normal.
// O site é estático e não tem servidor de e-mail: ao enviar, o formulário abre o programa de e-mail
// do visitante com a mensagem pronta, endereçada a CONTACT_EMAIL.

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
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const open = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-demo]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      setSent(false);
      ref.current?.showModal();
    };
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, []);

  const close = () => ref.current?.close();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
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
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Quero uma demonstração do AproveTech · ${get('empresa')}`,
    )}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
    window.location.href = href;
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

        {sent ? (
          <div className="modal-done">
            <h2 id="demo-title">Falta só enviar</h2>
            <p>
              Abrimos o seu programa de e-mail com a mensagem pronta, endereçada a{' '}
              <strong>{CONTACT_EMAIL}</strong>. Confira e clique em enviar.
            </p>
            <p className="modal-hint">
              Não abriu? Escreva direto para{' '}
              <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={close}>
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <h2 id="demo-title">Pedir demonstração</h2>
            <p className="modal-lead">
              Preencha os dados e mostramos o AproveTech com o fluxo da sua empresa. A mensagem vai
              para <strong>{CONTACT_EMAIL}</strong>.
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

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={close}>
                Cancelar
              </button>
              <button type="submit" className="btn">
                Enviar pedido
              </button>
            </div>
            <p className="modal-hint">
              Ao enviar, abrimos o seu programa de e-mail com a mensagem pronta. Nada é enviado sem
              a sua confirmação.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
