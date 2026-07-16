import { execSync } from "node:child_process";

export default async function MongoTransactionsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/TransactionsPerformance/MongoTransactions",
  });

  return <>{output}</>;
}
