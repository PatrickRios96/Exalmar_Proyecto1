import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { defaultCatalog } from "@/content/catalog";
import { json, safe, sameOrigin, readInput } from "@/lib/http";
import { catalogUpdate } from "@/lib/validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PUT(r: Request) {
  return safe(async () => {
    if (!sameOrigin(r) || !(await isAdmin()))
      return json({ error: "Acceso no permitido." }, 403);
    const parsed = catalogUpdate.safeParse(await readInput(r));
    if (!parsed.success) return json({ error: "Datos inválidos." }, 400);
    const p = parsed.data,
      base = defaultCatalog.find((x) => x.id === p.id)!;
    const now = new Date().toISOString();
    const result = await getDb().execute(
      p.version === 0
        ? {
            sql: "INSERT INTO catalog (id,name,category,description,details,updated_at,version) VALUES (?,?,?,?,?,?,1) ON CONFLICT(id) DO NOTHING",
            args: [
              p.id,
              base.name,
              base.category,
              p.description,
              p.details,
              now,
            ],
          }
        : {
            sql: "UPDATE catalog SET description=?,details=?,updated_at=?,version=version+1 WHERE id=? AND version=?",
            args: [p.description, p.details, now, p.id, p.version],
          },
    );
    return result.rowsAffected
      ? json({ saved: true })
      : json(
          {
            error:
              "Otra sesión modificó este producto. Recarga antes de guardar.",
          },
          409,
        );
  });
}
