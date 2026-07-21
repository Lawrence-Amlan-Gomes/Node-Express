import { spawn } from "node:child_process";

// Accumulates the FULL raw log and re-scans it with matchAll on every new
// chunk — not just the newest chunk in isolation. Confirmed necessary
// elsewhere in this project: Node can batch several real console.log
// lines into ONE stdout "data" event, which a plain per-chunk .match()
// can miss entirely. See co-founder/build-conventions.md.
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

console.log("Starting the real, separate users-service process...");
// Port 0 — a real, OS-assigned, always-free port for this demo's own
// throwaway instances, separate from the fixed ports the PostmanCheck
// walkthrough documents.
const usersProc = spawn("node", ["server.js"], { cwd: usersDir, env: { ...process.env, PORT: "0" } });
const usersPort = await waitForPort(usersProc, "users-service");
console.log(`users-service is really listening on port ${usersPort}.\n`);

console.log("Starting the real, separate orders-service process, pointed at the real users-service above...");
const ordersProc = spawn("node", ["server.js"], {
  cwd: ordersDir,
  env: { ...process.env, PORT: "0", USERS_SERVICE_URL: `http://localhost:${usersPort}` },
});
const ordersPort = await waitForPort(ordersProc, "orders-service");
console.log(`orders-service is really listening on port ${ordersPort}.\n`);

console.log("Real GET /orders/1 on orders-service — this now makes a REAL network call to users-service:");
const order = await (await fetch(`http://localhost:${ordersPort}/orders/1`)).json();
console.log(JSON.stringify(order, null, 2));

console.log(`\nReal time spent "joining" order and user data over the network: ${order.tookMs.toFixed(3)}ms.`);
console.log("Compare that to the monolith section's in-process join — a genuinely real, measured network cost, not a hand-wave.");

usersProc.kill("SIGTERM");
ordersProc.kill("SIGTERM");
