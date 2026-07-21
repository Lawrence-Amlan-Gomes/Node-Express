import { execSync } from "node:child_process";

export default async function TrpcEndToEndTypesRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/BeyondRestGraphqlTrpc/TrpcEndToEndTypes",
  });

  return <>{output}</>;
}
