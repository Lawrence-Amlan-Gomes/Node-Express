import { app, ticker } from "./server.js";

// Port 0 asks the OS for a real, always-free port — this demo's own
// server is throwaway, separate from the fixed port the PostmanCheck
// walkthrough documents. See co-founder/build-conventions.md.
const server = app.listen(0);
const { port } = server.address();

console.log("Polling GET /latest-price every 300ms, for 3 real seconds:");

const seenChangedAt = new Set();
let totalRequests = 0;
let wastedRequests = 0;
const start = Date.now();

// A real client loop, doing exactly what naive polling code does: ask
// again, wait a bit, ask again — with no idea whether anything actually
// changed since the last ask.
while (Date.now() - start < 3000) {
  const response = await (await fetch(`http://localhost:${port}/latest-price`)).json();
  totalRequests++;

  if (seenChangedAt.has(response.changedAt)) {
    // The real price hasn't changed since our last poll — this whole real
    // request was wasted, just to learn "still the same."
    wastedRequests++;
  } else {
    seenChangedAt.add(response.changedAt);
    console.log(`  Real new price seen: $${response.price}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 300));
}

console.log(`\nReal total requests made: ${totalRequests}`);
console.log(`Real distinct price changes actually seen: ${seenChangedAt.size}`);
console.log(`Real wasted requests (server said "nothing new"): ${wastedRequests}`);
console.log("\nThat's the real cost of polling: most requests exist only to be told nothing happened.");

clearInterval(ticker);
server.close();
