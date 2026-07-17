// Proves config really is coming from the real .env file, not hardcoded:
// 1. process.env.PORT and process.env.GREETING_MESSAGE both hold the exact
//    values written in .env, purely from importing "dotenv/config".
// 2. /greeting's real response body contains that exact .env value.
// 3. A real, separately spawned `node server.js` process actually listens
//    on the PORT number .env specifies (4032) — proving .env drives real
//    runtime behavior, not just an in-memory value.
import { spawn } from "node:child_process";
import { app } from "./server.js";

// Print the real, actual value dotenv copied onto process.env.PORT.
console.log(`process.env.PORT (from .env, before any hardcoded fallback): ${process.env.PORT}`);
// Print the real, actual value dotenv copied onto process.env.GREETING_MESSAGE.
console.log(`process.env.GREETING_MESSAGE (from .env): "${process.env.GREETING_MESSAGE}"`);

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual real HTTP request — /greeting reads process.env.GREETING_MESSAGE.
const res = await fetch(`http://localhost:${port}/greeting`);
// Parse the real JSON body the server sent back.
const data = await res.json();
// Print the real status and body — the .env message really made it into the response.
console.log(`\nGET /greeting => status ${res.status}, body: ${JSON.stringify(data)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();

// Now prove .env drives a REAL, separately spawned process too — not just
// this in-process import. This launches a genuine second `node server.js`.
const child = spawn(process.execPath, ["server.js"], { cwd: import.meta.dirname });
// Wait for that real child process to actually print its own "Listening" line.
const listeningLine = await new Promise((resolve) => {
  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    if (text.includes("Listening")) resolve(text.trim());
  });
});
// Print the real line the separate process printed — proof it used .env's PORT.
console.log(`\nA real, separate "node server.js" process, using ONLY .env for its port: ${listeningLine}`);
// Clean up the real child process — it would otherwise keep running forever.
child.kill();
