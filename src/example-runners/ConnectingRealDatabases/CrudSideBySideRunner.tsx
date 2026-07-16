import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — runs the
// real demo.js against BOTH real remote databases on every render.
export default async function CrudSideBySideRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ConnectingRealDatabases/CrudSideBySide",
  });

  return <>{output}</>;
}
