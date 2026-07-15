// Proves the layered app works exactly like a single-file version would,
// from the client's point of view — the layering is an internal
// organization choice, invisible over HTTP.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

async function show(label, method, url, body) {
  const res = await fetch(`${base}${url}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  console.log(`${label}\n  ${method} ${url} => status ${res.status}, body: ${JSON.stringify(data)}`);
}

await show("1) List every todo (routes/todos.routes.js => controllers/todos.controller.js's listTodos)", "GET", "/todos");
await show("2) Get one todo by id (=> getTodoById)", "GET", "/todos/1");
await show("3) Create a new todo (=> createTodo)", "POST", "/todos", { text: "See the layers in action" });

server.close();
