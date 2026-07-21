import { execSync } from "node:child_process";

export default async function WhyBackgroundJobsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/BackgroundJobsQueues/WhyBackgroundJobs",
  });

  return <>{output}</>;
}
