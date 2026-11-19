import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { SectionHead, ContactCTA } from "@/components/ui/Sections";
import Pillars from "@/components/home/Pillars";
import ProductCatalog from "@/components/products/ProductCatalog";
export default function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-bg"
          src="/assets/sea.jpg"
          alt="Colaborador de Exalmar a bordo de una embarcación al atardecer"
          fetchPriority="high"
        />
        <div className="shell hero-content">
          <span className="eyebrow light">PESQUERA EXALMAR · PERÚ</span>
          <h1>
            Nuestro mar.
            <br />
            Nuestra gente.
            <br />
            <em>Nuestro futuro.</em>
          </h1>
          <p>
            Transformamos la riqueza del mar en oportunidades, con una mirada
            sostenible.
          </p>
          <div className="button-row">
            <Link className="button lime" href="/nosotros">
              Conoce Exalmar
            </Link>
            <a className="text-link" href="#productos">
              Explora nuestros productos
            </a>
          </div>
        </div>
        <div className="hero-bottom shell">
          <span>
            <Icon name="waves" />
            Un vínculo que nos mueve
          </span>
          <span>Pesca · Nutrición · Sostenibilidad</span>
        </div>
      </section>
      <section className="intro shell">
        <span className="eyebrow">DEL MAR, CON PROPÓSITO</span>
        <div>
          <h2>
            Creemos en el valor
            <br />
            de hacer las cosas bien.
          </h2>
          <p>
            Somos una empresa pesquera que desarrolla productos hidrobiológicos
            y apuesta por el cuidado de los recursos, las personas y su entorno.
          </p>
          <Link className="inline-link" href="/nosotros">
            Descubre quiénes somos
          </Link>
        </div>
      </section>
      <section className="section products" id="productos">
        <div className="shell">
          <SectionHead
            tag="Nuestros productos"
            title="Nutrición que nace del mar."
            description="Dos líneas de negocio conectadas por el valor de nuestros recursos marinos."
          />
          <div className="product-grid">
            {[
              {
                image: "direct.jpg",
                icon: "fish",
                label: "CONSUMO HUMANO DIRECTO",
                title: "Del mar a la mesa",
                text: "Productos congelados de pota, jurel, caballa y anchoveta.",
                tags: ["Pota", "Jurel", "Caballa", "Anchoveta"],
                url: "productos-de-consumo-humano-directo",
              },
              {
                image: "indirect.jpg",
                icon: "grain",
                label: "CONSUMO HUMANO INDIRECTO",
                title: "Ingredientes con valor",
                text: "Harina y aceite de pescado para la acuicultura y la nutrición.",
                tags: ["Harina de pescado", "Aceite de pescado"],
                url: "productos-consumo-humano-indirecto",
              },
            ].map((p) => (
              <article className="product" key={p.title}>
                <div className="product-image">
                  <img src={"/assets/" + p.image} alt={p.text} loading="lazy" />
                  <span className="product-label">
                    <Icon name={p.icon} />
                    {p.label}
                  </span>
                </div>
                <div className="product-body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <a
                    className="inline-link"
                    href={"https://www.exalmar.com.pe/productos/" + p.url + "/"}
                    target="_blank"
                    rel="noopener"
                  >
                    Conocer productos
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ProductCatalog />
      <Pillars />
      <section className="section alliance">
        <div className="shell alliance-grid">
          <div>
            <span className="eyebrow">ALIANZAS QUE SUMAN</span>
            <h2>
              Juntos, el impacto
              <br />
              llega más lejos.
            </h2>
          </div>
          <div>
            <p>
              Trabajamos de manera articulada con las APRO, la Sociedad Nacional
              de Pesquería y actores locales para contribuir al bienestar de las
              comunidades pesqueras.
            </p>
            <div className="partner-row">
              <span>
                <Icon name="users" />
                APRO Norte Chico
              </span>
              <span>
                <Icon name="leaf" />
                APRO Tambo de Mora
              </span>
              <span>
                <Icon name="anchor" />
                SNP
              </span>
            </div>
            <Link className="inline-link" href="/nosotros#alianzas">
              Conoce nuestras alianzas
            </Link>
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
