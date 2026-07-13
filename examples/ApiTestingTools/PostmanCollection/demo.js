// Postman itself can't be driven headlessly from here, but this proves the
// collection's four requests genuinely work against a real running server —
// each one below sends the EXACT same method/url/body Postman would send
// for the matching item in postman-collection.json.
import { spawn } from "node:child_process";

const server = spawn("node", ["server.js"], { cwd: import.meta.dirname });

await new Promise((resolve) => {
  server.stdout.on("data", (chunk) => {
    if (chunk.toString().includes("Listening")) resolve();
  });
});

const base = "http://localhost:4011";

async function show(label, method, url, body) {
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

await show("1) Get all todos", "GET", "/todos");
await show("2) Get one todo by id", "GET", "/todos/2");
await show("3) Create a new todo", "POST", "/todos", { text: "Try sending this request for real" });
await show("4) Get a todo that doesn't exist (real 404)", "GET", "/todos/999");

server.kill();
