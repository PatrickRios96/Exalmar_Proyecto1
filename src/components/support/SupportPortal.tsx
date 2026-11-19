"use client";
import { getProducts, getReports, saveReport } from "@/lib/browser-store";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Icon from "../ui/Icon";
import { formatDate, signalUpdate } from "@/lib/client";
import { useAutoRefresh } from "@/lib/use-refresh";
import type { Product, ReportRecord } from "@/lib/types";
export default function SupportPortal({
  initialProduct = "",
}: {
  initialProduct?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]),
    [reports, setReports] = useState<ReportRecord[]>([]),
    [product, setProduct] = useState(initialProduct),
    [feedback, setFeedback] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true);
  const form = useRef<HTMLFormElement>(null),
    status = useRef<HTMLParagraphElement>(null);
  const current = products.find((p) => p.id === product);
  const load = useCallback(async () => {
    try {
      setProducts(getProducts());
      setReports(getReports());
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    setProduct(
      new URLSearchParams(window.location.search).get("producto") ||
        initialProduct,
    );
  }, [load, initialProduct]);
  useAutoRefresh(load);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("Guardando solicitud…");
    const data = new FormData(event.currentTarget);
    try {
      const result = saveReport({
        ...Object.fromEntries(data),
        consent: data.get("consent") === "on",
      });
      form.current?.reset();
      setProduct("");
      setFeedback(
        `Solicitud guardada en este navegador. Código: ${result.id}. Consulta su estado en Mis solicitudes.`,
      );
      await load();
      signalUpdate();
    } catch (err) {
      setFeedback((err as Error).message);
    } finally {
      setBusy(false);
      status.current?.focus();
    }
  }
  return (
    <section className="section shell support-grid">
      <aside>
        <div className="contact-card">
          <Icon name="mail" />
          <h2>Tu reporte importa.</h2>
          <p>
            Registra consultas de calidad y solicita información adicional sobre
            nuestros productos.
          </p>
          <a href="mailto:prios@exalmar.com.pe">prios@exalmar.com.pe</a>
        </div>
        <div className="tip">
          <Icon name="help" />
          <div>
            <h3>Ayúdanos a identificar el producto.</h3>
            <p>
              Incluye lote, presentación y fecha de compra si cuentas con ellos.
            </p>
            <Link href="/faq">Consultar preguntas frecuentes</Link>
          </div>
        </div>
      </aside>
      <div>
        <form ref={form} onSubmit={submit}>
          <h2>Registrar solicitud</h2>
          <p className="muted">
            Los campos con * son obligatorios. Este formulario de demostración
            guarda los datos únicamente en este navegador; no los envía a
            Exalmar.
          </p>
          <div className="form-row">
            <label>
              Nombre completo *
              <input name="name" autoComplete="name" required maxLength={120} />
            </label>
            <label>
              Correo de contacto *
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={160}
              />
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="report-type">
              Tipo de solicitud *
              <select id="report-type" name="type" required defaultValue="">
                <option value="">Selecciona un tipo</option>
                <option>Calidad del producto</option>
                <option>Datos adicionales del producto</option>
                <option>Otra consulta de producto</option>
              </select>
            </label>
            <label htmlFor="report-product">
              Producto *
              <select
                id="report-product"
                name="product"
                required
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                disabled={!products.length}
              >
                <option value="">
                  {loading ? "Cargando productos…" : "Selecciona un producto"}
                </option>
                {products.map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {current && (
            <div className="product-info" aria-live="polite">
              <strong>{current.name}</strong>
              <p>{current.description}</p>
              <small>{current.details}</small>
            </div>
          )}
          <div className="form-row">
            <label>
              Lote
              <input
                name="lot"
                maxLength={100}
                placeholder="Ej.: LT-2026-001"
              />
            </label>
            <label>
              Presentación
              <input
                name="presentation"
                maxLength={160}
                placeholder="Ej.: congelado, caja de 10 kg"
              />
            </label>
          </div>
          <label>
            Fecha de compra
            <input name="purchaseDate" type="date" />
          </label>
          <label>
            Descripción de la solicitud *
            <textarea
              name="description"
              rows={6}
              required
              minLength={10}
              maxLength={4000}
              placeholder="Describe la observación o información adicional que necesitas."
            />
          </label>
          <label className="checkbox">
            <input name="consent" type="checkbox" required />
            <span>
              Acepto guardar estos datos en mi navegador para probar este
              formulario. He revisado la{" "}
              <a
                href="https://www.exalmar.com.pe/politica-de-privacidad/"
                target="_blank"
                rel="noopener"
              >
                política de privacidad del sitio oficial
              </a>
              .
            </span>
          </label>
          <p ref={status} className="live-feedback" role="status" tabIndex={-1}>
            {feedback}
          </p>
          <button
            className="button blue"
            type="submit"
            disabled={busy || !products.length}
          >
            <Icon name="check" />
            {busy ? "Guardando…" : "Guardar solicitud local"}
          </button>
        </form>
        <section className="history">
          <div className="history-head">
            <h2>Mis solicitudes</h2>
            <button className="small-button" onClick={load}>
              Actualizar
            </button>
          </div>
          <p className="muted">
            El estado y las respuestas se actualizan automáticamente. Este
            historial corresponde a este navegador.
          </p>
          {error && (
            <p role="alert" className="status-error">
              {error}
            </p>
          )}
          {loading ? (
            <p>Cargando solicitudes…</p>
          ) : reports.length ? (
            reports.map((r) => (
              <details className="report-item" key={r.id}>
                <summary>
                  <span>
                    <strong>
                      {products.find((p) => p.id === r.product)?.name ||
                        r.product}
                    </strong>
                    <small>
                      {r.type} · {formatDate(r.created_at)}
                    </small>
                  </span>
                  <span className="badge">{r.status}</span>
                </summary>
                <div className="report-detail">
                  <p className="reference">Código: {r.id}</p>
                  <p>{r.description}</p>
                  <p>
                    Lote: {r.lot || "No indicado"} · Presentación:{" "}
                    {r.presentation || "No indicada"}
                  </p>
                  {r.response ? (
                    <div className="response">
                      <strong>Respuesta de administración</strong>
                      <p>{r.response}</p>
                    </div>
                  ) : (
                    <p className="muted">
                      Tu solicitud está pendiente de respuesta.
                    </p>
                  )}
                </div>
              </details>
            ))
          ) : (
            !error && (
              <div className="empty-state">
                Aún no tienes solicitudes. Registra la primera desde el
                formulario.
              </div>
            )
          )}
        </section>
      </div>
    </section>
  );
}
