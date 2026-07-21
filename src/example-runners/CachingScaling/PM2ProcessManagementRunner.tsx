import { execSync } from "node:child_process";

export default async function PM2ProcessManagementRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CachingScaling/PM2ProcessManagement",
  });

  return <>{output}</>;
}
