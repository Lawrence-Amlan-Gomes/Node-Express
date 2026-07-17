import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();

// A "wildcard" route matches a whole family of URLs at once, not just one
// exact path. Express 5 changed how this works compared to older versions:
// you now have to give the wildcard a NAME (here, "splat") instead of just
// writing a bare "*". Visiting "/files/a/b/c.txt" matches this route, and
// req.params.splat comes back as a real array: ["a", "b", "c.txt"] — one
// entry per part of the path after "/files/".
app.get("/files/*splat", (req, res) => {
  // Send back the real matched array — proof it's an array, not a string.
  res.json({ message: "wildcard match", splat: req.params.splat });
});

// Only actually listen when this file is run directly (`node server.js`) —
// see co-founder/build-conventions.md's ESM main-module note.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4006;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
