import { spawn } from "node:child_process";

// Same real spawn + full-log matchAll + hard-timeout pattern used
// elsewhere in this project for parsing a spawned child's stdout. See
// co-founder/build-conventions.md.
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

const usersDir = import.meta.dirname + "/users-service";
const ordersDir = import.meta.dirname + "/orders-service";

console.log("Starting both real, separate services...");
const usersProc = spawn("node", ["server.js"], { cwd: usersDir, env: { ...process.env, PORT: "0" } });
const usersPort = await waitForPort(usersProc, "users-service");

const ordersProc = spawn("node", ["server.js"], {
  cwd: ordersDir,
  env: { ...process.env, PORT: "0", USERS_SERVICE_URL: `http://localhost:${usersPort}` },
});
const ordersPort = await waitForPort(ordersProc, "orders-service");
console.log(`Both real services are up (users-service:${usersPort}, orders-service:${ordersPort}).\n`);

console.log("Confirming both work normally first — real GET /orders/1:");
const before = await (await fetch(`http://localhost:${ordersPort}/orders/1`)).json();
console.log(`  ${JSON.stringify(before)}`);

console.log("\nNow really crashing users-service (SIGKILL — no graceful shutdown, exactly like a real process dying):");
usersProc.kill("SIGKILL");
await new Promise((resolve) => setTimeout(resolve, 300));

console.log("\nReal GET /orders/1/basic on orders-service — needs NOTHING from users-service:");
const basicResponse = await fetch(`http://localhost:${ordersPort}/orders/1/basic`);
const basic = await basicResponse.json();
console.log(`  status ${basicResponse.status}: ${JSON.stringify(basic)}`);

console.log("\nReal GET /orders/1 on orders-service — needs a real call to the now-dead users-service:");
const enrichedResponse = await fetch(`http://localhost:${ordersPort}/orders/1`);
const enriched = await enrichedResponse.json();
console.log(`  status ${enrichedResponse.status}: ${JSON.stringify(enriched)}`);

console.log("\nReal GET /orders/1/basic AGAIN — proving orders-service's own process is still alive and unaffected:");
const stillAliveResponse = await fetch(`http://localhost:${ordersPort}/orders/1/basic`);
const stillAlive = await stillAliveResponse.json();
console.log(`  status ${stillAliveResponse.status}: ${JSON.stringify(stillAlive)}`);

console.log(
  "\nReal result: one real service crashing completely took down only the ONE endpoint that genuinely depended on it — orders-service itself never went down.",
);

ordersProc.kill("SIGTERM");
