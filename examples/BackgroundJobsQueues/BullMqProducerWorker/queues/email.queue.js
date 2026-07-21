import { Queue } from "bullmq";
import { QUEUE_NAME, connection } from "./connection.js";

// The PRODUCER side only. It writes real jobs into Redis and has no idea
// which process, or how many, will actually pick each one up — that's
// worker.js's job entirely, running as its own separate real process.
export const emailQueue = new Queue(QUEUE_NAME, { connection });
