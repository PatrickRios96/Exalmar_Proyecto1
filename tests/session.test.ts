import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newVisitor,
  signSession,
  verifySession,
  validPassword,
} from "../src/lib/session";
process.env.SESSION_SECRET = "test-secret-32-characters-or-longer-0123456789";
process.env.ADMIN_PASSWORD = "Only-for-test-password-2026!";
test("signed visitor sessions reject tampering, wrong roles and expiry", () => {
  const session = newVisitor(),
    token = signSession(session);
  assert.equal(verifySession(token, "visitor")?.id, session.id);
  assert.equal(verifySession(token + "a", "visitor"), null);
  assert.equal(verifySession(token, "admin"), null);
  assert.equal(
    verifySession(
      signSession({ ...session, expires: Date.now() - 1 }),
      "visitor",
    ),
    null,
  );
  assert.equal(verifySession("malformed", "visitor"), null);
});
test("admin password comparison rejects incorrect credentials", () => {
  assert.equal(validPassword("Only-for-test-password-2026!"), true);
  assert.equal(validPassword("wrong"), false);
});
