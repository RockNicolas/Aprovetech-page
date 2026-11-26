// Monta o e-mail de pedido de demonstração. Usa tabelas e estilos na própria tag para abrir igual
// no Gmail e no Outlook.

export type DemoRequest = {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  mensagem: string;
};

// Tudo o que vem do formulário passa por aqui antes de entrar no HTML.
const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildDemoEmail(data: DemoRequest, logoSrc: string) {
  const rows: [string, string][] = [
    ['Empresa', data.empresa],
    ['Responsável', data.nome],
    ['E-mail', data.email],
    ['Telefone', data.telefone || 'não informado'],
  ];
  if (data.mensagem) rows.push(['Como aprovam hoje', data.mensagem]);

  const table = rows
    .map(([label, value], i) => {
      const line = i < rows.length - 1 ? 'border-bottom:1px solid #ebe9e4;' : '';
      return `<tr>
<td width="34%" valign="top" style="padding:13px 16px;${line}font-size:13px;color:#86848a;">${label}</td>
<td style="padding:13px 16px;${line}font-size:15px;font-weight:600;line-height:1.55;word-break:break-word;">${escape(value).replace(/\r?\n/g, '<br>')}</td>
</tr>`;
    })
    .join('\n');

  const reply = escape(
    `mailto:${data.email}?subject=${encodeURIComponent('Demonstração do AproveTech')}`,
  );
  const email = escape(data.email);

  const html = `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f0ec;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#1e1e22;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f0ec;">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#1f1e23;padding:20px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding-right:10px;"><img src="${logoSrc}" width="48" height="48" alt="" style="display:block;border:0;"></td>
<td style="font-size:24px;font-weight:700;color:#ffffff;">Aprove<span style="color:#ff7a3d;">Tech</span></td>
</tr></table>
</td></tr>
<tr><td style="padding:34px 28px 30px;">
<h1 style="margin:0 0 6px;font-size:24px;line-height:1.3;">Novo pedido de demonstração</h1>
<p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#6b6a70;">Olá!</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;">Uma empresa pediu uma demonstração do AproveTech pelo site.</p>
<span style="display:inline-block;background:#fdf0d5;color:#8a5a00;font-size:12px;font-weight:700;letter-spacing:0.04em;padding:7px 14px;border-radius:99px;">AGUARDANDO CONTATO</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;background:#f9f8f6;border:1px solid #ebe9e4;border-radius:10px;border-collapse:separate;">
${table}
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:30px;"><tr>
<td style="background:#ff7a3d;border-radius:9px;">
<a href="${reply}" style="display:inline-block;padding:15px 30px;font-size:15px;font-weight:700;color:#1e1e22;text-decoration:none;">Responder ao cliente</a>
</td>
</tr></table>
<p style="margin:26px 0 0;font-size:13px;line-height:1.7;color:#6b6a70;">Você recebe este aviso porque este endereço recebe os pedidos de demonstração do site.</p>
</td></tr>
<tr><td style="background:#f9f8f6;border-top:1px solid #ebe9e4;padding:22px 28px;font-size:12px;line-height:1.6;color:#86848a;">
Se o botão não abrir, escreva para <a href="mailto:${email}" style="color:#1155cc;">${email}</a>.
<br><br>
AproveTech · Aprovações da plataforma ERP no seu celular.<br>
Este é um e-mail automático enviado pelo site.
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  // Versão em texto simples, para quem não exibe HTML.
  const text = [
    'Novo pedido de demonstração do AproveTech',
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join('\n');

  const subject = `Pedido de demonstração · ${data.empresa}`.replace(/\s+/g, ' ');

  return { subject, html, text };
}
