'use client';
import { useState, type CSSProperties } from 'react';
import { Reveal, Title } from './Reveal';
import { ThingIcon } from './ThingIcon';

// Dados fictícios, só para ilustrar o que cada tipo de documento mostra.
const DOCS = [
  {
    key: 'pedido',
    title: 'Pedidos de compra',
    text: 'Fornecedor, itens e valor, com as condições de pagamento e de entrega na mesma tela.',
    head: 'Pedido de compra · 4821',
    value: 'R$ 38.420,00',
    rows: [
      ['Fornecedor', 'Concreto Usinado Aurora'],
      ['Obra', 'Residencial Aurora'],
      ['Itens', 'Concreto fck 30 MPa, 42 m³ e mais 2'],
      ['Pagamento', '28 dias'],
      ['Entrega', 'em 3 dias'],
    ],
  },
  {
    key: 'solicitacao',
    title: 'Solicitações',
    text: 'Quem pediu, para qual obra e o que está sendo pedido, antes de virar compra.',
    head: 'Solicitação · 77',
    value: '12 itens',
    rows: [
      ['Solicitante', 'Rafael Lima, engenharia'],
      ['Obra', 'Residencial Aurora'],
      ['Itens', 'Vergalhão CA-50, arame e mais 10'],
      ['Data de Necessidade', '05/12'],
    ],
  },
  {
    key: 'cotacao',
    title: 'Cotações',
    text: 'O comparativo entre fornecedores para decidir sem abrir planilha.',
    head: 'Cotação · 58',
    value: 'R$ 9.870,00',
    rows: [
      ['Fornecedores', '3 propostas'],
      ['Menor preço', 'Ferro Norte · R$ 9.870,00'],
      ['Maior preço', 'Aço Sul · R$ 11.240,00'],
      ['Obra', 'Edifício Horizonte'],
    ],
  },
  {
    key: 'contrato',
    title: 'Contratos',
    text: 'Escopo, vigência e saldo do contrato à vista na hora de autorizar.',
    head: 'Contrato · 309',
    value: 'R$ 84.500,00',
    rows: [
      ['Fornecedor', 'Elétrica Horizonte'],
      ['Obra', 'Edifício Horizonte'],
      ['Escopo', 'Instalações elétricas, torres A e B'],
      ['Vigência', '12 meses'],
    ],
  },
  {
    key: 'medicao',
    title: 'Medições',
    text: 'O que foi executado e a composição financeira, para liberar o pagamento certo.',
    head: 'Medição · 112',
    value: 'R$ 126.900,00',
    rows: [
      ['Fornecedor', 'Terraplenagem Oliveiras'],
      ['Período', '01 a 31/out'],
      ['Executado', '60% do contrato'],
      ['Retenção', '5%'],
    ],
  },
] as const;

// Lista dos tipos à esquerda; o documento ao lado troca ao passar o mouse, tocar ou focar com o teclado.
export function DocTypes() {
  const [cur, setCur] = useState(0);
  const d = DOCS[cur];

  return (
    <section className="section docs" id="documentos">
      <div className="wrap docs-grid">
        <div>
          <Reveal>
            <p className="eyebrow">Documentos</p>
          </Reveal>
          <h2>
            <Title text="Os cinco documentos que mais seguram a obra." accentFrom={4} />
          </h2>
          <ul className="docs-list" role="tablist" aria-label="Tipos de documento">
            {DOCS.map((x, i) => (
              <li key={x.key} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`doc-tab-${x.key}`}
                  aria-selected={i === cur}
                  aria-controls="doc-preview"
                  className={i === cur ? 'on' : undefined}
                  onClick={() => setCur(i)}
                  onMouseEnter={() => setCur(i)}
                  onFocus={() => setCur(i)}
                >
                  <span className="docs-n">0{i + 1}</span>
                  <ThingIcon name={x.key} size={22} bare />
                  <span className="docs-t">{x.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="doc-preview" role="tabpanel" id="doc-preview" aria-labelledby={`doc-tab-${d.key}`}>
          {/* A key faz o cartão remontar a cada troca, e a animação de entrada roda de novo. */}
          <article className="dp" key={d.key}>
            <header>
              <small>{d.head}</small>
              <strong>{d.value}</strong>
            </header>
            <p className="dp-text">{d.text}</p>
            <dl>
              {d.rows.map(([k, v], i) => (
                <div key={k} style={{ '--i': i } as CSSProperties}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <footer>
              <span>Reprovar</span>
              <span className="dp-ok">Aprovar</span>
            </footer>
          </article>
          <p className="dp-note">Exemplo com dados fictícios.</p>
        </div>
      </div>
    </section>
  );
}
