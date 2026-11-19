import { defaultCatalog } from "@/content/catalog";
import { getDb } from "@/lib/db";
import { json, safe } from "@/lib/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return safe(async () => {
    const { rows } = await getDb().execute("SELECT * FROM catalog");
    return json({
      products: defaultCatalog.map((p) => ({
        ...p,
        ...rows.find((r) => r.id === p.id),
      })),
    });
  });
}
