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

// Handles GET /todos — the routes file just points here, all logic is here.
export function listTodos(req, res) {
  // Send back every real todo currently in the in-memory array.
  res.json(todos);
}

// Handles GET /todos/:id.
export function getTodoById(req, res) {
  // Look for a real todo whose id matches the URL — Number() because
  // req.params.id always arrives as a string, never already a number.
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    // No match — respond with a real 404 instead of continuing below.
    res.status(404).json({ error: "not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // A real match was found — send it back.
  res.json(todo);
}

// Handles POST /todos.
export function createTodo(req, res) {
  // Build a real new todo from the request body, with a simple next id.
  const newTodo = { id: todos.length + 1, text: req.body.text, done: false };
  // Actually add it to the in-memory array, for real, not just in this response.
  todos.push(newTodo);
  // 201 means "created" — the correct real status code for a successful POST.
  res.status(201).json(newTodo);
}
