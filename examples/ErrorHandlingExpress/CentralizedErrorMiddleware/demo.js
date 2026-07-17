// Proves the centralized error middleware really does pick a DIFFERENT real
// status code depending on what kind of error it receives — a custom
// AppError with its own statusCode vs. a plain, unplanned Error.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// Real request #1: a known user id — should succeed normally.
const knownRes = await fetch(`http://localhost:${port}/users/1`);
// Parse the real JSON body the server sent back.
const knownData = await knownRes.json();
// Print the real status and body — a genuine 200, nothing thrown.
console.log(`GET /users/1 (a real, known user) => status ${knownRes.status}, body: ${JSON.stringify(knownData)}`);

// Real request #2: an unknown user id — the route throws AppError(..., 404).
const missingRes = await fetch(`http://localhost:${port}/users/999`);
// Parse the real JSON body the server sent back.
const missingData = await missingRes.json();
// Print the real status and body — proves the AppError's 404 made it through.
console.log(`GET /users/999 (throws AppError("...", 404)) => status ${missingRes.status}, body: ${JSON.stringify(missingData)}`);

// Real request #3: an unplanned bug — a plain Error with no statusCode at all.
const bugRes = await fetch(`http://localhost:${port}/unexpected-bug`);
// Parse the real JSON body the server sent back.
const bugData = await bugRes.json();
// Print the real status and body — proves the fallback-to-500 rule fired.
console.log(`GET /unexpected-bug (throws a plain Error, no statusCode) => status ${bugRes.status}, body: ${JSON.stringify(bugData)}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
