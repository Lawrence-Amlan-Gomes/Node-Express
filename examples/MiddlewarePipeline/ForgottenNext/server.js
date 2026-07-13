// This example proves that forgetting to call next() (and not sending a
// response either) really does hang a request forever.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// This middleware deliberately does nothing: no next(), no res.send/json,
// nothing. For any request to /hangs, this is a dead end — the request
// will sit open forever, waiting for a response that's never coming. This
// is a real, common backend bug (usually accidental — a forgotten next() in
// an if-branch, not on purpose like here).
app.use("/hangs", (req, res, next) => {
  // intentionally empty — this is the bug, demonstrated on purpose
});
app.get("/hangs", (req, res) => {
  res.json({ message: "you should never see this — the middleware above never lets us get here" });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4005;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
