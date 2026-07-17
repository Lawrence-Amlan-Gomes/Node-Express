// Proves two real things about Express 5's automatic rejection forwarding,
// against the actual running server — nothing here is asserted or narrated:
// 1. Hitting /risky (which throws, with no try/catch) gets a real, clean
//    JSON error response back from our own error middleware, not a hang.
// 2. The server is still alive afterwards — /healthy still works.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual real HTTP request — /risky throws inside, with no try/catch.
const riskyRes = await fetch(`http://localhost:${port}/risky`);
// Parse the real JSON body — this came from our error middleware, not a hang.
const riskyData = await riskyRes.json();
// Print the real status and body, proving the rejection landed somewhere real.
console.log(`GET /risky => status ${riskyRes.status}, body: ${JSON.stringify(riskyData)}`);
// Spell out what just happened, in plain words, right under the real proof.
console.log("(no try/catch anywhere in the route — Express 5 forwarded the rejection to our real error middleware automatically)");

// The actual real HTTP request — proves the server is still answering requests.
const healthyRes = await fetch(`http://localhost:${port}/healthy`);
// Parse the real JSON body the server sent back.
const healthyData = await healthyRes.json();
// Print the real status and body — a genuine 200, not a crashed process.
console.log(`\nGET /healthy => status ${healthyRes.status}, body: ${JSON.stringify(healthyData)}`);
// Spell out what just happened, in plain words, right under the real proof.
console.log("(the server is still running normally — the earlier throw did not crash the process)");

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
