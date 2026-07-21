// Spawns the real server as its own separate OS process — the same
// pattern used in ApiTestingTools/CurlWorkflow/curl-demo.js — specifically
// so Node's own real MaxListenersExceededWarning (printed to that
// process's real stderr) can be captured, exactly as it would appear in
// a real terminal running this server for real.
import { spawn } from "node:child_process";

// PORT=0 asks the OS for any real free port for THIS spawned child —
// decoupled from the fixed 4093 a human uses for the PostmanCheck
// walkthrough below. Avoids a real, confirmed collision: Next.js can
// invoke this same Server Component more than once for one page request,
// and two real spawned servers both binding the SAME fixed port crash.
const server = spawn("node", ["server.js"], { cwd: import.meta.dirname, env: { ...process.env, PORT: "0" } });

let capturedWarning = "";
server.stderr.on("data", (chunk) => {
  capturedWarning += chunk.toString();
});

// The child's own console.log reports its real bound port (see
// server.js) — parsed out here since PORT=0 means it's only known once
// the OS actually assigns it.
const PORT = await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    const match = chunk.toString().match(/Listening on port (\d+)/);
    if (match) resolve(Number(match[1]));
  });
});

console.log("Hitting /subscribe-buggy 15 real times — each call adds ONE MORE real listener that never gets removed...");
for (let i = 0; i < 15; i++) {
  await fetch(`http://localhost:${PORT}/subscribe-buggy`);
}

console.log("Hitting /subscribe-fixed 15 real times — the fixed route registers its listener only ONCE, at module load...");
for (let i = 0; i < 15; i++) {
  await fetch(`http://localhost:${PORT}/subscribe-fixed`);
}

const countsRes = await fetch(`http://localhost:${PORT}/listener-counts`);
const counts = await countsRes.json();

console.log("\nReal listener counts after 15 real requests to each route:");
console.log(JSON.stringify(counts, null, 2));

// Give Node a real moment to flush the warning to stderr before killing
// the process out from under it.
await new Promise((resolve) => setTimeout(resolve, 200));
server.kill();

const warningLine = capturedWarning
  .split("\n")
  .find((line) => line.includes("MaxListenersExceededWarning"));

console.log("\nNode's own REAL built-in leak-detection warning, printed to the real server process's stderr:");
console.log(warningLine ?? "(no warning captured)");
