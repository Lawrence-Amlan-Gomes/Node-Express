import { execSync } from "node:child_process";

export default async function BullMqProducerWorkerRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/BackgroundJobsQueues/BullMqProducerWorker",
  });

  return <>{output}</>;
}
