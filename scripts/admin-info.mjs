import { loadEnv } from "./env.mjs";
loadEnv();
if (process.env.VERCEL || !process.env.TURSO_DATABASE_URL?.startsWith("file:"))
  throw new Error("Esta utilidad solo muestra credenciales del entorno local.");
console.log("Correo: " + process.env.ADMIN_EMAIL);
console.log("Clave local: " + process.env.ADMIN_PASSWORD);
