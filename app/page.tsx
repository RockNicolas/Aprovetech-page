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
import { CONTACT_HREF, documentTypes, faq, heroPoints, makers, navLinks, safety } from './content';

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg className="arr" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

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
                  <a className="btn btn-glow" href={CONTACT_HREF}>
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
              <Reveal delay={0.2}>
                <p className="section-sub">
                  Lista de pendências, aprovação em lote, alçadas, avisos, uso sem sinal e um painel
                  para a administração.
                </p>
              </Reveal>
            </div>

            <div className="bento">
              <Reveal kind="rule" className="card b-wide">
                <div className="b-text">
                  <ThingIcon name="pedido" />
                  <h3>Tudo o que importa já na lista</h3>
                  <p>
                    Tipo, número, fornecedor, valor, obra, prioridade e prazo. Filtre por obra, tipo
                    ou prioridade e pesquise por documento ou fornecedor.
                  </p>
                </div>
                <div className="chips" aria-hidden="true">
                  <span className="chip chip-urgent">Prioridade alta</span>
                  <span className="chip">Residencial Aurora</span>
                  <span className="chip">Pedido</span>
                  <span className="chip">Medição</span>
                  <span className="chip">Parque das Oliveiras</span>
                  <span className="chip">Contrato</span>
                </div>
              </Reveal>

              <Reveal kind="rule" className="card" delay={0.08}>
                <ThingIcon name="lote" />
                <h3>Aprovação em lote</h3>
                <p>
                  Selecione até 50 documentos, revise a prévia e envie. Cada um segue separado para
                  a fila de envio.
                </p>
                <ul className="batch" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} style={{ ['--i' as string]: i }}>
                      <span />
                      <i />
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal kind="rule" className="card" delay={0.16}>
                <ThingIcon name="escudo" />
                <h3>Alçadas respeitadas</h3>
                <p>
                  Cada pessoa decide só o que cabe ao seu nível e às suas obras, como já acontece na
                  empresa.
                </p>
                <ol className="levels" aria-hidden="true">
                  <li style={{ ['--i' as string]: 0 }}>1ª</li>
                  <li style={{ ['--i' as string]: 1 }}>2ª</li>
                  <li style={{ ['--i' as string]: 2 }}>3ª</li>
                </ol>
              </Reveal>

              <Reveal kind="rule" className="card" delay={0.08}>
                <ThingIcon name="sino" />
                <h3>Avisos no celular</h3>
                <p>
                  Notificação quando algo espera a sua decisão, abrindo direto no documento. No
                  iPhone, é preciso adicionar o app à Tela de Início.
                </p>
              </Reveal>

              <Reveal kind="rule" className="card" delay={0.16}>
                <ThingIcon name="sinal" />
                <h3>Funciona sem sinal</h3>
                <p>
                  Sem conexão no canteiro, a decisão fica guardada no aparelho e só sai da fila
                  quando o servidor confirma o recebimento.
                </p>
                <div className="sync" aria-hidden="true">
                  <span className="dot" />
                  <span className="bar">
                    <i />
                  </span>
                  <span className="dot end" />
                </div>
              </Reveal>

              <Reveal kind="rule" className="card b-wide" delay={0.1}>
                <div className="b-text">
                  <ThingIcon name="cadeado" />
                  <h3>Painel de administração</h3>
                  <p>
                    Cadastro de empresas e usuários, perfis e limites, acompanhamento da integração
                    com o ERP e relatórios. O acesso ao painel pede verificação em duas etapas.
                  </p>
                </div>
                <ul className="mini-stats">
                  <li>
                    <strong>5</strong>
                    <span>tipos de documento</span>
                  </li>
                  <li>
                    <strong>50</strong>
                    <span>documentos por lote</span>
                  </li>
                  <li>
                    <strong>2FA</strong>
                    <span>no painel</span>
                  </li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section className="section security" id="seguranca">
          <div className="wrap sec-grid">
            <div className="sec-head">
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
          <div className="wrap faq-wrap">
            <div className="section-head">
              <Reveal>
                <p className="eyebrow">Dúvidas</p>
              </Reveal>
              <h2>
                <Title text="Perguntas frequentes" />
              </h2>
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
                <Title text="Responsáveis pelo AproveTech" accentFrom={2} />
              </h2>
              <Reveal delay={0.15}>
                <p className="section-sub">
                  O AproveTech é um produto da Rock Software Solutions e da NID Tecnologia.
                </p>
              </Reveal>
            </div>
            <ul className="makers-list">
              {makers.map((m, i) => {
                const [x, y, cw, ch] = m.crop;
                return (
                  <Reveal as="li" kind="rule" key={m.name} delay={i * 0.1}>
                    <div className="maker-logo" style={{ background: m.bg }}>
                      {/* Recorta só a logo de dentro da imagem, sem o fundo em volta. */}
                      <span className="crop" style={{ aspectRatio: `${cw} / ${ch}` }}>
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
                    <strong>{m.name}</strong>
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
              <a className="btn btn-lg" href={CONTACT_HREF}>
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
          <p>
            © {new Date().getFullYear()} AproveTech, um produto da Rock Software Solutions e da NID
            Tecnologia. O AproveTech se integra a sistemas ERP por API. Marcas de terceiros
            pertencem aos seus respectivos titulares.
          </p>
        </div>
      </footer>
    </>
  );
}
