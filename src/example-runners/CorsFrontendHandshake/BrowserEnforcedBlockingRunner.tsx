import { execSync } from "node:child_process";

export default async function BrowserEnforcedBlockingRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/CorsFrontendHandshake/BrowserEnforcedBlocking",
  });

  return <>{output}</>;
}
