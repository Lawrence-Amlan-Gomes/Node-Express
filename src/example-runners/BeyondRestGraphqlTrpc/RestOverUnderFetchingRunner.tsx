import { execSync } from "node:child_process";

export default async function RestOverUnderFetchingRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/BeyondRestGraphqlTrpc/RestOverUnderFetching",
  });

  return <>{output}</>;
}
