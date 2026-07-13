import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real, minimal demo on every render: start the real app, hit its first
// route, show the real response.
export default async function RootRouteDemoRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ExpressAppRouting/CreatingTheApp",
  });

  return <>{output}</>;
}
