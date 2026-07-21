import { Queue, Worker } from "bullmq";

// Scoped to THIS process's own real PID — keeps concurrent runs of this
// demo from ever sharing queue state. See co-founder/build-conventions.md.
const RUN_ID = process.pid;
export const QUEUE_NAME = `flaky-tasks-${RUN_ID}`;

const connection = { host: "localhost", port: 6379 };

export const taskQueue = new Queue(QUEUE_NAME, { connection });

// A task standing in for something that genuinely can fail sometimes for
// real — a flaky third-party API, a network blip — succeeding on a real
// retry. job.attemptsMade is 0 on the FIRST try, 1 on the second, and so
// on (confirmed directly): this deliberately fails the first two real
// attempts and only succeeds on the third.
export const taskWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.attemptsMade < 2) {
      throw new Error(`Deliberate real failure on attempt ${job.attemptsMade + 1}`);
    }
    return { succeededOnAttempt: job.attemptsMade + 1 };
  },
  { connection },
);
