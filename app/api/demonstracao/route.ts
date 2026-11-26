import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { buildDemoEmail, type DemoRequest } from '../../../lib/demo-email';
import { CONTACT_EMAILS } from '../../content';

// Recebe o formulário de demonstração e envia o e-mail. Os destinatários são fixos no servidor:
// quem preenche o formulário não escolhe para onde a mensagem vai.

const LIMITS: Record<keyof DemoRequest, number> = {
  nome: 120,
  empresa: 160,
  email: 160,
  telefone: 30,
  mensagem: 2000,
};

// Freio simples contra abuso: até 5 pedidos a cada 10 minutos por endereço, em cada instância.
const WINDOW = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function tooMany(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > 5;
}

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  // Exigir JSON impede que um formulário de outro site dispare o envio.
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return fail(415, 'formato inválido');
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return fail(400, 'dados inválidos');

  // Campo escondido que só robô preenche.
  if (body.site) return Response.json({ ok: true });

  const data = {} as DemoRequest;
  for (const key of Object.keys(LIMITS) as (keyof DemoRequest)[]) {
    const value = typeof body[key] === 'string' ? body[key].trim() : '';
    if (value.length > LIMITS[key]) return fail(400, `campo muito longo: ${key}`);
    data[key] = value;
  }
  if (!data.nome || !data.empresa || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(data.email)) {
    return fail(400, 'preencha nome, empresa e um e-mail válido');
  }

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, DEMO_EMAIL_TO } = process.env;
  const port = Number(process.env.SMTP_PORT || 465);
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('[demonstracao] Envio não configurado: defina SMTP_HOST, SMTP_USER e SMTP_PASS.');
    return fail(503, 'envio não configurado');
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (tooMany(ip)) return fail(429, 'muitos pedidos, tente mais tarde');

  const { subject, html, text } = buildDemoEmail(data, 'cid:logo');
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10_000,
      socketTimeout: 20_000,
    });
    await transport.sendMail({
      from: SMTP_FROM || { name: 'AproveTech', address: SMTP_USER },
      to: DEMO_EMAIL_TO || CONTACT_EMAILS.join(','),
      replyTo: { name: data.nome, address: data.email },
      subject,
      html,
      text,
      attachments: [
        {
          filename: 'aprovetech.png',
          path: join(process.cwd(), 'public', 'apple-touch-icon.png'),
          cid: 'logo',
        },
      ],
    });
  } catch (error) {
    console.error('[demonstracao] Falha no envio:', error);
    return fail(502, 'falha no envio');
  }

  return Response.json({ ok: true });
}
