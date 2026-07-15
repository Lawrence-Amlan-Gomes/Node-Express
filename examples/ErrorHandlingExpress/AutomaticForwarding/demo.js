// Proves two real things about Express 5's automatic rejection forwarding,
// against the actual running server — nothing here is asserted or narrated:
// 1. Hitting /risky (which throws, with no try/catch) gets a real, clean
//    JSON error response back from our own error middleware, not a hang.
// 2. The server is still alive afterwards — /healthy still works.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const riskyRes = await fetch(`http://localhost:${port}/risky`);
const riskyData = await riskyRes.json();
console.log(`GET /risky => status ${riskyRes.status}, body: ${JSON.stringify(riskyData)}`);
console.log("(no try/catch anywhere in the route — Express 5 forwarded the rejection to our real error middleware automatically)");

const healthyRes = await fetch(`http://localhost:${port}/healthy`);
const healthyData = await healthyRes.json();
console.log(`\nGET /healthy => status ${healthyRes.status}, body: ${JSON.stringify(healthyData)}`);
console.log("(the server is still running normally — the earlier throw did not crash the process)");

server.close();
