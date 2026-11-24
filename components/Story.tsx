import type { CSSProperties } from 'react';
import { Reveal, Title } from './Reveal';

const STEPS = [
  {
    title: 'Conectamos ao seu ERP',
    text: 'Nossa equipe liga o AproveTech à API do ERP com um usuário da empresa. O app só lê os documentos: nada é gravado no ERP até alguém aprovar ou reprovar.',
  },
  {
    title: 'O aviso chega no celular',
    text: 'Entrou uma pendência na alçada de alguém? Essa pessoa recebe uma notificação com o tipo do documento, a obra e o valor.',
  },
  {
    title: 'A pessoa confere',
    text: 'Valor, fornecedor, obra, prazo, solicitante e itens aparecem na mesma tela. Sem abrir anexo, sem planilha.',
  },
  {
    title: 'Aprova ou reprova',
    text: 'Antes do envio aparece um resumo. Valores altos pedem biometria. Quem decidiu, quando e com quais dados fica registrado.',
  },
];

// Linha do tempo estática: quando entra na tela, o fio se desenha e cada etapa acende em sequência.
export function Story() {
  return (
    <section className="section how" id="como-funciona">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">Como funciona</p>
          </Reveal>
          <h2>
            <Title text="Sem trocar de sistema e sem mudar o processo." accentFrom={4} />
          </h2>
        </div>
        <ol className="how-steps" data-in="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} style={{ '--i': i } as CSSProperties}>
              <span className="how-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
