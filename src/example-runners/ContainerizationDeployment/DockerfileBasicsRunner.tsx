import { execSync } from "node:child_process";

export default async function DockerfileBasicsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ContainerizationDeployment/DockerfileBasics",
  });

  return <>{output}</>;
}
