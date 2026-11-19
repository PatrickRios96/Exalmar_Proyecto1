import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getProducts,
  getReports,
  saveReport,
  updateReport,
  updateProduct,
} from "../src/lib/browser-store";
const memory = new Map<string, string>();
const storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
};
Object.defineProperty(globalThis, "window", {
  value: { localStorage: storage },
  configurable: true,
});
test("local reports and product edits persist and reject stale versions", () => {
  memory.clear();
  assert.equal(getProducts().length, 6);
  assert.equal(getReports().length, 0);
  const report = saveReport({
    name: "Prueba",
    email: "qa@example.test",
    type: "Calidad del producto",
    product: "jurel",
    description: "Observación local de prueba.",
    consent: true,
  });
  assert.equal(getReports()[0].id, report.id);
  updateReport({
    id: report.id,
    status: "Resuelto",
    response: "Respuesta de prueba",
    version: 1,
  });
  assert.equal(getReports()[0].response, "Respuesta de prueba");
  assert.throws(
    () =>
      updateReport({
        id: report.id,
        status: "En revisión",
        response: "",
        version: 1,
      }),
    /otra pestaña/,
  );
  updateProduct({
    id: "jurel",
    description: "Actualizado",
    details: "Dato local",
    version: 0,
  });
  assert.equal(
    getProducts().find((p) => p.id === "jurel")?.details,
    "Dato local",
  );
  assert.throws(
    () =>
      updateProduct({
        id: "jurel",
        description: "Antiguo",
        details: "",
        version: 0,
      }),
    /otra pestaña/,
  );
  memory.clear();
  assert.equal(getReports().length, 0);
  assert.equal(getProducts().find((p) => p.id === "jurel")?.version, 0);
});
test("corrupt local data is not overwritten", () => {
  memory.set("exalmar.demo.reports.v1", "bad-json");
  assert.throws(getReports, /no se pudieron leer/);
  assert.equal(memory.get("exalmar.demo.reports.v1"), "bad-json");
  memory.clear();
});
test("blocked storage produces a useful error", () => {
  const original = storage.setItem;
  storage.setItem = () => {
    throw new Error("blocked");
  };
  assert.throws(
    () =>
      saveReport({
        name: "Prueba",
        email: "qa@example.test",
        type: "Calidad del producto",
        product: "jurel",
        description: "Observación local de prueba.",
        consent: true,
      }),
    /No se pudo guardar/,
  );
  storage.setItem = original;
});
