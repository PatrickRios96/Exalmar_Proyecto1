import fs from "node:fs";
import { randomBytes } from "node:crypto";
import { migrate } from "./migrate.mjs";
if (process.env.VERCEL) throw new Error("Usar predev únicamente en local.");
if (!fs.existsSync(".env.local")) {
  const password = "Local-" + randomBytes(12).toString("base64url");
  fs.writeFileSync(
    ".env.local",
    `TURSO_DATABASE_URL=file:./data/exalmar.db\nTURSO_AUTH_TOKEN=\nADMIN_EMAIL=admin@exalmar.local\nADMIN_PASSWORD=${password}\nSESSION_SECRET=${randomBytes(48).toString("base64url")}\nNEXT_PUBLIC_SITE_URL=http://localhost:3000\n`,
    { mode: 0o600 },
  );
  console.log("Configuración local creada. Usuario: admin@exalmar.local");
  console.log("Clave local de administración: " + password);
  console.log("Puedes consultarla nuevamente con npm run admin:info.");
}
await migrate();
