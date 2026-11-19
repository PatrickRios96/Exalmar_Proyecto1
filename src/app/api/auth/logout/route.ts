import { ADMIN_COOKIE } from "@/lib/auth";
import { json, safe, sameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  return safe(async () => {
    if (!sameOrigin(request))
      return json({ error: "Solicitud no permitida." }, 403);
    const response = json({ success: true });
    response.cookies.set(ADMIN_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  });
}
