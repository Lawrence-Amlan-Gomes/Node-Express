import { spawn, execSync } from "node:child_process";

// Same real spawn + full-log matchAll + hard-timeout pattern used
// elsewhere in this project. See co-founder/build-conventions.md.
async function waitForPort(proc, label) {
  let fullLog = "";
  proc.stdout.on("data", (chunk) => {
    process.stdout.write(`  [${label} log] ${chunk}`);
    fullLog += chunk.toString();
  });

  const deadline = Date.now() + 10_000;
  while (true) {
    const match = [...fullLog.matchAll(/Listening on port (\d+)/g)].at(-1);
    if (match) return match[1];
    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for ${label} to report its real port.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

console.log("Starting the real tRPC server (server.ts, run directly via Node's native TypeScript support)...");
const serverProc = spawn("node", ["server.ts"], {
  cwd: import.meta.dirname,
  env: { ...process.env, PORT: "0" },
});
const port = await waitForPort(serverProc, "trpc-server");

console.log("\nReal, CORRECT client call (client.ts) — fully typed, id passed as a real string:");
const clientOutput = execSync(`node client.ts ${port}`, { cwd: import.meta.dirname, encoding: "utf-8" });
process.stdout.write(`  ${clientOutput}`);

console.log("\nNow the deliberately WRONG usage (broken-usage.ts) — never run, only real type-checked:");
try {
  execSync("./node_modules/.bin/tsc -p tsconfig.errordemo.json", {
    cwd: import.meta.dirname,
    encoding: "utf-8",
  });
  console.log("  (unexpected: tsc reported no real error)");
} catch (error) {
  process.stdout.write(`  ${error.stdout}`);
  console.log("\nReal result: TypeScript caught the wrong id type BEFORE any code ran — no request was ever sent, no server was ever bothered.");
}

serverProc.kill("SIGTERM");
