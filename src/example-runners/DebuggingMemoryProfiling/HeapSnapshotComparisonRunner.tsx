import { execSync } from "node:child_process";

export default async function HeapSnapshotComparisonRunner() {
  const output = execSync("node --expose-gc demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/DebuggingMemoryProfiling/HeapSnapshotComparison",
  });

  return <>{output}</>;
}
