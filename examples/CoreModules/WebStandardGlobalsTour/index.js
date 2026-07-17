// node:http is still a real Node core module — used here only to give
// fetch() below something real to actually call.
import http from "node:http";

// 1) structuredClone — a real deep clone, built right into Node/JS
// itself. No JSON.parse(JSON.stringify(...)) hack needed.
const original = { nested: { count: 1 }, list: [1, 2, 3] };
// Make a real deep copy of the object above.
const clone = structuredClone(original);
// Changing the clone's nested object must NOT change the original —
// that's the entire point of a real deep clone, proven live below.
clone.nested.count = 99;
console.log(`1) structuredClone => original.nested.count still ${original.nested.count}, clone.nested.count now ${clone.nested.count}`);

// 2) Headers — the same Web-standard Headers object used in a browser's
// fetch code, now a real Node global too, no import needed.
const headers = new Headers({ "X-Demo": "core-modules" });
console.log(`2) new Headers(...).get("X-Demo") => "${headers.get("X-Demo")}"`);

// 3) FormData — real multipart-form-shaped data, without installing a
// separate form-data npm package.
const form = new FormData();
form.append("name", "Lawrence");
console.log(`3) new FormData().get("name") => "${form.get("name")}"`);

// 4) fetch — a real HTTP round trip. This script starts an ACTUAL local
// server itself first, so there's something real for fetch to call —
// no external network, no mocking.
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "real response from a real local http server" }));
});

// Port 0 means "give me any free port" — resolve only once it's really
// listening, so fetch below never races a server that isn't ready yet.
await new Promise((resolve) => server.listen(0, resolve));
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();

// The actual fetch() call — same function you'd use in a browser.
const response = await fetch(`http://localhost:${port}/`);
// Parse the real JSON body the server above sent back.
const data = await response.json();
console.log(`4) fetch("http://localhost:${port}/") => status: ${response.status}, body: ${JSON.stringify(data)}`);

// Node only exits on its own once nothing is left keeping it alive — a
// listening server counts as "still alive." Without this line, this
// script would hang forever instead of finishing.
server.close();
