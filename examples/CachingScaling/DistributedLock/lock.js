import redisClient from "./redisClient.js";

// THE REAL LOCK: Redis's SET command, with NX ("only set if this key does
// NOT already exist") and PX (a real expiry in milliseconds, so a crashed
// worker can never hold a lock forever). This single atomic command is
// the entire real mechanism — no separate "check then set" steps, which
// would leave a real race window between them.
export async function acquireLock(key, ownerId, ttlMs) {
  const result = await redisClient.set(key, ownerId, { NX: true, PX: ttlMs });
  return result === "OK";
}

// THE SAFE RELEASE: only delete the lock if the value stored is still
// THIS owner's id — a real Lua script runs the "check, then delete" as
// ONE atomic operation on the Redis server itself, so there's no gap
// where another real process could acquire the lock in between a plain
// GET and a plain DEL.
const RELEASE_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;

export async function releaseLock(key, ownerId) {
  const deletedCount = await redisClient.eval(RELEASE_SCRIPT, { keys: [key], arguments: [ownerId] });
  return deletedCount === 1;
}
