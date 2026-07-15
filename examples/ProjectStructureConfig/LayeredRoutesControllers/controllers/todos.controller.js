// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one. This separation is
// what lets a real backend grow past a handful of endpoints without
// server.js turning into an unreadable wall of code.

// A tiny in-memory "database" for this example — a real backend would
// replace this array with a real database call (Stage C of this
// curriculum), but the controller/route split works the exact same way
// either way. That's the point: controllers depend on data, not on how
// that data happens to be stored right now.
let todos = [
  { id: 1, text: "Learn Express routing", done: true },
  { id: 2, text: "Learn layered project structure", done: false },
];

export function listTodos(req, res) {
  res.json(todos);
}

export function getTodoById(req, res) {
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(todo);
}

export function createTodo(req, res) {
  const newTodo = { id: todos.length + 1, text: req.body.text, done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
}
