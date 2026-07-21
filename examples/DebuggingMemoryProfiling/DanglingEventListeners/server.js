import express from "express";
import { pathToFileURL } from "node:url";
import listenersRoutes from "./routes/listeners.routes.js";

const app = express();

app.use("/", listenersRoutes);

const PORT = process.env.PORT ?? 4093;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Logs the server's own real bound port via server.address(), not the
  // requested PORT value — the two differ when PORT is 0 (the OS assigns
  // whatever's actually free), which demo.js relies on below.
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
