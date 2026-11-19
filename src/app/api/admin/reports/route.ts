import { isAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { json, safe, sameOrigin, readInput } from "@/lib/http";
import { reportUpdate } from "@/lib/validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return safe(async () => {
    if (!(await isAdmin()))
      return json({ error: "Acceso reservado a administración." }, 403);
    const { rows } = await getDb().execute(
      "SELECT * FROM reports ORDER BY created_at DESC LIMIT 500",
    );
    return json({ reports: rows });
  });
}
export async function PATCH(r: Request) {
  return safe(async () => {
    if (!sameOrigin(r) || !(await isAdmin()))
      return json({ error: "Acceso no permitido." }, 403);
    const p = reportUpdate.safeParse(await readInput(r));
    if (!p.success) return json({ error: "Datos inválidos." }, 400);
    const v = p.data;
    const result = await getDb().execute({
      sql: "UPDATE reports SET status=?,response=?,updated_at=?,version=version+1 WHERE id=? AND version=?",
      args: [v.status, v.response, new Date().toISOString(), v.id, v.version],
    });
    return result.rowsAffected
      ? json({ saved: true })
      : json(
          {
            error:
              "Otra sesión modificó esta solicitud. Recarga antes de guardar.",
          },
          409,
        );
  });
}
