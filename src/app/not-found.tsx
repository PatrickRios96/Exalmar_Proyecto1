import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section shell">
      <span className="eyebrow">PÁGINA NO ENCONTRADA</span>
      <h1>No encontramos esta página.</h1>
      <p>Revisa la dirección o vuelve al inicio.</p>
      <Link className="button blue" href="/">
        Volver a Inicio
      </Link>
    </section>
  );
}
