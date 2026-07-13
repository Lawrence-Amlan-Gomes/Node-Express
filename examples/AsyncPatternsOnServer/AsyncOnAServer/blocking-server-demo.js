import http from "node:http";

const WORK_MS = 300;

// A real local server with two routes doing the "same amount of work" two
// different ways:
// - /blocking     busy-waits synchronously for WORK_MS, freezing the ENTIRE
//                  server (blocks the one JS thread) until it's done
// - /nonblocking  waits the same WORK_MS via a real async timer, without
//                  blocking the thread at all
const server = http.createServer((req, res) => {
  if (req.url === "/blocking") {
    const until = Date.now() + WORK_MS;
    while (Date.now() < until) {
      // deliberate synchronous busy-wait — this is the real production bug:
      // a long synchronous loop (or sync file I/O, or heavy JSON parsing)
      // freezes the entire event loop, not just this one request.
    }
    res.end("blocking done");
    return;
  }

  if (req.url === "/nonblocking") {
    setTimeout(() => res.end("nonblocking done"), WORK_MS);
    return;
  }

  res.statusCode = 404;
  res.end("not found");
});

await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();
const base = `http://localhost:${port}`;

// The actual proof: fire TWO concurrent requests to the SAME route and
// measure the real total time for both to finish. This sidesteps any race
// over which request's connection gets processed first (confirmed flaky when
// tried) — it doesn't matter who goes first, only whether the two requests'
// work can overlap or not.
//
// Blocking: each request occupies the one JS thread for the full WORK_MS with
// nothing else able to run — the two requests CANNOT overlap, so total time
// is close to 2x WORK_MS (serialized, one after the other).
//
// Non-blocking: each request's wait is a real async timer, which frees the
// thread immediately — both timers run concurrently, so total time stays
// close to 1x WORK_MS (they overlap).
const blockingStart = Date.now();
await Promise.all([fetch(`${base}/blocking`), fetch(`${base}/blocking`)]);
const blockingTotal = Date.now() - blockingStart;
console.log(`1) Two concurrent /blocking requests (${WORK_MS}ms of synchronous work each): total real time ${blockingTotal}ms — serialized, ~2x the work, because the loop froze the whole server for each one`);

const nonBlockingStart = Date.now();
await Promise.all([fetch(`${base}/nonblocking`), fetch(`${base}/nonblocking`)]);
const nonBlockingTotal = Date.now() - nonBlockingStart;
console.log(`2) Two concurrent /nonblocking requests (${WORK_MS}ms of async wait each): total real time ${nonBlockingTotal}ms — overlapped, ~1x the work, because neither one blocked the thread`);

console.log(`\nSame ${WORK_MS}ms of "work" per request either way — the difference is entirely whether it blocks the one JS thread or lets other work interleave.`);

server.close();
