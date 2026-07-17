// "dotenv" is an npm package that reads a real .env file (plain text,
// KEY=value per line) sitting next to your code and copies those values
// onto process.env — the exact same global object Node already uses for
// real environment variables (PORT, NODE_ENV, etc.). This one line has to
// run before anything else that reads process.env.SOMETHING, so config is
// ready by the time the rest of the file needs it.
import "dotenv/config";
import express from "express";
import { pathToFileURL } from "node:url";

// Creates the real, empty Express app every route below attaches to.
export const app = express();

// Nothing here is hardcoded. GREETING_MESSAGE lives in .env, not in this
// file — change the .env file, and this route's response changes with it,
// with zero code edits. That's the entire point of environment config: the
// same code behaves differently in dev/staging/prod purely by which real
// values happen to be in each environment's .env (or real environment
// variables, in a real deployment).
app.get("/greeting", (req, res) => {
  // Send back the real value that "dotenv/config" copied onto process.env.
  res.json({ message: process.env.GREETING_MESSAGE });
});

// Node itself now has a built-in, dotenv-free way to do this too, verified
// directly on this project's pinned Node version: `node --env-file=.env
// server.js`, or process.loadEnvFile() called manually in code. dotenv is
// still the far more common choice in real, existing job codebases (and
// works identically across older Node versions too), which is why it's the
// pattern taught here — but knowing Node's native option exists is a real,
// current (2026) fact worth having for an interview.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Falls back to 3000 only if .env somehow didn't set PORT — in this
  // example it always does, so the real .env value (4032) wins.
  const PORT = process.env.PORT ?? 3000;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
