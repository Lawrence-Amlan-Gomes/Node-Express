import express from "express";
import { pathToFileURL } from "node:url";
import emailRoutes from "./routes/email.routes.js";
import { emailQueue } from "./queues/email.queue.js";

const app = express();

// Needed here (unlike the previous section) because these routes read a
// real JSON body — express.json() parses it into req.body before the
// controller ever sees it.
app.use(express.json());
app.use("/", emailRoutes);

const PORT = process.env.PORT ?? 4108;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app, emailQueue };
