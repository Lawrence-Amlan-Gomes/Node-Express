import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real script on every render. This script itself only takes ~800ms (a real
// timeout race, not an actual infinite hang) so it's safe to run on every
// page render like the other demos.
export default async function HangsDemoRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/MiddlewarePipeline/ForgottenNext",
  });

  return <>{output}</>;
}
