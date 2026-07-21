// Shared between the producer (server.js, via email.queue.js) and the
// real, SEPARATE worker process (worker.js) — both have to agree on the
// exact same real queue name and Redis connection to actually talk to
// each other through Redis.
export const QUEUE_NAME = process.env.QUEUE_NAME ?? "welcome-emails";
export const connection = { host: "localhost", port: 6379 };
