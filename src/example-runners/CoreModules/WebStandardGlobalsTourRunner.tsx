import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real tour script on every render, including a real local http server the
// script starts itself and a real fetch() against it.
export default async function WebStandardGlobalsTourRunner() {
  const output = execSync("node index.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CoreModules/WebStandardGlobalsTour",
  });

  return <>{output}</>;
}
