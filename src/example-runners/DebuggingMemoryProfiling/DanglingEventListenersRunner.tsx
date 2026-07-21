import { execSync } from "node:child_process";

export default async function DanglingEventListenersRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/DebuggingMemoryProfiling/DanglingEventListeners",
  });

  return <>{output}</>;
}
