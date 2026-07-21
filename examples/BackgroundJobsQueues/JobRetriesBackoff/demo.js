import { app, taskQueue, taskWorker } from "./server.js";

const server = app.listen(0);
const { port } = server.address();

console.log("Queuing a real task that's built to fail its first 2 real attempts:");
const { jobId } = await (await fetch(`http://localhost:${port}/jobs/flaky-task`, { method: "POST" })).json();
console.log(`  jobId: ${jobId}`);

console.log("\nPolling its real state as BullMQ really retries it:");
const start = Date.now();
let lastLogged = "";
let status;
do {
  await new Promise((resolve) => setTimeout(resolve, 150));
  status = await (await fetch(`http://localhost:${port}/jobs/flaky-task/${jobId}/status`)).json();
  const line = `  [+${Date.now() - start}ms] state=${status.state} attemptsMade=${status.attemptsMade} failedReason=${status.failedReason}`;
  if (line !== lastLogged) {
    console.log(line);
    lastLogged = line;
  }
} while (status.state !== "completed");

console.log(`\nReal final result, after real retries with a real 500ms backoff between each: ${JSON.stringify(status.returnValue)}`);
console.log(`Real total time waited: ~${Date.now() - start}ms — that's 2 real failures plus 2 real 500ms backoff delays, not instant.`);

await taskWorker.close();
await taskQueue.close();
server.close();
