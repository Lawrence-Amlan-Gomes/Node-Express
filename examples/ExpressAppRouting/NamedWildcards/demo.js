// Two real proofs in one script:
// 1) the NEW Express 5 named-wildcard route actually works, and its match
//    comes back as a real array of path segments.
// 2) the OLD Express 4 bare "*" wildcard genuinely throws now — on a
//    separate, throwaway express() instance, so it doesn't affect the real
//    app above at all.
import express from "express";
import { app } from "./server.js";

// Port 0 means "give me any free port" for this real, temporary server.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// A real request against a real multi-segment path.
const res = await fetch(`http://localhost:${port}/files/a/b/c.txt`);
// Parse the real JSON body — this is where the real splat array shows up.
const data = await res.json();
// Print the real status and body — the splat array shows up here for real.
console.log(`1) GET /files/a/b/c.txt => status ${res.status}, body: ${JSON.stringify(data)}`);

// Done with proof #1 — shut this real server down before starting proof #2.
server.close();

// A brand new, separate Express app — used only to test registering the
// OLD wildcard syntax, kept fully apart from the real app above.
const throwawayApp = express();
try {
  // This is the actual Express 4 syntax — expected to throw on Express 5.
  throwawayApp.get("/old-style/*", (req, res) => res.end("old"));
  // Only reached if the line above did NOT throw — would mean Express still allows it.
  console.log("2) Registering a bare '*' wildcard (Express 4 style) worked — unexpected on Express 5!");
} catch (err) {
  // Reached instead, for real — prints the real error Express actually threw.
  console.log(`2) Registering a bare '*' wildcard (Express 4 style) THREW: ${err.message}`);
}
