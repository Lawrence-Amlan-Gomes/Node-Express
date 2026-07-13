// Two real proofs in one script:
// 1) the NEW Express 5 named-wildcard route actually works, and its match
//    comes back as a real array of path segments.
// 2) the OLD Express 4 bare "*" wildcard genuinely throws now — on a
//    separate, throwaway express() instance, so it doesn't affect the real
//    app above at all.
import express from "express";
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const res = await fetch(`http://localhost:${port}/files/a/b/c.txt`);
const data = await res.json();
console.log(`1) GET /files/a/b/c.txt => status ${res.status}, body: ${JSON.stringify(data)}`);

server.close();

const throwawayApp = express();
try {
  throwawayApp.get("/old-style/*", (req, res) => res.end("old"));
  console.log("2) Registering a bare '*' wildcard (Express 4 style) worked — unexpected on Express 5!");
} catch (err) {
  console.log(`2) Registering a bare '*' wildcard (Express 4 style) THREW: ${err.message}`);
}
