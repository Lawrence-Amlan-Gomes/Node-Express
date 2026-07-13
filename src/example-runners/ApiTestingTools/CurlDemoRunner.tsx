import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real curl-demo.js on every render, which itself starts a real server on a
// fixed port, runs real curl commands against it, then shuts it down.
export default async function CurlDemoRunner() {
  const output = execSync("node curl-demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ApiTestingTools/CurlWorkflow",
  });

  return <>{output}</>;
}
