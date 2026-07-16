import { execSync } from "node:child_process";

export default async function IdempotencyKeysRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/RestConventionsValidation/IdempotencyKeys",
  });

  return <>{output}</>;
}
