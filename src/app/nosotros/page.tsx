import Icon from "@/components/ui/Icon";
import { SectionHead, PageHero, ContactCTA } from "@/components/ui/Sections";
import Pillars from "@/components/home/Pillars";
export const metadata = { title: "Nosotros" };
export default function About() {
  return (
    <>
      <PageHero
        tag="Nosotros"
        title={
          <>
            Una visión compartida.
            <br />
            Un futuro sostenible.
          </>
        }
        description="Conoce lo que nos inspira, lo que hacemos y los vínculos que construimos."
      />
      <section className="section shell about-intro">
        <img src="/assets/people.jpg" alt="Equipo de Exalmar" loading="lazy" />
        <div>
          <span className="eyebrow">SOMOS EXALMAR</span>
          <h2>
            El mar nos conecta.
            <br />
            Las personas nos impulsan.
          </h2>
          <p>
            Pesquera Exalmar S.A.A. desarrolla productos del mar para consumo
            humano directo e indirecto. La preservación de los recursos y el
            desarrollo del talento son parte de su enfoque institucional.
          </p>
          <p>
            Adaptarnos, innovar y mantener una comunicación transparente con
            nuestros grupos de interés nos ayuda a construir relaciones de
            confianza.
          </p>
        </div>
      </section>
      <section className="section purpose">
        <div className="shell purpose-grid">
          <article>
            <Icon name="compass" />
            <span className="eyebrow">NUESTRA MISIÓN</span>
            <h2>Nutrir y generar valor.</h2>
            <p>
              Desarrollar productos hidrobiológicos de calidad mediante una
              gestión sostenible que contribuya a mejorar la vida de las
              personas.
            </p>
          </article>
          <article>
            <Icon name="globe" />
            <span className="eyebrow">NUESTRA VISIÓN</span>
            <h2>Crecer con propósito.</h2>
            <p>
              Aspirar al reconocimiento como una empresa sostenible y referente
              en productos de alto valor proteico.
            </p>
          </article>
        </div>
      </section>
      <section className="section shell">
        <SectionHead
          tag="Nuestros valores"
          title="Lo que guía cada decisión."
        />
        <div className="values">
          {[
            ["shield", "Integridad"],
            ["check", "Responsabilidad"],
            ["users", "Respeto"],
            ["compass", "Excelencia"],
            ["mail", "Comunicación"],
          ].map(([icon, text]) => (
            <div key={text}>
              <Icon name={icon} />
              <h3>{text}</h3>
            </div>
          ))}
        </div>
      </section>
      <Pillars />
      <section className="section shell" id="alianzas">
        <SectionHead
          tag="Relaciones que construyen"
          title="Aliados por el bienestar común."
          description="La colaboración con el sector y las comunidades amplía el alcance de las iniciativas sociales."
        />
        <div className="alliance-cards">
          {[
            {
              icon: "users",
              title: "APRO Norte Chico",
              text: "Articulación con actores locales para promover la nutrición y el bienestar de las comunidades.",
              link: "impulsando-la-salud-en-carquin-junto-a-apro-norte-chico",
            },
            {
              icon: "leaf",
              title: "APRO Tambo de Mora",
              text: "Acciones conjuntas con autoridades y empresas para el cuidado del ambiente y el desarrollo local.",
              link: "mas-arboles-para-la-comunidad-gracias-a-apro-tambo-de-mora",
            },
            {
              icon: "anchor",
              title: "Sociedad Nacional de Pesquería",
              text: "Coordinación sectorial para fortalecer la gestión social y compartir aprendizajes.",
              link: "articulando-esfuerzos-para-seguir-fortaleciendo-nuestro-impacto-social",
            },
          ].map((a) => (
            <article key={a.title}>
              <Icon name={a.icon} />
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <a
                href={"https://www.exalmar.com.pe/noticias/" + a.link + "/"}
                target="_blank"
                rel="noopener"
              >
                Ver iniciativa
              </a>
            </article>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
