import { createHmac } from "node:crypto";
import { setSession } from "@/lib/auth";
import { validPassword } from "@/lib/session";
import { getDb } from "@/lib/db";
import { json, safe, sameOrigin, readInput } from "@/lib/http";
import { z } from "zod";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return safe(async () => {
    if (!sameOrigin(request))
      return json({ error: "Solicitud no permitida." }, 403);
    const parsed = z
      .object({
        email: z.string().trim().email().max(160),
        password: z.string().min(1).max(200),
      })
      .safeParse(await readInput(request));
    if (!parsed.success)
      return json({ error: "Ingresa un correo y contraseña válidos." }, 400);
    const email = parsed.data.email.toLowerCase();
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32)
      return json(
        { error: "La administración necesita configuración del servidor." },
        503,
      );
    const ip = process.env.VERCEL
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
    const key = createHmac("sha256", secret).update(ip).digest("hex");
    const db = getDb(),
      now = Date.now();
    const attempt = (
      await db.execute({
        sql: "SELECT * FROM login_attempts WHERE key=?",
        args: [key],
      })
    ).rows[0];
    if (
      attempt &&
      now - Number(attempt.window_start) < 900000 &&
      Number(attempt.failures) >= 5
    )
      return json({ error: "Demasiados intentos. Espera 15 minutos." }, 429);
    if (
      email !== process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
      !validPassword(parsed.data.password)
    ) {
      await db.execute({
        sql: "INSERT INTO login_attempts (key,failures,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET failures=CASE WHEN window_start<? THEN 1 ELSE failures+1 END, window_start=CASE WHEN window_start<? THEN ? ELSE window_start END",
        args: [key, now, now - 900000, now - 900000, now],
      });
      return json({ error: "Correo o contraseña incorrectos." }, 401);
    }
    await db.execute({
      sql: "DELETE FROM login_attempts WHERE key=?",
      args: [key],
    });
    return setSession(json({ success: true }), {
      kind: "admin",
      id: crypto.randomUUID(),
      email,
      expires: now + 8 * 3600000,
    });
  });
}
