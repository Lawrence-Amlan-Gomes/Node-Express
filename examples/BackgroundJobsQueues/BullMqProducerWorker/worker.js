// A genuinely SEPARATE real Node process from server.js — this file is
// never imported by the producer. It's meant to be run on its own
// (`node worker.js`), exactly like a real production deployment would run
// its workers on their own real machines/containers, entirely apart from
// the API servers that add jobs.
import { Worker } from "bullmq";
import { QUEUE_NAME, connection } from "./queues/connection.js";

console.log(`Real worker starting, listening on queue "${QUEUE_NAME}"...`);

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`Real worker (PID ${process.pid}) picked up job ${job.id} for ${job.data.email}`);
    // Real, deliberately slow simulated work — a real email send would
    // genuinely take time over a real network too.
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Real worker (PID ${process.pid}) finished job ${job.id}`);
    return { sentTo: job.data.email, sentAt: Date.now() };
  },
  { connection },
);

// BullMQ's own real "ready" event — fires once this worker has actually
// connected to Redis and can start pulling real jobs.
worker.on("ready", () => {
  console.log("Real worker ready.");
});
