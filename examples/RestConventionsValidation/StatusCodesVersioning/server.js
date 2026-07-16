// Real proof that a well-designed REST API doesn't just return 200 for
// everything — the status code itself is part of the API's contract,
// telling a frontend (or any client) what actually happened without it
// needing to parse the response body first.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

// URL-path versioning: the version lives right in the path
// ("/api/v1/..."), not in a header or query param. This is the 2026
// gold standard specifically because it's explicit and cache-friendly —
// a CDN or browser cache can key on the URL alone, no special header
// inspection needed to know "this is a v1 response."
const v1 = express.Router();

let todos = [{ id: 1, title: "Learn REST status codes", done: false }];
let nextId = 2;

// 200 OK — the default "this worked, here's the data" response.
v1.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

// 201 Created — specifically for a successful CREATE, not a generic 200.
// A real API also sets the Location header to the new resource's real URL.
v1.post("/todos", (req, res) => {
  const { title } = req.body;
  if (!title) {
    // 400 Bad Request — the CLIENT sent something wrong (missing data),
    // as opposed to a 500, which would mean the SERVER itself broke.
    return res.status(400).json({ error: "title is required" });
  }
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  res.status(201).location(`/api/v1/todos/${todo.id}`).json(todo);
});

// 200 vs 404 — the same route shape, two different real outcomes
// depending on whether the resource actually exists.
v1.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }
  res.status(200).json(todo);
});

// 204 No Content — a successful DELETE that has nothing left to send
// back. Real APIs send an EMPTY body with 204, never a JSON body.
v1.delete("/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).end();
});

app.use("/api/v1", v1);

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4041;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
