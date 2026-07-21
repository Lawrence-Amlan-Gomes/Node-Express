import { execSync } from "node:child_process";

export default async function DistributedLockRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CachingScaling/DistributedLock",
  });

  return <>{output}</>;
}
