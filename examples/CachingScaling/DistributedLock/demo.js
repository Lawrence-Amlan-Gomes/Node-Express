import redisClient from "./redisClient.js";
import { acquireLock, releaseLock } from "./lock.js";

// This process's own real PID keeps this run's lock key isolated from
// any other concurrent run sharing the same local Redis instance.
const LOCK_KEY = `caching-scaling:distributed-lock:${process.pid}:send-daily-report`;
const TTL_MS = 5000;

console.log("Two real 'workers' racing to acquire the SAME lock key, at the same real moment (Promise.all)...");
const [workerAGotLock, workerBGotLock] = await Promise.all([
  acquireLock(LOCK_KEY, "worker-A", TTL_MS),
  acquireLock(LOCK_KEY, "worker-B", TTL_MS),
]);
console.log(JSON.stringify({ workerAGotLock, workerBGotLock }, null, 2));

const winner = workerAGotLock ? "worker-A" : "worker-B";
console.log(`\nExactly one real worker won: ${winner}. The other's real SET NX failed because the key already existed.`);

console.log(`\n${winner === "worker-A" ? "worker-B" : "worker-A"} (the LOSER) tries to release the lock it never actually held...`);
const wrongOwnerReleased = await releaseLock(LOCK_KEY, winner === "worker-A" ? "worker-B" : "worker-A");
console.log(`Real result: ${wrongOwnerReleased} — the safe Lua release refuses, because the stored owner doesn't match.`);

console.log(`\n${winner} (the real WINNER) finishes its real work, then releases the lock it actually holds...`);
const correctOwnerReleased = await releaseLock(LOCK_KEY, winner);
console.log(`Real result: ${correctOwnerReleased} — the lock is really gone now.`);

console.log("\nA brand new acquire attempt for the same key, now that it's real and free again...");
const reacquired = await acquireLock(LOCK_KEY, "worker-C", TTL_MS);
console.log(`Real result: ${reacquired} — the lock never gets stuck forever; a fresh worker can pick up the job.`);

await releaseLock(LOCK_KEY, "worker-C");
await redisClient.quit();
