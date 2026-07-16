import { execSync } from "node:child_process";

export default async function SessionBasedAuthRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/AuthPatternsExpress/SessionBasedAuth",
  });

  return <>{output}</>;
}
