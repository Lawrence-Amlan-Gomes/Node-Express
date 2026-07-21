import redisClient from "../redisClient.js";

// Standing in for a real, slower data source — a real database query over
// a real network would have this same kind of real latency.
const PRODUCTS = {
  "42": { id: "42", name: "Mechanical Keyboard", price: 89 },
};

// Every key this mini-project touches lives under its own real prefix —
// the same dedicated-namespace discipline this project already applies
// to Postgres schemas, Mongo collections, and S3 key prefixes, just for
// Redis keys shared across this topic's several mini-projects. The real
// process PID is folded in too — confirmed necessary: Next.js can invoke
// this same Server Component's demo concurrently more than once per page
// request, and two real concurrent processes sharing one literal Redis
// key raced each other, producing a wrong "source" value (reproduced
// directly). Each real process gets its own real, isolated keys instead.
const CACHE_TTL_SECONDS = 30;
const RUN_ID = process.pid;
function cacheKey(id) {
  return `caching-scaling:cache-aside:${RUN_ID}:product:${id}`;
}

// A real, deliberate delay — standing in for the real time a database
// round trip actually takes over a real network.
function simulateSlowDatabaseFetch(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS[id]), 300);
  });
}

export async function getProduct(req, res) {
  const { id } = req.params;
  const start = Date.now();

  // THE CACHE-ASIDE PATTERN: check Redis FIRST, before touching the real
  // slow data source at all.
  const cached = await redisClient.get(cacheKey(id));
  if (cached) {
    res.json({ ...JSON.parse(cached), source: "cache", tookMs: Date.now() - start });
    return;
  }

  // Only on a real cache MISS does the slow real fetch actually happen.
  const product = await simulateSlowDatabaseFetch(id);
  // Real result gets written into Redis, with a real expiry, so the NEXT
  // request for this same id skips the slow fetch entirely.
  await redisClient.set(cacheKey(id), JSON.stringify(product), { EX: CACHE_TTL_SECONDS });

  res.json({ ...product, source: "database", tookMs: Date.now() - start });
}
