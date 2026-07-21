import { cacheBuggy, cacheFixed, MAX_FIXED_ENTRIES } from "../caches.js";

// A real, deliberately slow "computation" — standing in for a real
// database query or external API call, which is the usual real reason
// apps reach for an in-memory cache in the first place.
function computeExpensive(id) {
  return { id, computedAt: Date.now() };
}

// THE BUG: a real, easy-to-write mistake — caching by a key that keeps
// changing (here, the URL param itself). Every new, never-before-seen id
// adds ONE MORE real entry that is NEVER removed. A real version of this
// bug usually looks innocent: caching by user session ID, request ID, or
// a timestamp-based key, with no eviction logic at all.
export function dataBuggy(req, res) {
  const { id } = req.params;
  if (!cacheBuggy.has(id)) {
    cacheBuggy.set(id, computeExpensive(id));
  }
  res.json({ id, cacheSize: cacheBuggy.size });
}

// THE FIX: a real cap. Once the cache is full, the OLDEST entry is
// removed before adding a new one — Map remembers real insertion order,
// so `.keys().next().value` really is the oldest surviving key.
export function dataFixed(req, res) {
  const { id } = req.params;
  if (!cacheFixed.has(id) && cacheFixed.size >= MAX_FIXED_ENTRIES) {
    const oldestKey = cacheFixed.keys().next().value;
    cacheFixed.delete(oldestKey);
  }
  if (!cacheFixed.has(id)) {
    cacheFixed.set(id, computeExpensive(id));
  }
  res.json({ id, cacheSize: cacheFixed.size });
}

export function cacheStats(req, res) {
  res.json({
    buggySize: cacheBuggy.size,
    fixedSize: cacheFixed.size,
    maxFixedSize: MAX_FIXED_ENTRIES,
  });
}
