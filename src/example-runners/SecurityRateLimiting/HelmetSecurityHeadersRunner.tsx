import { execSync } from "node:child_process";

export default async function HelmetSecurityHeadersRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/SecurityRateLimiting/HelmetSecurityHeaders",
  });

  return <>{output}</>;
}
