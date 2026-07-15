import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real script on every render. This demo itself spawns a THIRD process (the
// Express 4 server under test) to prove it really crashes — see
// examples/ErrorHandlingExpress/LegacyTryCatch/demo.js.
export default async function LegacyTryCatchRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ErrorHandlingExpress/LegacyTryCatch",
  });

  return <>{output}</>;
}
