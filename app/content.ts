// E-mail que recebe os pedidos de demonstração. Defina NEXT_PUBLIC_CONTACT_EMAIL para trocar.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'rocksoftwaresolutions.dev@gmail.com';
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Quero uma demonstração do AproveTech',
)}`;

// Endereço público do site, sem barra no fim. Usado no sitemap, nos links canônicos e nas prévias de
// compartilhamento. Defina NEXT_PUBLIC_SITE_URL com o domínio real ao publicar.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002').replace(/\/+$/, '');

export const SITE_TITLE = 'AproveTech · Aprovações do seu ERP no celular';
export const SITE_DESCRIPTION =
  'Aprove pedidos, solicitações, cotações, contratos e medições do seu sistema ERP pelo celular, com confirmação segura, alçadas respeitadas e histórico de cada decisão.';

export const navLinks = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#seguranca', label: 'Segurança' },
  { href: '#faq', label: 'Dúvidas' },
];

export const heroPoints = [
  'Conecta-se ao sistema ERP que você já usa',
  'Respeita as alçadas da empresa',
  'Cada decisão fica registrada',
];

export const documentTypes = [
  { label: 'Pedidos de compra', icon: 'pedido' },
  { label: 'Solicitações', icon: 'solicitacao' },
  { label: 'Cotações', icon: 'cotacao' },
  { label: 'Contratos', icon: 'contrato' },
  { label: 'Medições', icon: 'medicao' },
];

export const safety = [
  {
    title: 'Resumo antes de enviar',
    text: 'Fornecedor, valor e obra aparecem numa tela de confirmação antes de cada decisão.',
  },
  {
    title: 'Biometria nos valores altos',
    text: 'Acima do limite definido pela empresa, ou quando o documento vem sem valor, o app pede uma confirmação a mais com a biometria do celular.',
  },
  {
    title: 'Reprovação com justificativa',
    text: 'Não é possível reprovar sem justificar o motivo. O solicitante saberá o que corrigir.',
  },
  {
    title: 'Registro de cada autorização',
    text: 'Quem autorizou, quando e o que foi autorizado. Os registros não são editáveis, garantindo a segurança das informações.',
  },
  {
    title: 'Documento alterado é barrado',
    text: 'Antes do envio, o servidor consulta o documento de novo. Se ele mudou no ERP, a decisão é recusada. Isso também evita envio em dobro.',
  },
  {
    title: 'Cada usuário cuida dos seus dados',
    text: 'É possível exportar os próprios dados, ver as sessões abertas e pedir a exclusão da conta.',
  },
];

export const faq = [
  {
    q: 'Preciso alterar alguma configuração no meu sistema ERP?',
    a: 'Não. O AproveTech se conecta ao sistema ERP pela API oficial, com um usuário de API da empresa. Quem já cadastra e envia documentos continua trabalhando da mesma forma.',
  },
  {
    q: 'É possível desfazer uma aprovação já enviada?',
    a: 'Não. Uma decisão enviada ao sistema ERP não pode ser desfeita pela API. Por isso o aplicativo mostra um resumo, pede confirmação e exige uma etapa adicional nos valores altos.',
  },
  {
    q: 'Funciona em iPhone e Android?',
    a: 'Sim. O aplicativo atende os dois sistemas e também pode ser acessado pelo navegador.',
  },
  {
    q: 'E se a empresa trabalha com alçadas de aprovação?',
    a: 'O AproveTech respeita as alçadas: cada pessoa visualiza e aprova apenas o que cabe ao seu nível, nas obras às quais tem acesso. A equipe do AproveTech configura isso para cada empresa.',
  },
  {
    q: 'Os dados da minha empresa ficam separados dos de outras empresas?',
    a: 'Sim. Cada empresa é identificada pelo login e acessa apenas os próprios dados. As sessões têm duração curta e podem ser revogadas.',
  },
  {
    q: 'O AproveTech já está disponível para a minha empresa?',
    a: 'Estamos selecionando as primeiras construtoras, com implantação acompanhada. Solicite uma demonstração e conversaremos sobre o seu caso.',
  },
];

// Empresas responsáveis pelo AproveTech.
// - crop: x, y, largura e altura (em pixels da imagem original) do trecho onde está a logo; o resto
//   da imagem fica de fora.
// - height: altura da logo na tela, em pixels. Cada logo tem um peso visual, então a altura é
//   ajustada à mão para as duas parecerem do mesmo tamanho.
// - bg: cor de fundo da própria imagem, usada no cartão para a logo não ficar dentro de um retângulo.
export const makers = [
  {
    name: 'Rock Software Solutions',
    src: '/responsaveis/rock-software-solutions.png',
    width: 880,
    crop: [174, 154, 541, 131],
    height: 56,
    bg: '#f7f9fb',
    instagram: 'rocksoftware.dev',
    site: 'https://rock-software-solutions.vercel.app/',
    text: 'Software house que cria sistemas, sites e aplicativos sob medida, sempre do zero, a partir dos processos de cada empresa. Acompanha o projeto do planejamento ao suporte.',
    facts: [
      ['4 anos', 'desenvolvendo software'],
      ['Do zero', 'sem templates prontos'],
      ['3 etapas', 'planejamento, código e suporte'],
    ],
  },
  {
    name: 'NID Tecnologia',
    src: '/responsaveis/nid-logo.jpg',
    width: 750,
    crop: [43, 171, 675, 196],
    height: 70,
    bg: '#ffffff',
    instagram: 'nidconsultoria',
    site: 'https://www.nidconsultoria.com.br/',
    text: 'A NID Tecnologia é uma empresa do Grupo NID, que conta com a NID Consultoria, empresa especializada em consultoria de processos para construção civil, com implantação, treinamento e capacitação da plataforma ERP SIENGE.',
    facts: [
      ['Desde 2016', 'em atividade'],
      ['15+ anos', 'da equipe na construção civil'],
      ['Power BI', 'indicadores e dashboards'],
    ],
  },
] as const;

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;

export type DemoDoc = {
  id: number;
  type: string;
  num: string;
  supplier: string;
  site: string;
  cents: number;
  urgent: boolean;
};

// Dados fictícios, valores em centavos.
export const demoDocs: DemoDoc[] = [
  {
    id: 1,
    type: 'Pedido',
    num: '4821',
    supplier: 'Concreto Usinado Aurora',
    site: 'Residencial Aurora',
    cents: 3842000,
    urgent: true,
  },
  {
    id: 2,
    type: 'Medição',
    num: '112',
    supplier: 'Terraplenagem Oliveiras',
    site: 'Parque das Oliveiras',
    cents: 12690000,
    urgent: false,
  },
  {
    id: 3,
    type: 'Contrato',
    num: '309',
    supplier: 'Elétrica Horizonte',
    site: 'Edifício Horizonte',
    cents: 8450000,
    urgent: false,
  },
];
