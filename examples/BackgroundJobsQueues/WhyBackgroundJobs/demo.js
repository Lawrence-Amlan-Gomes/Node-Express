import { app, reportQueue, reportWorker } from "./server.js";

// Port 0 — a real, OS-assigned, always-free port for this demo's own
// throwaway server instance. See co-founder/build-conventions.md.
const server = app.listen(0);
const { port } = server.address();

console.log("Real SYNC route — the request blocks until the real 2-second task finishes:");
const sync = await (await fetch(`http://localhost:${port}/reports/sync`, { method: "POST" })).json();
console.log(JSON.stringify(sync, null, 2));

console.log('\nReal ASYNC route — the SAME slow task, but enqueued instead of awaited directly:');
const asyncResult = await (await fetch(`http://localhost:${port}/reports/async`, { method: "POST" })).json();
console.log(JSON.stringify(asyncResult, null, 2));

const speedup = (sync.tookMs / Math.max(asyncResult.tookMs, 1)).toFixed(0);
console.log(`\nReal measured response-time speed-up from not blocking: ~${speedup}x faster.`);

console.log("\nThe real work still has to happen somewhere — polling the real job until the worker finishes it:");
let status;
do {
  await new Promise((resolve) => setTimeout(resolve, 200));
  status = await (await fetch(`http://localhost:${port}/reports/${asyncResult.jobId}/status`)).json();
  console.log(`  Real job state: ${status.state}`);
} while (status.state !== "completed");

console.log(`\nReal job completed for real, just not inside the original request: ${JSON.stringify(status.returnValue)}`);

await reportWorker.close();
await reportQueue.close();
server.close();
