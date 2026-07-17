// The same small "todos" API as the other tools examples — this server
// always listens on a fixed, known port, since a .http file needs a real,
// stable URL to point at.
import express from "express";

const app = express();
// Without this, req.body would be undefined even on a real POST with JSON.
app.use(express.json());

// A plain in-memory array — real enough to practice on, resets on restart.
let todos = [
  { id: 1, text: "Learn Express routing", done: true },
  { id: 2, text: "Learn the middleware pipeline", done: true },
  { id: 3, text: "Learn how to explore an API manually", done: false },
];

// GET /todos — returns the whole real list, as real JSON.
app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos/:id", (req, res) => {
  // req.params.id always arrives as a string — Number(...) converts it so
  // the comparison against a real numeric id actually matches.
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    // A real 404 when nothing matches — not a silent empty response.
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
});

app.post("/todos", (req, res) => {
  // req.body.text is only real because of express.json() above.
  const newTodo = { id: todos.length + 1, text: req.body.text, done: false };
  todos.push(newTodo);
  // 201 Created — the correct real status code for "something was made".
  res.status(201).json(newTodo);
});

const PORT = 4012;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
