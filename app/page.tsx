import { DocTypes } from '../components/DocTypes';
import { Faq } from '../components/Faq';
import { Film } from '../components/Film';
import { Hero3DLoader } from '../components/Hero3DLoader';
import { Magnetic } from '../components/Magnetic';
import { Nav } from '../components/Nav';
import { PhoneDemo } from '../components/PhoneDemo';
import { Reveal, SplitWordsCss, Title } from '../components/Reveal';
import { Story } from '../components/Story';
import { ThingIcon } from '../components/ThingIcon';
import { CONTACT_HREF, documentTypes, faq, heroPoints, instagramUrl, makers, navLinks, safety } from './content';

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg className="arr" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Instagram = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const Globe = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

// Recursos do aplicativo. Cada cartão tem uma ilustração no topo, todas da mesma altura, para os
// títulos ficarem na mesma linha.
const FEATURES = [
  {
    key: 'lista',
    title: 'Tudo o que importa já na lista',
    text: 'Tipo, número, fornecedor, valor, obra, prioridade e prazo. Filtre por obra, tipo ou prioridade e pesquise por documento ou fornecedor.',
  },
  {
    key: 'lote',
    title: 'Aprovação em lote',
    text: 'Selecione até 50 documentos, revise a prévia e envie. Cada um segue separado para a fila de envio.',
  },
  {
    key: 'alcadas',
    title: 'Alçadas respeitadas',
    text: 'Cada pessoa decide só o que cabe ao seu nível e às suas obras, como já acontece na empresa.',
  },
  {
    key: 'avisos',
    title: 'Avisos no celular',
    text: 'Notificação quando algo espera a sua decisão, abrindo direto no documento. No iPhone, é preciso adicionar o app à Tela de Início.',
  },
  {
    key: 'sinal',
    title: 'Funciona sem sinal',
    text: 'Sem conexão no canteiro, a decisão fica guardada no aparelho e só sai da fila quando o servidor confirma o recebimento.',
  },
  {
    key: 'painel',
    title: 'Painel de administração',
    text: 'Empresas, usuários, perfis e limites, acompanhamento da integração com o ERP e relatórios. O acesso pede verificação em duas etapas.',
  },
] as const;

function FeatureFigure({ name }: { name: (typeof FEATURES)[number]['key'] }) {
  switch (name) {
    case 'lista':
      return (
        <div className="chips">
          <span className="chip chip-urgent">Prioridade alta</span>
          <span className="chip">Residencial Aurora</span>
          <span className="chip">Pedido</span>
          <span className="chip">Medição</span>
          <span className="chip">Contrato</span>
        </div>
      );
    case 'lote':
      return (
        <ul className="batch">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} style={{ ['--i' as string]: i }}>
              <span />
              <i />
            </li>
          ))}
        </ul>
      );
    case 'alcadas':
      return (
        <ol className="levels">
          {['1ª alçada', '2ª alçada', '3ª alçada'].map((l, i) => (
            <li key={l} style={{ ['--i' as string]: i }}>
              {l}
            </li>
          ))}
        </ol>
      );
    case 'avisos':
      return (
        <div className="notif">
          <img src="/logo.svg" alt="" width={22} height={25} />
          <div>
            <b>Pedido 4821 aguarda sua decisão</b>
            <small>R$ 38.420,00 · agora</small>
          </div>
        </div>
      );
    case 'sinal':
      return (
        <div className="queue">
          <small>Sem conexão · 2 decisões guardadas</small>
          <ul>
            <li>
              <span>Pedido 4821</span>
              <em>Aguardando envio</em>
            </li>
            <li>
              <span>Medição 112</span>
              <em>Aguardando envio</em>
            </li>
          </ul>
        </div>
      );
    case 'painel':
      return (
        <ul className="mini-stats">
          <li>
            <strong>5</strong>
            <span>tipos de documento</span>
          </li>
          <li>
            <strong>50</strong>
            <span>por lote</span>
          </li>
          <li>
            <strong>2FA</strong>
            <span>no painel</span>
          </li>
        </ul>
      );
  }
}

