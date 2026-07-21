import { execSync } from "node:child_process";

export default async function CacheInvalidationRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CachingScaling/CacheInvalidation",
  });

  return <>{output}</>;
}
