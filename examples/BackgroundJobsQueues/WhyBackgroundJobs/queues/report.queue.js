import { Queue, Worker } from "bullmq";

// Every real job on this queue is scoped to THIS process's own real PID —
// keeps concurrent runs of this demo from ever sharing queue state, same
// lesson as the Redis-key race in co-founder/build-conventions.md, just
// applied to a BullMQ queue name instead of a plain cache key.
const RUN_ID = process.pid;
export const QUEUE_NAME = `reports-${RUN_ID}`;

const connection = { host: "localhost", port: 6379 };

// The QUEUE is how a real producer (an Express route handler) adds work —
// it never does the work itself, it only ever writes a real job into
// Redis and hands back immediately.
export const reportQueue = new Queue(QUEUE_NAME, { connection });

// A real, deliberately slow task — standing in for real report generation
// (querying a database, building a PDF, anything that genuinely takes
// several real seconds).
function generateReportSlowly() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ generatedAt: Date.now() }), 2000);
  });
}

// The WORKER is what actually pulls real jobs off the queue and does the
// slow work. Kept in the SAME process here only for this section's own
// simplicity — the next section builds the real, separate-process version
// production code actually uses.
export const reportWorker = new Worker(
  QUEUE_NAME,
  async () => {
    return generateReportSlowly();
  },
  { connection }
);
