import redisClient from "../redisClient.js";

// RUN_ID (this real process's own PID) keeps concurrent runs of this demo
// fully isolated on the shared local Redis instance — see
// co-founder/build-conventions.md's matching entry.
const RUN_ID = process.pid;
const CACHE_TTL_SECONDS = 30;

// Real counters — proof of how many times the real expensive computation
// ACTUALLY ran, not just how many requests came in.
let unprotectedComputeCount = 0;
let protectedComputeCount = 0;

// A real, deliberately expensive "report" — standing in for a real slow
// aggregation query or external API call.
function computeExpensiveReport() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ generatedAt: Date.now() }), 300);
  });
}

// THE BUG this section is about: no protection against concurrent misses.
// If 10 real requests arrive at once with a cold cache, all 10 see a real
// miss and all 10 run the real expensive computation — a genuine stampede.
export async function getReportUnprotected(req, res) {
  const key = `caching-scaling:cache-stampede:${RUN_ID}:report-unprotected`;

  const cached = await redisClient.get(key);
  if (cached) {
    res.json({ ...JSON.parse(cached), source: "cache" });
    return;
  }

  unprotectedComputeCount += 1;
  const report = await computeExpensiveReport();
  await redisClient.set(key, JSON.stringify(report), { EX: CACHE_TTL_SECONDS });
  res.json({ ...report, source: "computed" });
}

// THE FIX: a real, in-process "single-flight" map. The FIRST concurrent
// request for a cold key starts the real computation and stores its real
// Promise here; every OTHER concurrent request for the SAME key finds
// that Promise already waiting and awaits the SAME one, instead of
// starting a second real computation.
const inFlight = new Map();

export async function getReportProtected(req, res) {
  const key = `caching-scaling:cache-stampede:${RUN_ID}:report-protected`;

  const cached = await redisClient.get(key);
  if (cached) {
    res.json({ ...JSON.parse(cached), source: "cache" });
    return;
  }

  if (!inFlight.has(key)) {
    const promise = (async () => {
      protectedComputeCount += 1;
      const report = await computeExpensiveReport();
      await redisClient.set(key, JSON.stringify(report), { EX: CACHE_TTL_SECONDS });
      return report;
    })();
    inFlight.set(key, promise);
    // Once the real computation finishes, remove it — the NEXT genuinely
    // new cold request should be free to start a fresh one.
    promise.finally(() => inFlight.delete(key));
  }

  const report = await inFlight.get(key);
  res.json({ ...report, source: "computed (single-flight)" });
}

export function getComputeCounts(req, res) {
  res.json({ unprotectedComputeCount, protectedComputeCount });
}
