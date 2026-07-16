import { execSync } from "node:child_process";

export default async function ZodValidationRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/RestConventionsValidation/ZodValidation",
  });

  return <>{output}</>;
}
