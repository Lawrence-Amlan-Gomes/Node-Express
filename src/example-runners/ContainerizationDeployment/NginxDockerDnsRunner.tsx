import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// See WhatIsAContainerRunner.tsx for why this caches real output to a
// file instead of re-running live every render — this demo builds a real
// image, starts 3 real containers, swaps one out, and tears everything
// down, too slow to redo per request.
export default async function NginxDockerDnsRunner() {
  const cwd = process.cwd() + "/examples/ContainerizationDeployment/NginxDockerDns";
  const cachePath = `${cwd}/demo-output.txt`;

  if (existsSync(cachePath)) {
    return <>{readFileSync(cachePath, "utf-8")}</>;
  }

  const output = execSync("node demo.js", { encoding: "utf-8", cwd });
  writeFileSync(cachePath, output);
  return <>{output}</>;
}
