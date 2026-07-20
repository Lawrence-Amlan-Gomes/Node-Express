import { execSync } from "node:child_process";

export default async function DeployToCoolifyRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ContainerizationDeployment/DeployToCoolify",
  });

  return <>{output}</>;
}
