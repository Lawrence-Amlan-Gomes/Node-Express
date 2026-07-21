import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// See WhatIsAContainerRunner.tsx for why this caches real output to a
// file instead of re-running live every render — this demo runs a full
// real "docker compose up --build" / "down" cycle, too slow (and unsafe
// against overlapping requests, since it uses fixed container/network
// names) to redo per request.
export default async function ComposeMultiContainerRunner() {
  const cwd = process.cwd() + "/examples/ContainerizationDeployment/ComposeMultiContainer";
  const cachePath = `${cwd}/demo-output.txt`;

  if (existsSync(cachePath)) {
    return <>{readFileSync(cachePath, "utf-8")}</>;
  }

  const output = execSync("node demo.js", { encoding: "utf-8", cwd });
  writeFileSync(cachePath, output);
  return <>{output}</>;
}
