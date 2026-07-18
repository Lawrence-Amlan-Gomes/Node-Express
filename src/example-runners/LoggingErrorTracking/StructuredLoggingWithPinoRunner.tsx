import { execSync } from "node:child_process";

export default async function StructuredLoggingWithPinoRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/LoggingErrorTracking/StructuredLoggingWithPino",
  });

  return <>{output}</>;
}
