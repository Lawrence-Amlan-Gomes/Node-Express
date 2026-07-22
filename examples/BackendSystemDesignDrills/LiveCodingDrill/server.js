// server.js's job stays small on purpose: create the app, wire global
// middleware, mount the resource's routes, and start listening. No
// endpoint logic lives here — that's the controllers' job.
import express from "express";
import { pathToFileURL } from "node:url";
import bookmarksRouter from "./routes/bookmarks.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /bookmarks can read req.body.
app.use(express.json());

// Every request under "/bookmarks" is handed off to the real bookmarks
// router — server.js doesn't need to know what's inside that file.
app.use("/bookmarks", bookmarksRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. pathToFileURL is needed because process.argv[1] can be a
// relative path while import.meta.url is always an absolute file:// URL.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4118;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
