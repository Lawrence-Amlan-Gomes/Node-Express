import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real demo on every render: starts a real server, sends the exact same
// requests as postman-collection.json, one folder over.
export default async function PostmanCollectionRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ApiTestingTools/PostmanCollection",
  });

  return <>{output}</>;
}
