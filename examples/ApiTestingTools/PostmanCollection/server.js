// The same small "todos" API as the curl-workflow example — this server
// always listens on a fixed, known port, since a Postman collection needs a
// real, stable URL to point at.
import express from "express";

const app = express();
app.use(express.json());

let todos = [
  { id: 1, text: "Learn Express routing", done: true },
  { id: 2, text: "Learn the middleware pipeline", done: true },
  { id: 3, text: "Learn how to explore an API manually", done: false },
];

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
});

app.post("/todos", (req, res) => {
  const newTodo = { id: todos.length + 1, text: req.body.text, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

const PORT = 4011;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
