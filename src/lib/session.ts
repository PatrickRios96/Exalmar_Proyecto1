import {
  createHmac,
  randomUUID,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export interface Session {
  kind: "visitor" | "admin";
  id: string;
  email?: string;
  expires: number;
}
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32)
    throw new Error("SESSION_SECRET debe contener al menos 32 caracteres.");
  return value;
}
export function signSession(session: Session) {
  const body = Buffer.from(JSON.stringify(session)).toString("base64url");
  return (
    body + "." + createHmac("sha256", secret()).update(body).digest("base64url")
  );
}
export function verifySession(
  token: string | undefined,
  kind: Session["kind"],
): Session | null {
  if (!token) return null;
  try {
    const [body, signature, ...rest] = token.split(".");
    if (!body || !signature || rest.length) return null;
    const expected = createHmac("sha256", secret()).update(body).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const value = JSON.parse(
      Buffer.from(body, "base64url").toString(),
    ) as Session;
    return value.kind === kind &&
      typeof value.id === "string" &&
      typeof value.expires === "number" &&
      value.expires > Date.now()
      ? value
      : null;
  } catch {
    return null;
  }
}
export const newVisitor = (): Session => ({
  kind: "visitor",
  id: randomUUID(),
  expires: Date.now() + 30 * 86400000,
});
export function validPassword(input: string) {
  const wanted = process.env.ADMIN_PASSWORD;
  if (!wanted || wanted.length < 16) return false;
  return timingSafeEqual(
    createHash("sha256").update(input).digest(),
    createHash("sha256").update(wanted).digest(),
  );
}
