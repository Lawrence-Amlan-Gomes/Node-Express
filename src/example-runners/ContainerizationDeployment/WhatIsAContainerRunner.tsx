import { execSync } from "node:child_process";

export default async function WhatIsAContainerRunner() {
  const output = execSync("node isolation-proof.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ContainerizationDeployment/WhatIsAContainer",
  });

  return <>{output}</>;
}
