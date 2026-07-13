// This file imports the SAME real app defined in server.js and tests every
// route on it by actually calling them over real HTTP, the same way a
// browser or another program would. app.listen(0, ...) with port 0 means
// "give me any free port" — that's just so this demo never collides with
// something else already using a fixed port.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

// A small helper so we don't repeat "make a request, read the JSON, print
// it" for each route below.
async function show(label, method, url, body) {
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

await show("1) Route param (req.params)", "GET", "/greet/Lawrence");
await show("2) Query param (req.query)", "GET", "/search?q=express");
await show("3) A real JSON body (express.json())", "POST", "/echo", { hello: "world" });
await show("4) A modular express.Router(), mounted at /api", "GET", "/api/status");
await show("5) The real default 404 for anything unmatched", "GET", "/does-not-exist");

server.close();
