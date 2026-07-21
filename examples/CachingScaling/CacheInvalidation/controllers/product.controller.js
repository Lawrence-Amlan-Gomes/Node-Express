import redisClient from "../redisClient.js";

// A real, mutable "source of truth" — standing in for a real database
// table that a real PUT/PATCH request would actually update.
const PRICES = { "42": 89 };

// RUN_ID (this real process's own PID) keeps concurrent runs of this demo
// fully isolated — confirmed necessary: two concurrent processes sharing
// one literal Redis key raced each other and produced a wrong "source"
// value (reproduced directly). See CacheAside's matching comment.
const CACHE_TTL_SECONDS = 30;
const RUN_ID = process.pid;
function cacheKey(id) {
  return `caching-scaling:cache-invalidation:${RUN_ID}:product:${id}`;
}

export async function getProduct(req, res) {
  const { id } = req.params;

  const cached = await redisClient.get(cacheKey(id));
  if (cached) {
    res.json({ id, price: JSON.parse(cached), source: "cache" });
    return;
  }

  const price = PRICES[id];
  await redisClient.set(cacheKey(id), JSON.stringify(price), { EX: CACHE_TTL_SECONDS });
  res.json({ id, price, source: "database" });
}

// THE FIX this section is about: a write to the real source of truth
// ALSO deletes the real cache entry for that same id, right here, in the
// same request — never left for later, never forgotten.
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { price } = req.body;

  PRICES[id] = price;
  await redisClient.del(cacheKey(id));

  res.json({ id, price, invalidated: true });
}
