// "express" is the npm package we installed (npm install express). It's a
// library that makes it much easier to build a web server in Node — instead
// of writing raw low-level networking code, you get simple functions like
// app.get(...) to say "when a browser/client asks for this URL, run this code".
import express from "express";
import { pathToFileURL } from "node:url";

// express() creates the actual "app" — think of it as your whole website/API,
// before it's running. Every route we define below gets attached to this one
// object. We "export" it so demo.js (a separate file) can import this exact
// same app and test it, without needing its own copy.
export const app = express();

// This is a "route". In plain English: "when someone visits this app with a
// GET request to the path '/', run this function."
//   - req = the incoming Request — everything about what the client sent us
//   - res = the Response — how we reply back to them
app.get("/", (req, res) => {
  // res.json(...) sends back data as real JSON — this is the standard way
  // a backend API replies to a request (instead of sending back an HTML page).
  res.json({ message: "Basic Express 5 app — real routes below" });
});

// Everything above this line just DEFINES the app and its one route — it
// doesn't actually start a running server yet. app.listen(PORT) is the one
// line that does that for real, opening a real network port and waiting for
// requests. We only want that to happen when this file is run directly as
// "node server.js" — demo.js instead imports { app } from this file and
// starts its OWN temporary server on a random free port, so we don't want
// this file to also start listening in that case (that would be two servers
// fighting over ports). process.argv[1] is often a RELATIVE path
// ("server.js"), while import.meta.url is always an absolute file:// URL —
// pathToFileURL is the real fix (see co-founder/build-conventions.md's ESM
// main-module note for why a naive string comparison silently fails).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4000;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
