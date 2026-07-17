import http from "node:http";

// Both routes below do the "same amount of work" — 300ms — but wait for it
// in two very different ways.
const WORK_MS = 300;

const server = http.createServer((req, res) => {
  if (req.url === "/blocking") {
    // Compute the real clock time this loop is allowed to run until.
    const until = Date.now() + WORK_MS;
    // A deliberate SYNCHRONOUS busy-wait — keeps checking the clock, never
    // letting go of the one JS thread until WORK_MS has really passed.
    while (Date.now() < until) {
      // This empty loop body IS the real production bug: a long
      // synchronous loop (or sync file I/O, or heavy JSON parsing) freezes
      // the ENTIRE event loop, not just this one request.
    }
    // Only reached once the busy-wait above is fully done.
    res.end("blocking done");
    return;
  }

  if (req.url === "/nonblocking") {
    // setTimeout waits the SAME 300ms, but as a real async timer — the JS
    // thread is free to do other work while this is pending.
    setTimeout(() => res.end("nonblocking done"), WORK_MS);
    return;
  }

  // Anything other than /blocking or /nonblocking is a real 404.
  res.statusCode = 404;
  res.end("not found");
});

// Port 0 means "give me any free port" — wait for the real "listening"
// event before sending any requests, so nothing races a server that
// isn't ready yet.
await new Promise((resolve) => server.listen(0, resolve));
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
// Every fetch() call below reuses this same base URL.
const base = `http://localhost:${port}`;

// Start the real clock for the blocking measurement.
const blockingStart = Date.now();
// Fire TWO CONCURRENT requests at the SAME /blocking route. Racing two
// DIFFERENT routes against each other was tried first and found
// genuinely flaky — which connection gets processed first isn't
// guaranteed by code order alone. Measuring total time for the SAME
// route sidesteps that: it doesn't matter who goes first, only whether
// the two requests' work can overlap.
await Promise.all([fetch(`${base}/blocking`), fetch(`${base}/blocking`)]);
// The real elapsed time for both requests together, not just one.
const blockingTotal = Date.now() - blockingStart;
// Prints the real measured number — not a claim, an actual timing result.
console.log(`1) Two concurrent /blocking requests (${WORK_MS}ms of synchronous work each): total real time ${blockingTotal}ms — serialized, ~2x the work, because the loop froze the whole server for each one`);

// Same idea, this time against /nonblocking, for a direct comparison.
const nonBlockingStart = Date.now();
// Same "fire two concurrent requests at the same route" approach as above.
await Promise.all([fetch(`${base}/nonblocking`), fetch(`${base}/nonblocking`)]);
const nonBlockingTotal = Date.now() - nonBlockingStart;
// This real number should land close to 1x WORK_MS, not 2x.
console.log(`2) Two concurrent /nonblocking requests (${WORK_MS}ms of async wait each): total real time ${nonBlockingTotal}ms — overlapped, ~1x the work, because neither one blocked the thread`);

// The real point of the whole demo, spelled out once at the end.
console.log(`\nSame ${WORK_MS}ms of "work" per request either way — the difference is entirely whether it blocks the one JS thread or lets other work interleave.`);

// Required, not just tidy: an open, listening server keeps Node's event
// loop alive forever. Without this line, this script would never exit.
server.close();
