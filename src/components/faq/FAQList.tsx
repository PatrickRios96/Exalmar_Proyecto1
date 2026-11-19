"use client";
import Link from "next/link";
import { useState } from "react";
import { faqs } from "@/content/institutional";
import Icon from "../ui/Icon";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function FAQList() {
  const [query, setQuery] = useState(""),
    [filter, setFilter] = useState("Todas");
  const rows = faqs.filter(
    (f) =>
      (filter === "Todas" || f.category === filter) &&
      normalize(f.q + " " + f.a).includes(normalize(query)),
  );
  return (
    <section className="section shell faq-section">
      <label className="searchbox">
        <Icon name="search" />
        <span className="sr-only">Buscar preguntas frecuentes</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué te gustaría saber?"
        />
      </label>
      <div className="filters" role="group" aria-label="Filtrar por tema">
        {["Todas", "Empresa", "Productos", "Sostenibilidad", "Soporte"].map(
          (c) => (
            <button
              type="button"
              key={c}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ),
        )}
      </div>
      <p className="result-count" role="status">
        {rows.length} preguntas encontradas
      </p>
      {rows.length ? (
        rows.map((f) => (
          <details className="faq-item" key={f.q}>
            <summary>
              <span>{f.q}</span>
              <span className="plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))
      ) : (
        <div className="empty-state">
          No encontramos esa consulta. Prueba con otra palabra.
        </div>
      )}
      <div className="faq-help">
        <Icon name="help" />
        <h2>¿Tu consulta es diferente?</h2>
        <p>Estamos para orientarte.</p>
        <Link className="button blue" href="/soporte">
          Contactar a soporte
        </Link>
      </div>
    </section>
  );
}
