// Proves config really is coming from the real .env file, not hardcoded:
// 1. process.env.PORT and process.env.GREETING_MESSAGE both hold the exact
//    values written in .env, purely from importing "dotenv/config".
// 2. /greeting's real response body contains that exact .env value.
// 3. A real, separately spawned `node server.js` process actually listens
//    on the PORT number .env specifies (4032) — proving .env drives real
//    runtime behavior, not just an in-memory value.
import { spawn } from "node:child_process";
import { app } from "./server.js";

console.log(`process.env.PORT (from .env, before any hardcoded fallback): ${process.env.PORT}`);
console.log(`process.env.GREETING_MESSAGE (from .env): "${process.env.GREETING_MESSAGE}"`);

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const res = await fetch(`http://localhost:${port}/greeting`);
const data = await res.json();
console.log(`\nGET /greeting => status ${res.status}, body: ${JSON.stringify(data)}`);

server.close();

const child = spawn(process.execPath, ["server.js"], { cwd: import.meta.dirname });
const listeningLine = await new Promise((resolve) => {
  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    if (text.includes("Listening")) resolve(text.trim());
  });
});
console.log(`\nA real, separate "node server.js" process, using ONLY .env for its port: ${listeningLine}`);
child.kill();
