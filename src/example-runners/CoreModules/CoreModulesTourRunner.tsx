import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real tour script on every render, including a real local http server the
// script starts itself and a real fetch() against it (see
// co-founder/build-conventions.md for why execSync's single-string form is
// used instead of execFileSync's array form).
export default async function CoreModulesTourRunner() {
  const output = execSync("node index.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CoreModules/CoreModulesTour",
  });

  return <>{output}</>;
}
