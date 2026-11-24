// E-mail que recebe os pedidos de demonstração. Defina NEXT_PUBLIC_CONTACT_EMAIL para trocar.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contato@aprovetech.com.br';
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  'Quero uma demonstração do AproveTech',
)}`;

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
    title: 'Reprovação com motivo',
    text: 'Não dá para reprovar sem escrever o motivo. O solicitante sabe o que corrigir.',
  },
  {
    title: 'Registro de cada decisão',
    text: 'Quem decidiu, quando e com quais dados na tela. Ninguém edita esse registro depois.',
  },
  {
    title: 'Documento alterado é barrado',
    text: 'Antes do envio, o servidor consulta o documento de novo. Se ele mudou no ERP, a decisão é recusada. Isso também evita envio em dobro.',
  },
  {
    title: 'Cada usuário cuida dos seus dados',
    text: 'Dá para exportar os próprios dados, ver as sessões abertas e pedir a exclusão da conta.',
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
    a: 'O AproveTech respeita as alçadas: cada pessoa visualiza e decide apenas o que cabe ao seu nível, nas obras às quais tem acesso. A equipe do AproveTech configura isso para cada empresa.',
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

// Empresas responsáveis pelo AproveTech. crop = x, y, largura e altura (em pixels da imagem
// original) do trecho onde está a logo; o resto da imagem fica de fora. bg é a cor de fundo da
// própria imagem, usada no cartão para a logo não aparecer dentro de um retângulo.
export const makers = [
  {
    name: 'Rock Software Solutions',
    src: '/responsaveis/rock-software-solutions.png',
    width: 880,
    crop: [174, 154, 541, 131],
    bg: '#f7f9fb',
  },
  {
    name: 'NID Tecnologia',
    src: '/responsaveis/nid-tecnologia.jpg',
    width: 750,
    crop: [43, 171, 675, 196],
    bg: '#ffffff',
  },
] as const;

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
