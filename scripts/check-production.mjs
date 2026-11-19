if (process.env.VERCEL) {
  const required = [
    "TURSO_DATABASE_URL",
    "TURSO_AUTH_TOKEN",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD",
    "SESSION_SECRET",
  ];
  for (const key of required) {
    const value = process.env[key];
    if (!value || value.includes("REEMPLAZAR"))
      throw new Error("Configura " + key + " en Vercel antes de publicar.");
  }
  if ((process.env.ADMIN_PASSWORD || "").length < 16)
    throw new Error("ADMIN_PASSWORD requiere al menos 16 caracteres.");
  if ((process.env.SESSION_SECRET || "").length < 32)
    throw new Error("SESSION_SECRET requiere al menos 32 caracteres.");
  if (!/^libsql:\/\/|^https:\/\//.test(process.env.TURSO_DATABASE_URL || ""))
    throw new Error("TURSO_DATABASE_URL debe apuntar a una base remota.");
}
