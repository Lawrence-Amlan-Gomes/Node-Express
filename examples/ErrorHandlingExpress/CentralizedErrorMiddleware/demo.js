// Proves the centralized error middleware really does pick a DIFFERENT real
// status code depending on what kind of error it receives — a custom
// AppError with its own statusCode vs. a plain, unplanned Error.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const knownRes = await fetch(`http://localhost:${port}/users/1`);
const knownData = await knownRes.json();
console.log(`GET /users/1 (a real, known user) => status ${knownRes.status}, body: ${JSON.stringify(knownData)}`);

const missingRes = await fetch(`http://localhost:${port}/users/999`);
const missingData = await missingRes.json();
console.log(`GET /users/999 (throws AppError("...", 404)) => status ${missingRes.status}, body: ${JSON.stringify(missingData)}`);

const bugRes = await fetch(`http://localhost:${port}/unexpected-bug`);
const bugData = await bugRes.json();
console.log(`GET /unexpected-bug (throws a plain Error, no statusCode) => status ${bugRes.status}, body: ${JSON.stringify(bugData)}`);

server.close();
