import assert from "node:assert/strict";
import { loadEnv } from "../scripts/env.mjs";
import { createClient } from "@libsql/client";
loadEnv();
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw new Error("La prueba debe ejecutarse exclusivamente en localhost.");
if (!process.env.TURSO_DATABASE_URL?.startsWith("file:"))
  throw new Error("La prueba requiere una base local, nunca datos remotos.");
const jar = () => new Map();
const user = jar(),
  other = jar(),
  admin = jar();
async function request(
  path,
  {
    method = "GET",
    body,
    cookies = user,
    origin = base,
    redirect = "follow",
  } = {},
) {
  const r = await fetch(base + path, {
    method,
    redirect,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: [...cookies].map(([k, v]) => k + "=" + v).join("; "),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  for (const cookie of r.headers.getSetCookie()) {
    const pair = cookie.split(";")[0],
      i = pair.indexOf("=");
    cookies.set(pair.slice(0, i), pair.slice(i + 1));
  }
  return r;
}
assert.equal((await request("/admin", { redirect: "manual" })).status, 307);
assert.equal((await request("/api/admin/reports")).status, 403);
await request("/api/me");
await request("/api/me", { cookies: other });
const original = (await (await request("/api/catalog")).json()).products;
assert.equal(original.length, 6);
const data = {
  name: "QA local",
  email: "qa@example.test",
  type: "Calidad del producto",
  product: "jurel",
  lot: "LT-QA",
  presentation: "Prueba local",
  purchaseDate: "2026-11-18",
  description: "Reporte generado solo para validar el flujo local.",
  consent: true,
};
assert.equal(
  (
    await request("/api/reports", {
      method: "POST",
      body: data,
      origin: "https://external.invalid",
    })
  ).status,
  403,
);
assert.equal(
  (
    await request("/api/reports", {
      method: "POST",
      body: { ...data, product: "fake" },
    })
  ).status,
  400,
);
const created = await request("/api/reports", { method: "POST", body: data });
assert.equal(created.status, 201);
const { id } = await created.json();
assert.ok(
  (await (await request("/api/reports")).json()).reports.some(
    (r) => r.id === id,
  ),
);
assert.equal(
  (
    await (await request("/api/reports", { cookies: other })).json()
  ).reports.some((r) => r.id === id),
  false,
);
assert.equal(
  (
    await request("/api/auth/login", {
      method: "POST",
      cookies: admin,
      body: { email: process.env.ADMIN_EMAIL, password: "incorrect-password" },
    })
  ).status,
  401,
);
assert.equal(
  (
    await request("/api/auth/login", {
      method: "POST",
      cookies: admin,
      body: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    })
  ).status,
  200,
);
assert.equal(
  (await request("/admin", { cookies: admin, redirect: "manual" })).status,
  200,
);
assert.equal(
  (
    await request("/api/admin/reports", {
      method: "PATCH",
      cookies: admin,
      body: {
        id,
        status: "Resuelto",
        response: "Atendido en la prueba local.",
        version: 1,
      },
    })
  ).status,
  200,
);
assert.equal(
  (
    await request("/api/admin/reports", {
      method: "PATCH",
      cookies: admin,
      body: {
        id,
        status: "En revisión",
        response: "No sobrescribir",
        version: 1,
      },
    })
  ).status,
  409,
);
assert.equal(
  (await (await request("/api/reports")).json()).reports.find(
    (r) => r.id === id,
  ).response,
  "Atendido en la prueba local.",
);
const product = original.find((p) => p.id === "jurel");
assert.equal(
  (
    await request("/api/admin/catalog", {
      method: "PUT",
      cookies: admin,
      body: {
        id: "jurel",
        description: "Descripción actualizada en prueba local.",
        details: "Información QA",
        version: product.version,
      },
    })
  ).status,
  200,
);
const current = (await (await request("/api/catalog")).json()).products.find(
  (p) => p.id === "jurel",
);
assert.equal(current.details, "Información QA");
assert.equal(
  (
    await request("/api/admin/catalog", {
      method: "PUT",
      cookies: admin,
      body: {
        id: "jurel",
        description: "Edición obsoleta",
        details: "",
        version: product.version,
      },
    })
  ).status,
  409,
);
await request("/api/admin/catalog", {
  method: "PUT",
  cookies: admin,
  body: {
    id: "jurel",
    description: product.description,
    details: product.details,
    version: current.version,
  },
});
const db = createClient({ url: process.env.TURSO_DATABASE_URL });
const persisted = await db.execute({
  sql: "SELECT status FROM reports WHERE id=?",
  args: [id],
});
assert.equal(persisted.rows[0].status, "Resuelto");
db.close();
assert.equal(
  (
    await request("/api/auth/logout", {
      method: "POST",
      cookies: admin,
      body: {},
    })
  ).status,
  200,
);
assert.equal(
  (await request("/api/admin/reports", { cookies: admin })).status,
  403,
);
console.log(
  "Flujo localhost OK: formulario, guardado SQLite, aislamiento de visitantes, login, /admin, respuestas, catálogo, conflictos y cierre de sesión.",
);
