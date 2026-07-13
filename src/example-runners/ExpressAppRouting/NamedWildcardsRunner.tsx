import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real demo script on every render: a real named-wildcard route match, plus
// a real, caught error proving the old Express 4 bare '*' wildcard throws.
export default async function NamedWildcardsRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ExpressAppRouting/NamedWildcards",
  });

  return <>{output}</>;
}
