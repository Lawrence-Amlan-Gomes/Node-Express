// Drives real "docker compose" commands and real HTTP calls against the
// real app container — never imports server.js or the redis client
// directly, same outside-in role demo.js plays everywhere else in this
// project.
import { execSync } from "node:child_process";

const PORT = 4091;
const FIB_N = 40; // real, deliberately expensive naive-recursive input — ~1s uncached

function run(command) {
  return execSync(command, { encoding: "utf-8", cwd: process.cwd() }).trim();
}

// Retries a real fetch() until the app container is actually accepting
// connections — "docker compose up -d" returns as soon as containers
// START, not once Express is actually listening inside them.
async function waitUntilReady(url, attemptsLeft = 30) {
  try {
    const res = await fetch(url);
    if (res.ok) return;
    throw new Error(`Got status ${res.status}`);
  } catch {
    if (attemptsLeft <= 0) throw new Error("App container never became ready");
    await new Promise((resolve) => setTimeout(resolve, 500));
    await waitUntilReady(url, attemptsLeft - 1);
  }
}

async function main() {
  // Clean up any stray real Fibonacci cache entry from a previous run,
  // so this demo always genuinely starts from a real cache miss.
  console.log("Starting the real app + redis containers (docker compose up)...");
  run("docker compose up -d --build");

  const url = `http://localhost:${PORT}/fib/${FIB_N}`;
  await waitUntilReady(url);

  // Make sure the run starts from a real, clean cache miss.
  await fetch(url, { method: "DELETE" });

  console.log(`\nFirst real request to /fib/${FIB_N} — expect a genuine cache MISS:`);
  const miss = await (await fetch(url)).json();
  console.log(JSON.stringify(miss, null, 2));

  console.log(`\nSecond real request to /fib/${FIB_N} — expect a genuine cache HIT:`);
  const hit = await (await fetch(url)).json();
  console.log(JSON.stringify(hit, null, 2));

  const speedup = miss.tookMs > 0 ? (miss.tookMs / Math.max(hit.tookMs, 1)).toFixed(1) : "n/a";
  console.log(`\nReal measured speed-up from the cache hit: ~${speedup}x faster.`);

  console.log("\nStopping the real containers (docker compose down)...");
  run("docker compose down");
}

main();
