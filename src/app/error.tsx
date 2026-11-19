"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section shell">
      <h1>No pudimos cargar esta sección.</h1>
      <p>Comprueba la configuración e inténtalo nuevamente.</p>
      <button className="button blue" onClick={reset}>
        Reintentar
      </button>
    </section>
  );
}
