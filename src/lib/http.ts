import { NextResponse } from "next/server";
export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("Origin") || "");
    const url = new URL(request.url);
    const host = request.headers.get("Host") || url.host;
    const protocol = process.env.VERCEL ? "https:" : url.protocol;
    return (
      origin.host === host &&
      origin.protocol === protocol &&
      !!request.headers.get("Content-Type")?.includes("application/json")
    );
  } catch {
    return false;
  }
}
export async function readInput(request: Request) {
  if (Number(request.headers.get("Content-Length") || 0) > 20000)
    throw new RangeError();
  const raw = await request.text();
  if (raw.length > 20000) throw new RangeError();
  return JSON.parse(raw);
}
export async function safe(run: () => Promise<NextResponse>) {
  try {
    return await run();
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof RangeError)
      return json(
        { error: "El formato o tamaño de la solicitud no es válido." },
        400,
      );
    console.error(
      "Error de operación:",
      error instanceof Error ? error.message : "desconocido",
    );
    return json(
      {
        error:
          "No fue posible completar la operación. Revisa la conexión con la base de datos.",
      },
      500,
    );
  }
}
