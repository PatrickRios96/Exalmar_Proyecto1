import { createClient } from "@libsql/client";
import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { loadEnv } from "./env.mjs";
export async function migrate(forceLocal = false) {
  loadEnv();
  const url = forceLocal
    ? "file:./data/exalmar.db"
    : process.env.TURSO_DATABASE_URL || "file:./data/exalmar.db";
  if (
    process.env.VERCEL &&
    !url.startsWith("libsql://") &&
    !url.startsWith("https://")
  )
    throw new Error(
      "Vercel requiere TURSO_DATABASE_URL remoto. No se admite SQLite en el disco de Vercel.",
    );
  if (url.startsWith("file:")) mkdirSync("data", { recursive: true });
  const client = createClient({
    url,
    authToken: forceLocal ? undefined : process.env.TURSO_AUTH_TOKEN,
  });
  try {
    await client.execute(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, hash TEXT NOT NULL, applied_at TEXT NOT NULL)",
    );
    for (const name of readdirSync("database")
      .filter((n) => n.endsWith(".sql"))
      .sort()) {
      const sql = readFileSync("database/" + name, "utf8");
      const hash = createHash("sha256").update(sql).digest("hex");
      const applied = await client.execute({
        sql: "SELECT hash FROM _migrations WHERE name=?",
        args: [name],
      });
      if (applied.rows.length) {
        if (applied.rows[0].hash !== hash)
          throw new Error("No editar una migración ya aplicada: " + name);
        continue;
      }
      const statements = sql
        .split(";")
        .map((x) => x.trim())
        .filter(Boolean);
      await client.batch(
        [
          ...statements,
          {
            sql: "INSERT INTO _migrations (name,hash,applied_at) VALUES (?,?,?)",
            args: [name, hash, new Date().toISOString()],
          },
        ],
        "write",
      );
      console.log("Migración aplicada: " + name);
    }
    console.log(
      url.startsWith("file:")
        ? "Base local preparada."
        : "Base remota preparada.",
    );
  } finally {
    client.close();
  }
}
if (process.argv[1]?.endsWith("migrate.mjs"))
  await migrate(process.argv.includes("--local"));
