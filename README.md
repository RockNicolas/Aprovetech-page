# AproveTech · Landing page

Site público do AproveTech em Next.js 16, React 19 e TypeScript. O topo tem uma cena 3D (Three.js /
React Three Fiber); o resto da página usa animações leves feitas em CSS.

O AproveTech é um produto da **Rock Software Solutions** e da **NID Tecnologia**.

```sh
npm install
npm run dev      # http://localhost:3002
npm run build
```

## Seções

| Seção          | Arquivo                       | O que faz                                                          |
| -------------- | ----------------------------- | ------------------------------------------------------------------ |
| Topo           | `components/Hero3D.tsx`       | Escudo 3D da marca, cartões de documento e moedas; segue o mouse   |
| Como funciona  | `components/Story.tsx`        | Linha do tempo de 4 etapas que acende em sequência ao aparecer     |
| Documentos     | `components/DocTypes.tsx`     | Lista dos 5 tipos; a prévia do documento troca ao passar o mouse   |
| Demonstração   | `components/PhoneDemo.tsx`    | Celular que funciona: aprovar, confirmar, enviar                   |
| Filme          | `components/Film.tsx`         | Animação de 24 s com play/pausa, linha do tempo e capítulos        |
| Recursos, Segurança, Responsáveis | `app/page.tsx` | Conteúdo em `app/content.ts`                                   |

## Animações de entrada

`components/Reveal.tsx` só marca os blocos com `data-in` (`fade`, `rule` ou `line`), e
`components/InView.tsx` usa um único IntersectionObserver para a página toda, acrescentando a
classe `.is-in` quando o bloco aparece. O movimento fica todo em `app/styles.css`, na seção
"Entradas". Sem JavaScript, ou com "reduzir movimento" ativado no sistema, tudo aparece parado.

## Ajustes

- Textos, perguntas, empresas responsáveis e dados da demonstração: `app/content.ts`
- Logos das empresas responsáveis: `public/responsaveis/`
- Estilos e cores: `app/styles.css` (tokens no topo)
- E-mail dos botões "Pedir demonstração": variável `NEXT_PUBLIC_CONTACT_EMAIL` (veja `.env.example`)
