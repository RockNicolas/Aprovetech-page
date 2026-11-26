# AproveTech · Landing page

Site público do AproveTech em Next.js 16, React 19 e TypeScript. O topo tem uma cena 3D (Three.js /
React Three Fiber); o resto da página usa animações leves feitas em CSS.

O AproveTech é um produto da **Rock Software Solutions** e da **NID Consultoria** (que administra a NID Tecnologia).

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

## Publicar e aparecer no Google

O site é estático (`npm run build` gera tudo pré-renderizado), então roda em qualquer hospedagem de
Next.js. A mais simples é a Vercel: importe o repositório do GitHub e confirme.

1. Em **Environment Variables** da hospedagem, defina `NEXT_PUBLIC_SITE_URL` com o endereço final
   (por exemplo `https://aprovetech.com.br`, sem barra no fim). Ele vai para o sitemap, o link
   canônico e as prévias de compartilhamento. Sem isso, saem endereços de `localhost`.
2. Abra o [Google Search Console](https://search.google.com/search-console), adicione o site,
   escolha verificação por **tag HTML** e copie só o valor de `content` para
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Publique de novo e clique em verificar.
3. No Search Console, em **Sitemaps**, envie `sitemap.xml`. O Google leva alguns dias para listar.

Já vem configurado: `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, link canônico, título e
descrição, dados estruturados (schema.org), prévia ao compartilhar (`app/opengraph-image.tsx`),
`favicon.ico`, `favicon.svg` e ícone para iPhone. Funciona nos navegadores atuais (Chrome, Edge,
Firefox e Safari de 2023 em diante); a cena 3D do topo some sozinha se o aparelho não suportar WebGL.

## Ajustes

- Textos, perguntas, empresas responsáveis e dados da demonstração: `app/content.ts`
- Logos das empresas responsáveis: `public/responsaveis/`
- Estilos e cores: `app/styles.css` (tokens no topo)
- E-mails de contato mostrados no site: variável `NEXT_PUBLIC_CONTACT_EMAIL`, separados por vírgula
- Envio do formulário "Pedir demonstração": variáveis `SMTP_*` e `DEMO_EMAIL_TO` (veja `.env.example`).
  Copie para `.env` no computador e cadastre as mesmas na hospedagem. Sem elas, o formulário oferece o
  programa de e-mail do visitante. O modelo do e-mail está em `lib/demo-email.ts`.
