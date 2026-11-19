"use client";
import { useState } from "react";
import { pillars } from "@/content/institutional";
import Icon from "../ui/Icon";
import { SectionHead } from "../ui/Sections";
export default function Pillars() {
  const [active, setActive] = useState<number | null>(0);
  const current = pillars[active ?? 0];
  return (
    <section className="section sustainability" id="pilares">
      <div className="shell">
        <SectionHead
          tag="Sostenibilidad"
          title={
            <>
              El futuro se construye
              <br />
              desde lo que cuidamos.
            </>
          }
          description="Cuatro pilares y un compromiso transversal que orientan nuestra manera de actuar."
        />
        <div className="pillar-layout">
          <div className="pillar-photo">
            <img
              src={"/assets/" + current.image}
              alt={current.title}
              loading="lazy"
            />
            <div>
              <span>{current.short}</span>
              <a
                href="https://www.exalmar.com.pe/sostenibilidad/"
                target="_blank"
                rel="noopener"
              >
                Conoce nuestra estrategia
              </a>
            </div>
          </div>
          <div className="pillar-list">
            {pillars.map((pillar, i) => (
              <div
                className={`pillar ${active === i ? "is-open" : ""}`}
                key={pillar.title}
              >
                <button
                  className="pillar-trigger"
                  aria-expanded={active === i}
                  aria-controls={"pillar-" + i}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  <Icon name={pillar.icon} />
                  <span>
                    {pillar.title}
                    {i === 4 && <small>Pilar transversal</small>}
                  </span>
                  <span className="plus" aria-hidden="true">
                    {active === i ? "−" : "+"}
                  </span>
                </button>
                <div id={"pillar-" + i} hidden={active !== i}>
                  <p>{pillar.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
