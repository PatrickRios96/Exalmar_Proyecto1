import { z } from "zod";
import { defaultCatalog } from "../content/catalog";
import {
  reportInput,
  reportUpdate,
  catalogUpdate,
  statuses,
  reportTypes,
} from "./validation";
import type { Product, ReportRecord } from "./types";
const REPORTS_KEY = "exalmar.demo.reports.v1",
  PRODUCTS_KEY = "exalmar.demo.products.v1";
const productSchema = z.object({
  id: z.string().refine((x) => defaultCatalog.some((p) => p.id === x)),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  details: z.string(),
  version: z.number().int().nonnegative(),
  updated_at: z.string().optional(),
});
const reportSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  type: z.enum(reportTypes),
  product: z.string(),
  lot: z.string(),
  presentation: z.string(),
  purchase_date: z.string(),
  description: z.string(),
  status: z.enum(statuses),
  response: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number().int().positive(),
});
function read<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    throw new Error(
      "El navegador no permite guardar datos locales. Habilita el almacenamiento para usar esta demostración.",
    );
  }
  if (!raw) return fallback;
  try {
    return schema.parse(JSON.parse(raw));
  } catch {
    throw new Error(
      "Los datos locales no se pudieron leer. No se modificaron. Prueba la página en otro navegador.",
    );
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined")
    throw new Error("El guardado local solo está disponible en el navegador.");
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new Error(
      "No se pudo guardar. El almacenamiento del navegador está bloqueado o no tiene espacio.",
    );
  }
}
export function getProducts(): Product[] {
  const saved = read(PRODUCTS_KEY, z.array(productSchema), []);
  return defaultCatalog.map((p) => ({
    ...p,
    ...saved.find((v) => v.id === p.id),
  }));
}
export function getReports(): ReportRecord[] {
  return read(REPORTS_KEY, z.array(reportSchema), []).sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );
}
export function saveReport(value: unknown): ReportRecord {
  const parsed = reportInput.safeParse(value);
  if (!parsed.success) throw new Error("Revisa los campos del formulario.");
  const p = parsed.data,
    now = new Date().toISOString();
  const report: ReportRecord = {
    id: crypto.randomUUID(),
    name: p.name,
    email: p.email,
    type: p.type,
    product: p.product,
    lot: p.lot,
    presentation: p.presentation,
    purchase_date: p.purchaseDate,
    description: p.description,
    status: "Recibido",
    response: "",
    created_at: now,
    updated_at: now,
    version: 1,
  };
  write(REPORTS_KEY, [report, ...getReports()]);
  return report;
}
export function updateReport(value: unknown) {
  const parsed = reportUpdate.safeParse(value);
  if (!parsed.success) throw new Error("Datos de actualización inválidos.");
  const p = parsed.data,
    rows = getReports(),
    current = rows.find((r) => r.id === p.id);
  if (!current)
    throw new Error("No se encontró la solicitud en este navegador.");
  if (current.version !== p.version)
    throw new Error(
      "La solicitud cambió en otra pestaña. Cierra la edición y actualiza la lista.",
    );
  write(
    REPORTS_KEY,
    rows.map((r) =>
      r.id === p.id
        ? {
            ...r,
            status: p.status,
            response: p.response,
            updated_at: new Date().toISOString(),
            version: r.version + 1,
          }
        : r,
    ),
  );
}
export function updateProduct(value: unknown) {
  const parsed = catalogUpdate.safeParse(value);
  if (!parsed.success) throw new Error("Datos del producto inválidos.");
  const p = parsed.data,
    products = getProducts(),
    current = products.find((v) => v.id === p.id)!;
  if (current.version !== p.version)
    throw new Error(
      "El producto cambió en otra pestaña. Selecciónalo nuevamente antes de guardar.",
    );
  write(
    PRODUCTS_KEY,
    products.map((v) =>
      v.id === p.id
        ? {
            ...v,
            description: p.description,
            details: p.details,
            version: v.version + 1,
            updated_at: new Date().toISOString(),
          }
        : v,
    ),
  );
}
