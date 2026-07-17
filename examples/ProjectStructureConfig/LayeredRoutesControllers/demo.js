// Proves the layered app works exactly like a single-file version would,
// from the client's point of view — the layering is an internal
// organization choice, invisible over HTTP.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
// Every fetch() call below reuses this same base URL.
const base = `http://localhost:${port}`;

// A small helper so we don't repeat "make a request, read the JSON, print
// it" for each route below.
async function show(label, method, url, body) {
  // The actual real HTTP request — travels through the router, into the controller.
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  // Parse the real JSON response body the server sent back.
  const data = await res.json();
  // Print the real status and body, proving the layered route actually ran.
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

// Real request #1: routed through todos.routes.js into listTodos.
await show("1) List every todo (routes/todos.routes.js => controllers/todos.controller.js's listTodos)", "GET", "/todos");
// Real request #2: routed into getTodoById.
await show("2) Get one todo by id (=> getTodoById)", "GET", "/todos/1");
// Real request #3: routed into createTodo — actually adds a real entry.
await show("3) Create a new todo (=> createTodo)", "POST", "/todos", { text: "See the layers in action" });

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
