import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — spawns the
// real script on every render. The script starts a real local http server,
// fires real concurrent requests at it, and measures real elapsed time; see
// co-founder/build-conventions.md's "same-process blocking-demo gotcha" note
// for why this measures TOTAL time for two same-route requests rather than
// racing two different routes (the race turned out to be genuinely flaky).
export default async function BlockingServerDemoRunner() {
  const output = execSync("node blocking-server-demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/AsyncPatternsOnServer/BlockingVsNonBlocking",
  });

  return <>{output}</>;
}
