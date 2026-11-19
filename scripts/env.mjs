import fs from "node:fs";
export function loadEnv() {
  for (const name of [".env.local", ".env"])
    if (fs.existsSync(name)) process.loadEnvFile(name);
}
