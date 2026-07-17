import { execSync } from "node:child_process";

export default async function UnitTestingPureFunctionsRunner() {
  // Jest's real human-readable report is written to stderr, not
  // stdout (stdout is reserved for machine-readable output like
  // --json). execSync only returns stdout by default, so the "2>&1"
  // shell redirection is required here to actually capture it.
  const output = execSync("npm test 2>&1", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/TestingExpressApp/UnitTestingPureFunctions",
  });

  return <>{output}</>;
}
