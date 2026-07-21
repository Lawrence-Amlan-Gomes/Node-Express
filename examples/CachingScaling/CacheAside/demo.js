import { app } from "./server.js";
import redisClient from "./redisClient.js";

// Port 0 asks the OS for any real free port — this demo's own server is
// throwaway and separate from the fixed port a human uses for the
// PostmanCheck walkthrough. See co-founder/build-conventions.md.
const server = app.listen(0);
const { port } = server.address();

// No manual cleanup needed here — the controller's cache key is scoped
// to THIS process's own real PID, so it's always a fresh key, every run.

console.log("First real request for product 42 — expect a genuine cache MISS (slow, real fetch):");
const miss = await (await fetch(`http://localhost:${port}/product/42`)).json();
console.log(JSON.stringify(miss, null, 2));

console.log("\nSecond real request for the SAME product — expect a genuine cache HIT (fast, from Redis):");
const hit = await (await fetch(`http://localhost:${port}/product/42`)).json();
console.log(JSON.stringify(hit, null, 2));

const speedup = (miss.tookMs / Math.max(hit.tookMs, 1)).toFixed(1);
console.log(`\nReal measured speed-up from the cache hit: ~${speedup}x faster.`);

server.close();
await redisClient.quit();
