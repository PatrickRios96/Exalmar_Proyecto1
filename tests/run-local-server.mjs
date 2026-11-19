import { spawn } from "node:child_process";
const port = "3111";
const env = {
  ...process.env,
  NEXT_TEST_DIST: ".next-integration",
  TEST_BASE_URL: "http://127.0.0.1:" + port,
};
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  { env, stdio: ["ignore", "pipe", "pipe"] },
);
let logs = "";
console.log("Iniciando servidor Next.js aislado para pruebas...");
child.stdout.on("data", (chunk) => (logs += chunk));
child.stderr.on("data", (chunk) => (logs += chunk));
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(env.TEST_BASE_URL + "/api/catalog", {
        signal: AbortSignal.timeout(1500),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!ready)
    throw new Error("No se pudo iniciar el servidor de prueba.\n" + logs);
  const test = spawn(process.execPath, ["tests/local-flow.mjs"], {
    env,
    stdio: "inherit",
  });
  const code = await new Promise((resolve) => test.on("exit", resolve));
  if (code) throw new Error("El flujo local falló.\n" + logs);
} finally {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    child.once("exit", resolve);
    setTimeout(resolve, 3000);
  });
}
