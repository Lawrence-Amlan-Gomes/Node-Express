import express from "express";
import { pathToFileURL } from "node:url";
import taskRoutes from "./routes/task.routes.js";
import { taskQueue, taskWorker } from "./queues/task.queue.js";

const app = express();

app.use("/", taskRoutes);

const PORT = process.env.PORT ?? 4109;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app, taskQueue, taskWorker };
