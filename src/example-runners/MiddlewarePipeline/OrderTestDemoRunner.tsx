import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real script on every render.
export default async function OrderTestDemoRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/MiddlewarePipeline/OrderOfExecution",
  });

  return <>{output}</>;
}
