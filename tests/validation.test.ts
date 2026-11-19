import { test } from "node:test";
import assert from "node:assert/strict";
import {
  reportInput,
  catalogUpdate,
  reportUpdate,
} from "../src/lib/validation";
const good = {
  name: "QA",
  email: "qa@example.test",
  type: "Calidad del producto",
  product: "jurel",
  description: "Revisión local de producto.",
  consent: true,
};
test("report schema validates product, contact, consent and calendar date", () => {
  assert.equal(reportInput.safeParse(good).success, true);
  for (const changes of [
    { email: "invalid" },
    { product: "inventado" },
    { consent: false },
    { description: "corto" },
    { purchaseDate: "2026-02-31" },
    { purchaseDate: "2026-13-01" },
  ])
    assert.equal(reportInput.safeParse({ ...good, ...changes }).success, false);
});
test("administrative schemas require allowed status and version", () => {
  assert.equal(
    reportUpdate.safeParse({
      id: crypto.randomUUID(),
      status: "Resuelto",
      response: "OK",
      version: 1,
    }).success,
    true,
  );
  assert.equal(
    reportUpdate.safeParse({
      id: crypto.randomUUID(),
      status: "Borrado",
      response: "",
      version: 1,
    }).success,
    false,
  );
  assert.equal(
    catalogUpdate.safeParse({
      id: "jurel",
      description: "Prueba",
      details: "",
      version: 0,
    }).success,
    true,
  );
  assert.equal(
    catalogUpdate.safeParse({
      id: "jurel",
      description: "",
      details: "",
      version: 0,
    }).success,
    false,
  );
});
