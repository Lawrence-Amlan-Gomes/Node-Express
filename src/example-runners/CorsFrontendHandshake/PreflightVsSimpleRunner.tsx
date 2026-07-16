import { execSync } from "node:child_process";

export default async function PreflightVsSimpleRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CorsFrontendHandshake/PreflightVsSimple",
  });

  return <>{output}</>;
}
