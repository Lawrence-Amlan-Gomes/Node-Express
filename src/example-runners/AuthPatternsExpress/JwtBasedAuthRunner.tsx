import { execSync } from "node:child_process";

export default async function JwtBasedAuthRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/AuthPatternsExpress/JwtBasedAuth",
  });

  return <>{output}</>;
}
