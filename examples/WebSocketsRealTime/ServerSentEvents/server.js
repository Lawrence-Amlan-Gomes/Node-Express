import express from "express";
import { pathToFileURL } from "node:url";
import eventsRoutes from "./routes/events.routes.js";

const app = express();

app.use("/", eventsRoutes);

const PORT = process.env.PORT ?? 4104;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
