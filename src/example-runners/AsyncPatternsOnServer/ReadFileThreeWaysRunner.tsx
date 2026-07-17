import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real script on every render (see co-founder/build-conventions.md for why
// execSync's single-string form is used instead of execFileSync's array form).
export default async function ReadFileThreeWaysRunner() {
  const output = execSync("node read-file-three-ways.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/AsyncPatternsOnServer/ReadFileThreeWays",
  });

  return <>{output}</>;
}
