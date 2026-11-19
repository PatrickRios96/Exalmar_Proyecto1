import { z } from "zod";
import { defaultCatalog } from "../content/catalog";
export const reportTypes = [
  "Calidad del producto",
  "Datos adicionales del producto",
  "Otra consulta de producto",
] as const;
export const statuses = ["Recibido", "En revisión", "Resuelto"] as const;
const clean = (max: number) => z.string().trim().min(1).max(max);
export const reportInput = z.object({
  name: clean(120),
  email: z.string().trim().email().max(160),
  type: z.enum(reportTypes),
  product: z
    .string()
    .refine((x) => defaultCatalog.some((p) => p.id === x), "Producto inválido"),
  lot: z.string().trim().max(100).default(""),
  presentation: z.string().trim().max(160).default(""),
  purchaseDate: z
    .string()
    .refine(
      (x) =>
        !x ||
        (/^\d{4}-\d{2}-\d{2}$/.test(x) &&
          !Number.isNaN(Date.parse(x)) &&
          new Date(x + "T00:00:00Z").toISOString().slice(0, 10) === x),
      "Fecha inválida",
    )
    .default(""),
  description: clean(4000).refine(
    (x) => x.length >= 10,
    "Incluye al menos 10 caracteres",
  ),
  consent: z.literal(true),
});
export const reportUpdate = z.object({
  id: z.string().uuid(),
  status: z.enum(statuses),
  response: z.string().trim().max(4000),
  version: z.number().int().positive(),
});
export const catalogUpdate = z.object({
  id: z.string().refine((x) => defaultCatalog.some((p) => p.id === x)),
  description: clean(1000),
  details: z.string().trim().max(2000),
  version: z.number().int().nonnegative(),
});
