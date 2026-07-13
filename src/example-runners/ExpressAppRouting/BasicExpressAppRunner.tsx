import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real demo script on every render, which imports the real Express app,
// listens on a real ephemeral port, and fires real fetch requests at every
// route (see co-founder/build-conventions.md for why execSync's
// single-string form is used instead of execFileSync's array form).
export default async function BasicExpressAppRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/ExpressAppRouting/RoutesParamsQueryBody",
  });

  return <>{output}</>;
}
