import { execSync } from "node:child_process";

export default async function MockingWithPrismRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/WorkingWithFrontendTeams/MockingWithPrism",
  });

  return <>{output}</>;
}
