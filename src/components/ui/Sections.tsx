import Link from "next/link";
import type { ReactNode } from "react";
import Icon from "./Icon";
export function PageHero({
  tag,
  title,
  description,
}: {
  tag: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="shell">
        <p className="breadcrumbs">
          <Link href="/">Inicio</Link> / {tag}
        </p>
        <span className="eyebrow">{tag}</span>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
    </section>
  );
}
export function SectionHead({
  tag,
  title,
  description,
}: {
  tag: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{tag}</span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ContactCTA() {
  return (
    <section className="cta">
      <div className="shell cta-inner">
        <div>
          <Icon name="mail" />
          <h2>
            Conversemos.
            <br />
            <span>Estamos para ayudarte.</span>
          </h2>
        </div>
        <Link className="button white" href="/soporte">
          Contactar a soporte
        </Link>
      </div>
    </section>
  );
}
