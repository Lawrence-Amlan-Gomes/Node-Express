// server.js's job is small on purpose: create the app, wire in global
// middleware, mount the real routes, and start listening. The real AWS
// SDK calls live one layer down, in controllers/.
//
// Unlike this project's Prisma-based examples (Prisma's own client
// auto-loads a real .env file by itself), the AWS SDK does NOT — it only
// ever reads real values already sitting in process.env. This import
// has to run before the controller below is loaded, or every real S3
// call fails with a real "Region is missing" error.
import "dotenv/config";
import express from "express";
import { pathToFileURL } from "node:url";
import photosRouter from "./routes/photos.routes.js";

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /photos/upload-url can read req.body.
app.use(express.json());

// Every request under "/photos" is handed off to the real photos router.
app.use("/photos", photosRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url
// is always an absolute file:// URL, so pathToFileURL is needed for a
// correct comparison (see co-founder/build-conventions.md's ESM
// main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this
  // file directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4083;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
