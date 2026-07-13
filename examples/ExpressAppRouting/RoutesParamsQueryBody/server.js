import express from "express";
import { pathToFileURL } from "node:url";
import apiRouter from "./api-routes.js";

export const app = express();

// Express doesn't read the body of a request by default — a "middleware" is
// a function that runs on EVERY request before your actual route code does.
// express.json() is a built-in middleware: if the incoming request has a
// JSON body, it reads it and turns it into a normal JS object, available as
// req.body. Without this line, req.body would just be undefined, even if the
// client really did send JSON — a very common beginner mistake.
app.use(express.json());

// A route can have a placeholder in its path, written with a colon (:name).
// If someone visits "/greet/Lawrence", Express matches "Lawrence" against
// :name and makes it available as req.params.name.
app.get("/greet/:name", (req, res) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

// A "query string" is the ?key=value part of a URL, e.g. "/search?q=express".
// Express automatically parses that into a plain object on req.query — here,
// req.query.q would be "express".
app.get("/search", (req, res) => {
  res.json({ query: req.query.q ?? null, receivedQuery: req.query });
});

// This route only responds to POST requests (used for actually sending data
// to the server, not just asking for it). Because of the express.json()
// middleware above, req.body already contains the real parsed JSON that was
// sent — we're just echoing it straight back here to prove it arrived.
app.post("/echo", (req, res) => {
  res.json({ youSent: req.body });
});

// apiRouter is imported from api-routes.js — a REAL separate file, not
// defined here. This is the actual pattern real Express apps use to avoid
// putting every single route in one giant server.js: each related group of
// routes gets its own file, and server.js just imports and mounts them.
// app.use("/api", apiRouter) means: any request that starts with "/api" gets
// handed off to apiRouter to handle. So a request to "/api/status" actually
// runs the "/status" route defined in api-routes.js, because Express adds
// the "/api" prefix automatically — apiRouter itself has no idea it's
// mounted at "/api", it just knows about "/status".
app.use("/api", apiRouter);

// This is a "catch-all" — since it's the very LAST piece of middleware/route
// registered, Express only reaches it if NOTHING above matched the request.
// We use it to send back a proper 404 ("not found") instead of the request
// just hanging with no response.
app.use((req, res) => {
  res.status(404).json({ error: "not found", path: req.path });
});

// Only actually listen when this file is run directly (`node server.js`) —
// see co-founder/build-conventions.md's ESM main-module note.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4001;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
