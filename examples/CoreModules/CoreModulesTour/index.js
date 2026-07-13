import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import http from "node:http";
import { EventEmitter } from "node:events";

// 1) path — real path building, no string concatenation
const filePath = path.join(os.tmpdir(), "node-express-playground-notes.txt");
console.log(`1) path.join(os.tmpdir(), "...") => ${filePath}`);

// 2) fs — a real file, actually written and read back on every run
fs.writeFileSync(filePath, "Real note written by fs.writeFileSync\n");
const contents = fs.readFileSync(filePath, "utf-8");
console.log(`2) fs.writeFileSync + fs.readFileSync => "${contents.trim()}"`);

// 3) Buffer — real raw bytes, not just a string
const buf = Buffer.from("Node", "utf-8");
console.log(`3) Buffer.from("Node") => bytes: [${buf.join(", ")}], toString(): "${buf.toString()}"`);

// 4) structuredClone — a real Web-standard global Node now ships natively
const original = { nested: { count: 1 }, list: [1, 2, 3] };
const clone = structuredClone(original);
clone.nested.count = 99;
console.log(`4) structuredClone => original.nested.count still ${original.nested.count}, clone.nested.count now ${clone.nested.count}`);

// 5) EventEmitter — a real custom event, real listener
const bus = new EventEmitter();
bus.on("greet", (name) => console.log(`5) EventEmitter "greet" listener fired with name="${name}"`));
bus.emit("greet", "Lawrence");

// 6) process — real values from the actual running process
console.log(`6) process => version: ${process.version}, platform: ${process.platform}, argv[0]: ${path.basename(process.argv[0])}`);

// 7) Headers / FormData — real Web-standard globals, no polyfill needed
const headers = new Headers({ "X-Demo": "core-modules" });
console.log(`7) new Headers(...).get("X-Demo") => "${headers.get("X-Demo")}"`);

const form = new FormData();
form.append("name", "Lawrence");
console.log(`8) new FormData().get("name") => "${form.get("name")}"`);

// 9) fetch — a real HTTP round trip against a real local server this script
// actually starts itself, no external network dependency, no mocking.
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "real response from a real local http server" }));
});

await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();
const response = await fetch(`http://localhost:${port}/`);
const data = await response.json();
console.log(`9) fetch("http://localhost:${port}/") => status: ${response.status}, body: ${JSON.stringify(data)}`);

server.close();
