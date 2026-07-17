// express.static() is Express's built-in middleware for serving REAL files
// straight off disk — HTML, CSS, images, whatever's in the given folder —
// with no route handler needed for each one individually. This is exactly
// how a backend would serve a simple website, or serve a frontend's built
// files (the actual bridge point between a frontend team's build output and
// a backend server), alongside its own JSON API on the SAME app.
import express from "express";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// Registered here, near the top: any request whose path matches a real
// file inside public/ (e.g. GET / matches public/index.html by default,
// GET /index.html matches it explicitly) gets that file's real contents
// sent back automatically — no code of ours runs for those requests at
// all. import.meta.dirname is the real, absolute folder this file lives
// in, so "public" is resolved relative to THIS file, not whatever
// directory the process happens to be started from.
app.use(express.static(path.join(import.meta.dirname, "public")));

// A completely separate concern: a real JSON API endpoint, living on the
// exact same app as the static files above. Nothing about express.static()
// interferes with this — it only responds to requests that match a REAL
// file in public/, and lets everything else fall through to whatever's
// registered next.
app.get("/api/status", (req, res) => {
  // Send back real JSON — proof this route runs for paths express.static() skipped.
  res.json({ status: "ok", servedBy: "the JSON API, not a static file" });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener
// instead. process.argv[1] is often a relative path while import.meta.url is
// always an absolute file:// URL, so pathToFileURL is needed for a correct
// comparison (see co-founder/build-conventions.md's ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4031;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
