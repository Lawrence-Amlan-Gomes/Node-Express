// The ONLY file that talks to Redis — same "one file owns the real
// client" pattern this project already uses for Prisma/Mongoose/S3
// controllers.
import { createClient } from "redis";

// REDIS_HOST is set by docker-compose.yml to the literal string "redis" —
// Docker Compose gives every service a real DNS name equal to its own
// name in the compose file. There is no IP address hardcoded anywhere;
// Docker's own internal network resolves "redis" for us.
const REDIS_HOST = process.env.REDIS_HOST ?? "localhost";

const redisClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
redisClient.on("error", (err) => console.error("Redis client error:", err));

// "depends_on" in docker-compose.yml only waits for the Redis CONTAINER
// to start, not for Redis itself to finish booting up inside it — so the
// very first connection attempt can genuinely arrive too early. Retrying
// a few real times, a moment apart, is the real production-grade fix.
async function connectWithRetry(attemptsLeft = 20) {
  try {
    await redisClient.connect();
  } catch (err) {
    if (attemptsLeft <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await connectWithRetry(attemptsLeft - 1);
  }
}
await connectWithRetry();

// A genuinely slow, real computation — naive recursive Fibonacci does NOT
// memoize, so it re-solves the same smaller sub-problems millions of
// times. This is deliberately expensive on purpose, so caching it has a
// real, measurable benefit below.
function fibSlow(n) {
  if (n < 2) return n;
  return fibSlow(n - 1) + fibSlow(n - 2);
}

// Handles GET /fib/:n — checks Redis first, only falls back to the real
// slow computation on a genuine cache miss.
export async function getFibonacci(req, res) {
  const n = Number(req.params.n);
  const cacheKey = `fib:${n}`;
  const start = Date.now();

  // A real round-trip to the real Redis container over Docker's internal
  // network — not an in-memory JS Map standing in for it.
  const cached = await redisClient.get(cacheKey);
  if (cached !== null) {
    return res.json({
      n,
      result: Number(cached),
      source: "cache",
      tookMs: Date.now() - start,
    });
  }

  // Real cache miss — do the real expensive work.
  const result = fibSlow(n);
  // EX: 300 sets a real 300-second expiry, so this demo's own Redis data
  // doesn't live forever on the shared container.
  await redisClient.set(cacheKey, String(result), { EX: 300 });

  res.json({
    n,
    result,
    source: "computed",
    tookMs: Date.now() - start,
  });
}

// Handles DELETE /fib/:n — cleans up after the demo so a re-run always
// starts from a real, genuine cache miss again.
export async function clearFibonacci(req, res) {
  const n = Number(req.params.n);
  const deleted = await redisClient.del(`fib:${n}`);
  res.json({ n, deleted: deleted === 1 });
}
