import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — runs the
// real demo.js against the real remote MongoDB Atlas database on every render.
export default async function MongoWithMongooseRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ConnectingRealDatabases/MongoWithMongoose",
  });

  return <>{output}</>;
}