export default function Page() {
  return (
    <>
      <a className="skip" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Nav links={navLinks} contactHref={CONTACT_HREF} />

      <main id="conteudo">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <span className="orb o1" />
            <span className="orb o2" />
            <span className="grid-lines" />
          </div>
          <Hero3DLoader />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="pill fade-up" style={{ animationDelay: '0s' }}>
                <i /> Aprovações do seu sistema ERP, no celular
              </p>
              <h1>
                <SplitWordsCss text="Aprovou no celular." delay={0.1} />
                <br />
                <SplitWordsCss text="A obra não parou." delay={0.35} accentFrom={0} />
              </h1>
              <p className="lead fade-up" style={{ animationDelay: '0.7s' }}>
                Pedidos, solicitações, cotações, contratos e medições do sistema ERP na palma da mão, com
                valor, fornecedor e obra na tela antes de qualquer toque.
              </p>
              <div className="hero-cta fade-up" style={{ animationDelay: '0.85s' }}>
                <Magnetic>
                  <a className="btn btn-glow" href={CONTACT_HREF} data-demo>
                    Pedir demonstração
                    <Arrow />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a className="btn btn-ghost" href="#filme">
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                    Ver em 24 segundos
                  </a>
                </Magnetic>
              </div>
              <ul className="hero-points fade-up" style={{ animationDelay: '1s' }} aria-label="Destaques">
                {heroPoints.map((p) => (
                  <li key={p}>
                    <span className="tick" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero-space" aria-hidden="true" />
          </div>
          <a className="scroll-hint" href="#tipos" aria-label="Rolar para baixo">
            <span />
          </a>
        </section>

        {/* FAIXA */}
        <section className="strip" id="tipos" aria-label="Documentos que você aprova">
          <div className="wrap strip-inner">
            <span className="strip-label">Aprova pelo celular</span>
            <ul>
              {documentTypes.map((t) => (
                <li key={t.label}>
                  <ThingIcon name={t.icon} size={18} bare />
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PROBLEMA */}
        <section className="section problem" id="problema">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow">O problema</p>
            </Reveal>
            <h2 className="big">
              <Title text="Documento parado na mesa de quem está na obra." accentFrom={5} />
            </h2>
            <div className="problem-cols">
              <Reveal kind="rule" delay={0.1}>
                <p>
                  Quem aprova está na reunião, no canteiro ou na estrada. O pedido espera o
                  computador, o fornecedor espera a resposta e a obra espera o material.
                </p>
              </Reveal>
              <Reveal kind="rule" delay={0.2}>
                <p>
                  Com o AproveTech, o aviso chega no celular de quem aprova. A pessoa confere valor,
                  fornecedor e obra e decide ali mesmo, sem esperar voltar ao escritório.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <Story />

        <DocTypes />

        {/* EXPERIMENTE */}
        <section className="section try" id="experimente">
          <div className="wrap try-grid">
            <div className="try-copy">
              <Reveal>
                <p className="eyebrow">Demonstração</p>
              </Reveal>
              <h2>
                <Title text="Teste antes de falar com a gente." accentFrom={2} />
              </h2>
              <Reveal delay={0.15}>
                <p className="section-sub">
                  Aprove um dos documentos fictícios ao lado e veja o resumo, o envio e o total
                  mudarem, do mesmo jeito que no aplicativo.
                </p>
              </Reveal>
              <ol className="try-list">
                <Reveal as="li" kind="rule" delay={0.1}>
                  <b>1</b>
                  <span>
                    Toque em <strong>Aprovar</strong> em qualquer documento
                  </span>
                </Reveal>
                <Reveal as="li" kind="rule" delay={0.2}>
                  <b>2</b>
                  <span>Confira fornecedor, obra e valor no resumo</span>
                </Reveal>
                <Reveal as="li" kind="rule" delay={0.3}>
                  <b>3</b>
                  <span>Confirme e acompanhe o envio até o fim</span>
                </Reveal>
              </ol>
            </div>
            <Reveal delay={0.1}>
              <PhoneDemo />
            </Reveal>
          </div>
        </section>

        <Film />

        {/* RECURSOS */}
        <section className="section" id="recursos">
          <div className="wrap">
            <div className="section-head">
              <Reveal>
                <p className="eyebrow">Recursos</p>
              </Reveal>
              <h2>
                <Title text="O que vem no aplicativo." />
              </h2>
            </div>

            <ul className="features">
              {FEATURES.map((f, i) => (
                <Reveal as="li" className="card" key={f.key} delay={(i % 3) * 0.08}>
                  <div className="card-fig" aria-hidden="true">
                    <FeatureFigure name={f.key} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="section security" id="seguranca">
          <div className="wrap split">
            <div className="split-head">
              <Reveal>
                <p className="eyebrow">Segurança</p>
              </Reveal>
              <h2>
                <Title text="Aprovação enviada ao ERP não se desfaz." accentFrom={4} />
              </h2>
              <Reveal delay={0.15}>
                <p className="section-sub">
                  Por isso o aplicativo pede conferência antes de cada envio e guarda o registro de
                  tudo depois.
                </p>
              </Reveal>
            </div>
            <ol className="safe-list">
              {safety.map((s, i) => (
                <Reveal as="li" kind="rule" key={s.title} delay={i * 0.06}>
                  <span className="safe-n">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.text}</span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="wrap split">
            <div className="split-head">
              <Reveal>
                <p className="eyebrow">Dúvidas</p>
              </Reveal>
              <h2>
                <Title text="Perguntas frequentes" />
              </h2>
              <Reveal delay={0.15}>
                <p className="section-sub">
                  Não achou a sua?{' '}
                  <a className="text-link" href={CONTACT_HREF}>
                    Escreva para a gente
                  </a>
                  .
                </p>
              </Reveal>
            </div>
            <Reveal>
              <Faq items={faq} />
            </Reveal>
          </div>
        </section>

        {/* RESPONSÁVEIS */}
        <section className="section makers" id="responsaveis">
          <div className="wrap">
            <div className="section-head">
              <Reveal>
                <p className="eyebrow">Quem faz</p>
              </Reveal>
              <h2>
                <Title text="Quem está por trás do AproveTech" accentFrom={3} />
              </h2>
              <Reveal delay={0.15}>
                <p className="section-sub">
                  O AproveTech é um produto da Rock Software Solutions e da NID Consultoria.
                </p>
              </Reveal>
            </div>
            <ul className="makers-list">
              {makers.map((m, i) => {
                const [x, y, cw, ch] = m.crop;
                return (
                  <Reveal as="li" className="maker" key={m.name} delay={i * 0.1}>
                    <div className="maker-logo" style={{ background: m.bg }}>
                      {/* Recorta só a logo de dentro da imagem, sem o fundo em volta. */}
                      <span className="crop" style={{ height: m.height, aspectRatio: `${cw} / ${ch}` }}>
                        <img
                          src={m.src}
                          alt={m.name}
                          style={{
                            width: `${(m.width / cw) * 100}%`,
                            marginLeft: `${(-x / cw) * 100}%`,
                            marginTop: `${(-y / cw) * 100}%`,
                          }}
                        />
                      </span>
                    </div>
                    <div className="maker-body">
                      <h3>{m.name}</h3>
                      <p className="maker-text">{m.text}</p>
                      <ul className="maker-facts">
                        {m.facts.map(([big, label]) => (
                          <li key={big}>
                            <strong>{big}</strong>
                            <span>{label}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="maker-links">
                        <a
                          className="maker-link"
                          href={m.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Site da ${m.name} (abre em nova aba)`}
                        >
                          <Globe />
                          Site
                        </a>
                        <a
                          className="maker-link"
                          href={instagramUrl(m.instagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Instagram da ${m.name}: @${m.instagram} (abre em nova aba)`}
                        >
                          <Instagram />@{m.instagram}
                        </a>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="cta" id="contato">
          <div className="wrap cta-inner">
            <h2 className="cta-title">
              <Title text="Menos espera." />
              <Title text="Mais obra." accentFrom={0} delay={0.2} />
            </h2>
            <Reveal delay={0.3}>
              <p>
                Conte como as aprovações funcionam hoje na sua empresa e mostramos o AproveTech
                rodando com o seu fluxo.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <a className="btn btn-lg" href={CONTACT_HREF} data-demo>
                Pedir demonstração
                <Arrow size={20} />
              </a>
              <small>Resposta por e-mail, sem compromisso.</small>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand" href="#topo" aria-label="AproveTech, voltar ao topo">
            <img src="/logo.svg" alt="" width={26} height={29} />
            <span>
              Aprove<span className="brand-light">Tech</span>
            </span>
          </a>
          <ul className="footer-social" aria-label="Instagram das empresas responsáveis">
            {makers.map((m) => (
              <li key={m.instagram}>
                <a href={instagramUrl(m.instagram)} target="_blank" rel="noopener noreferrer">
                  <Instagram size={16} />@{m.instagram}
                </a>
              </li>
            ))}
          </ul>
          <p>
            © {new Date().getFullYear()} AproveTech, um produto da Rock Software Solutions e da NID
            Consultoria. O AproveTech se integra a sistemas ERP por API. Marcas de terceiros
            pertencem aos seus respectivos titulares.
          </p>
        </div>
      </footer>
    </>
  );
}
