import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real example script on every render and captures its real stdout. Same
// execSync("node file.js", { cwd }) pattern as EventLoopOrderRunner (see
// co-founder/build-conventions.md for why execFileSync's array form breaks
// the Turbopack production build).
export default async function CjsEsmInteropRunner() {
  const output = execSync("node main.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ModulesNpmPackageJson/CjsEsmInterop",
  });

  return <>{output}</>;
}
