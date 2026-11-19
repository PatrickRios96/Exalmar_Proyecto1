import { createClient, type Client } from "@libsql/client";
let client: Client | undefined;
export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || "file:./data/exalmar.db";
    if (process.env.VERCEL && url.startsWith("file:"))
      throw new Error("Configura una base remota para Vercel.");
    client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  return client;
}
