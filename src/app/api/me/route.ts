import { getVisitor, isAdmin, setSession } from "@/lib/auth";
import { json, safe } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return safe(async () => {
    const visitor = await getVisitor(),
      admin = await isAdmin();
    return setSession(
      json({
        admin,
        name: admin ? "Administrador" : "",
        email: admin ? process.env.ADMIN_EMAIL || "" : "",
      }),
      visitor,
    );
  });
}
