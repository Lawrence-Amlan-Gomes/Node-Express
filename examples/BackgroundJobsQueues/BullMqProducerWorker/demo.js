// Every real run gets its own real, unique queue name — keeps concurrent
// runs of this demo from ever sharing queue state. This has to be set
// BEFORE server.js loads, and a plain top-level `import` is hoisted above
// any code in this file regardless of where it's written — so server.js
// is loaded dynamically, after the env var is really set.
process.env.QUEUE_NAME = `welcome-emails-${process.pid}`;

import { spawn } from "node:child_process";

const { app, emailQueue } = await import("./server.js");

const server = app.listen(0);
const { port } = server.address();

// The real worker runs as a genuinely separate OS process — the whole
// point of this section. It inherits QUEUE_NAME (and everything else in
// process.env) via the spread below, so it consumes from the SAME real
// queue this producer just created.
const worker = spawn("node", ["worker.js"], { cwd: import.meta.dirname, env: { ...process.env } });

let fullLog = "";
worker.stdout.on("data", (chunk) => {
  process.stdout.write(`  [worker log] ${chunk}`);
  fullLog += chunk.toString();
});

// A real, hard-capped wait for the real worker's own "ready" log line —
// never assume it's ready just because spawn() returned successfully.
const readyDeadline = Date.now() + 10_000;
while (!fullLog.includes("Real worker ready.")) {
  if (Date.now() > readyDeadline) {
    throw new Error("Timed out waiting for the real, separate worker process to report ready.");
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
}

console.log("\nReal, separate worker process is ready. The producer now queues 3 real jobs:");

const jobs = [];
for (const email of ["alice@example.com", "bob@example.com", "carol@example.com"]) {
  const response = await (
    await fetch(`http://localhost:${port}/jobs/welcome-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
  ).json();
  jobs.push(response);
  console.log(`  Producer queued a real job: ${JSON.stringify(response)}`);
}

console.log("\nPolling each real job until the SEPARATE worker process completes it:");
for (const { jobId, queuedFor } of jobs) {
  let status;
  do {
    await new Promise((resolve) => setTimeout(resolve, 200));
    status = await (await fetch(`http://localhost:${port}/jobs/welcome-email/${jobId}/status`)).json();
  } while (status.state !== "completed");
  console.log(`  Job ${jobId} (${queuedFor}) completed by the OTHER real process: ${JSON.stringify(status.returnValue)}`);
}

console.log(
  "\nReal result: the producer (this process) never ran any of the slow work itself — a genuinely separate real OS process did, proven by its own separate real stdout logged above.",
);

worker.kill("SIGTERM");
await emailQueue.close();
server.close();
