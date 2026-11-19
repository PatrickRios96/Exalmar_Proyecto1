import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  newVisitor,
  signSession,
  verifySession,
  type Session,
} from "./session";
export const VISITOR_COOKIE = "exalmar_visitor",
  ADMIN_COOKIE = "exalmar_admin";
export async function getVisitor() {
  const jar = await cookies();
  return (
    verifySession(jar.get(VISITOR_COOKIE)?.value, "visitor") || newVisitor()
  );
}
export async function isAdmin() {
  const jar = await cookies();
  const session = verifySession(jar.get(ADMIN_COOKIE)?.value, "admin");
  return (
    !!session && session.email === process.env.ADMIN_EMAIL?.trim().toLowerCase()
  );
}
export function setSession(response: NextResponse, session: Session) {
  response.cookies.set(
    session.kind === "admin" ? ADMIN_COOKIE : VISITOR_COOKIE,
    signSession(session),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Math.max(0, Math.floor((session.expires - Date.now()) / 1000)),
    },
  );
  return response;
}
