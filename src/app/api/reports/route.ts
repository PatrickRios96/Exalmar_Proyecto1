import { getDb } from "@/lib/db";
import { getVisitor, setSession } from "@/lib/auth";
import { json, readInput, safe, sameOrigin } from "@/lib/http";
import { reportInput } from "@/lib/validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return safe(async () => {
    const visitor = await getVisitor();
    const { rows } = await getDb().execute({
      sql: "SELECT id,type,product,lot,presentation,purchase_date,description,status,response,created_at,updated_at,version FROM reports WHERE user_id=? ORDER BY created_at DESC LIMIT 200",
      args: [visitor.id],
    });
    return setSession(json({ reports: rows }), visitor);
  });
}
export async function POST(request: Request) {
  return safe(async () => {
    if (!sameOrigin(request))
      return json({ error: "Solicitud no permitida." }, 403);
    const parsed = reportInput.safeParse(await readInput(request));
    if (!parsed.success)
      return json(
        {
          error: "Revisa los datos obligatorios del formulario.",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    const p = parsed.data,
      visitor = await getVisitor(),
      db = getDb(),
      now = new Date().toISOString();
    const recent = await db.execute({
      sql: "SELECT count(*) AS total FROM reports WHERE user_id=? AND created_at>?",
      args: [visitor.id, new Date(Date.now() - 60000).toISOString()],
    });
    if (Number(recent.rows[0].total) >= 5)
      return json(
        { error: "Espera un minuto antes de registrar otra solicitud." },
        429,
      );
    const id = crypto.randomUUID();
    await db.execute({
      sql: "INSERT INTO reports (id,user_id,name,email,type,product,lot,presentation,purchase_date,description,status,response,created_at,updated_at,version) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)",
      args: [
        id,
        visitor.id,
        p.name,
        p.email,
        p.type,
        p.product,
        p.lot,
        p.presentation,
        p.purchaseDate,
        p.description,
        "Recibido",
        "",
        now,
        now,
      ],
    });
    return setSession(json({ id, status: "Recibido" }, 201), visitor);
  });
}
