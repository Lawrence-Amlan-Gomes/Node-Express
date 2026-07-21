import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Building/running real Docker images is too slow to re-run on every
// page render (Next.js renders a page's Server Components concurrently,
// but this project's runners use blocking execSync, so slow ones freeze
// the whole dev server). The real output is captured to a cache file
// once, then reused — still 100% real, never fabricated, just not
// re-executed live every request. Delete demo-output.txt to force a
// fresh real run next page load.
export default async function WhatIsAContainerRunner() {
  const cwd = process.cwd() + "/examples/ContainerizationDeployment/WhatIsAContainer";
  const cachePath = `${cwd}/demo-output.txt`;

  if (existsSync(cachePath)) {
    return <>{readFileSync(cachePath, "utf-8")}</>;
  }

  const output = execSync("node isolation-proof.js", { encoding: "utf-8", cwd });
  writeFileSync(cachePath, output);
  return <>{output}</>;
}
