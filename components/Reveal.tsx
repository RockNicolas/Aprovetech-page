import { Fragment, type CSSProperties, type ReactNode } from 'react';

/*
  Entradas da página abaixo do topo. Nada aqui roda JavaScript por elemento: o componente só marca o
  bloco com data-in, e o InView (um único IntersectionObserver para a página toda) acrescenta a
  classe .is-in quando ele aparece. O movimento fica todo no CSS.

  - fade: o bloco surge sem deslocamento.
  - rule: um fio fino se desenha da esquerda para a direita no topo e o conteúdo aparece depois.
  - line: o texto se revela da esquerda para a direita, como uma linha sendo impressa.
*/

type Kind = 'fade' | 'rule' | 'line';

const delayStyle = (delay: number) => (delay ? ({ '--d': `${delay}s` } as CSSProperties) : undefined);

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
  kind = 'fade',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'p';
  kind?: Kind;
}) {
  return (
    <Tag className={className} data-in={kind} style={delayStyle(delay)}>
      {children}
    </Tag>
  );
}

// Título revelado da esquerda para a direita. A partir da palavra accentFrom, o texto ganha um traço
// laranja por baixo, que se desenha logo depois.
export function Title({ text, accentFrom, delay = 0 }: { text: string; accentFrom?: number; delay?: number }) {
  const words = text.split(' ');
  const head = accentFrom == null ? text : words.slice(0, accentFrom).join(' ');
  const tail = accentFrom == null ? '' : words.slice(accentFrom).join(' ');
  return (
    <span className="title-in" data-in="line" style={delayStyle(delay)}>
      {head}
      {head && tail ? ' ' : null}
      {tail ? <span className="mark">{tail}</span> : null}
    </span>
  );
}

// Versão só com CSS para o topo da página: anima assim que o HTML chega, sem esperar o JavaScript.
export function SplitWordsCss({
  text,
  delay = 0,
  accentFrom,
}: {
  text: string;
  delay?: number;
  accentFrom?: number;
}) {
  const words = text.split(' ');
  return (
    <span aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <span
              className={`word rise${accentFrom != null && i >= accentFrom ? ' accent' : ''}`}
              style={{ animationDelay: `${delay + i * 0.07}s` }}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
