"use client";
import {
  getProducts,
  getReports,
  updateReport as saveReportChanges,
  updateProduct as saveProductChanges,
} from "@/lib/browser-store";
import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { formatDate, signalUpdate } from "@/lib/client";
import { useAutoRefresh } from "@/lib/use-refresh";
import type { Product, ReportRecord } from "@/lib/types";
import Icon from "../ui/Icon";
export default function AdminPanel() {
  const [tab, setTab] = useState<"reports" | "catalog">("reports"),
    [reports, setReports] = useState<ReportRecord[]>([]),
    [products, setProducts] = useState<Product[]>([]),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState(""),
    [feedback, setFeedback] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  const [reportDraft, setReportDraft] = useState<ReportRecord | null>(null),
    [productDraft, setProductDraft] = useState<Product | null>(null);
  const loadReports = useCallback(async () => {
    setReports(getReports());
  }, []);
  const loadCatalog = useCallback(async () => {
    const catalog = getProducts();
    setProducts(catalog);
    return catalog;
  }, []);
  useEffect(() => {
    Promise.all([loadReports(), loadCatalog()])
      .then(([, catalog]) => setProductDraft(catalog[0]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadReports, loadCatalog]);
  useAutoRefresh(() => {
    if (!reportDraft) void loadReports().catch((err) => setError(err.message));
  });
  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name || id;
  const visible = reports.filter(
    (r) =>
      (!filter || r.status === filter) &&
      [r.id, r.name, r.email, productName(r.product)]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  async function updateReport(event: FormEvent) {
    event.preventDefault();
    if (!reportDraft) return;
    setBusy(true);
    setError("");
    try {
      saveReportChanges({
        id: reportDraft.id,
        status: reportDraft.status,
        response: reportDraft.response,
        version: reportDraft.version,
      });
      setReportDraft(null);
      setFeedback(
        "Solicitud local actualizada. Puedes revisar el resultado en Soporte desde este navegador.",
      );
      await loadReports();
      signalUpdate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function updateProduct(event: FormEvent) {
    event.preventDefault();
    if (!productDraft) return;
    setBusy(true);
    setError("");
    try {
      saveProductChanges({
        id: productDraft.id,
        description: productDraft.description,
        details: productDraft.details,
        version: productDraft.version,
      });
      const updated = await loadCatalog();
      setProductDraft(updated.find((p) => p.id === productDraft.id)!);
      setFeedback(
        "Cambios guardados en este navegador. Inicio y Soporte se actualizan localmente.",
      );
      signalUpdate();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="shell section admin-section">
      <div className="demo-notice">
        <strong>Panel local de demostración</strong>
        <p>
          Sin autenticación ni datos compartidos. Solo puedes ver y modificar lo
          guardado en este navegador. Los cambios no se publican para otros
          visitantes.
        </p>
      </div>
      <div className="admin-intro">
        <div>
          <span className="eyebrow">ADMINISTRACIÓN</span>
          <h1>Productos y solicitudes.</h1>
          <p>
            Prueba la gestión de reportes y la edición de productos con datos
            locales.
          </p>
        </div>
        <Link className="button blue" href="/soporte">
          Ver formulario
        </Link>
      </div>
      <div
        className="admin-tabs"
        role="group"
        aria-label="Secciones de administración"
      >
        <button
          onClick={() => setTab("reports")}
          aria-pressed={tab === "reports"}
        >
          Solicitudes recibidas
        </button>
        <button
          onClick={() => setTab("catalog")}
          aria-pressed={tab === "catalog"}
        >
          Información de productos
        </button>
      </div>
      <p className="live-feedback" role="status">
        {feedback}
      </p>
      {error && (
        <p className="status-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="panel-loading">Cargando administración…</p>
      ) : tab === "reports" ? (
        <>
          <div className="admin-toolbar">
            <label className="searchbox">
              <Icon name="search" />
              <span className="sr-only">Buscar solicitudes</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por código, contacto o producto"
              />
            </label>
            <label className="sr-only" htmlFor="status-filter">
              Estado de solicitud
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              {["Recibido", "En revisión", "Resuelto"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              className="small-button"
              disabled={!!reportDraft}
              onClick={() =>
                loadReports().catch((err) => setError(err.message))
              }
            >
              Actualizar
            </button>
          </div>
          <p className="muted">{visible.length} solicitudes locales</p>
          {visible.length ? (
            <div
              className="table-wrap"
              role="region"
              aria-label="Solicitudes recibidas"
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    <th>Solicitud</th>
                    <th>Contacto</th>
                    <th>Producto</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.type}</strong>
                        <small>{formatDate(r.created_at)}</small>
                        <small>{r.id}</small>
                      </td>
                      <td>
                        {r.name}
                        <small>{r.email}</small>
                      </td>
                      <td>
                        {productName(r.product)}
                        <small>Lote: {r.lot || "No indicado"}</small>
                      </td>
                      <td>
                        <span className="badge">{r.status}</span>
                      </td>
                      <td>
                        <button
                          className="small-button"
                          onClick={() => {
                            setReportDraft({ ...r });
                            setFeedback("");
                            setError("");
                          }}
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              No hay solicitudes con estos filtros.
            </div>
          )}
          {reportDraft && (
            <form className="editor-card" onSubmit={updateReport}>
              <div className="history-head">
                <h2>Gestionar solicitud</h2>
                <button
                  type="button"
                  className="small-button"
                  onClick={() => setReportDraft(null)}
                >
                  Cerrar
                </button>
              </div>
              <p className="reference">Código: {reportDraft.id}</p>
              <p>
                <strong>{productName(reportDraft.product)}</strong> ·{" "}
                {reportDraft.type}
              </p>
              <p className="preline">{reportDraft.description}</p>
              <p>
                Lote: {reportDraft.lot || "No indicado"} · Presentación:{" "}
                {reportDraft.presentation || "No indicada"} · Fecha de compra:{" "}
                {reportDraft.purchase_date || "No indicada"}
              </p>
              <label htmlFor="edit-status">
                Estado
                <select
                  id="edit-status"
                  value={reportDraft.status}
                  onChange={(e) =>
                    setReportDraft({ ...reportDraft, status: e.target.value })
                  }
                >
                  {["Recibido", "En revisión", "Resuelto"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Respuesta al solicitante
                <textarea
                  rows={5}
                  maxLength={4000}
                  value={reportDraft.response}
                  onChange={(e) =>
                    setReportDraft({ ...reportDraft, response: e.target.value })
                  }
                />
              </label>
              <p className="muted">
                La respuesta se muestra en Mis solicitudes. No se envía un
                correo automático.
              </p>
              <button className="button blue" disabled={busy}>
                {busy ? "Guardando…" : "Guardar cambios"}
              </button>
            </form>
          )}
        </>
      ) : (
        <>
          <p className="muted">
            Al guardar, la información se refleja en Inicio y Soporte de este
            navegador. No se comparte entre dispositivos.
          </p>
          <div className="catalog-editor-grid">
            <nav aria-label="Seleccionar producto">
              {products.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={productDraft?.id === p.id}
                  onClick={() => {
                    setProductDraft({ ...p });
                    setFeedback("");
                    setError("");
                  }}
                >
                  {p.name}
                </button>
              ))}
            </nav>
            {productDraft && (
              <form onSubmit={updateProduct}>
                <label>
                  Producto
                  <input value={productDraft.name} readOnly />
                </label>
                <label>
                  Descripción *
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    value={productDraft.description}
                    onChange={(e) =>
                      setProductDraft({
                        ...productDraft,
                        description: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Información adicional
                  <textarea
                    rows={5}
                    maxLength={2000}
                    value={productDraft.details}
                    onChange={(e) =>
                      setProductDraft({
                        ...productDraft,
                        details: e.target.value,
                      })
                    }
                  />
                </label>
                <p className="muted">
                  Publica solo información validada por Exalmar.
                </p>
                <button className="button blue" disabled={busy}>
                  {busy ? "Guardando…" : "Guardar cambios locales"}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </section>
  );
}
