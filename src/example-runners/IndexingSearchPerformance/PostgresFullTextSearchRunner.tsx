import { execSync } from "node:child_process";

export default async function PostgresFullTextSearchRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/IndexingSearchPerformance/PostgresFullTextSearch",
  });

  return <>{output}</>;
}
