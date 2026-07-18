// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// A real, in-memory list of todos — enough to prove real status codes
// without needing a real database for this specific concept.
let todos = [{ id: 1, title: "Learn REST status codes", done: false }];
// Tracks the next real id to hand out to a newly created todo.
let nextId = 2;

// Handles GET /api/v1/todos.
export function listTodos(req, res) {
  // Send the real, current list back as JSON, with a real 200 status.
  res.status(200).json(todos);
}

// Handles POST /api/v1/todos. A real API also sets the Location header
// to the new resource's real URL, not just a generic 200.
export function createTodo(req, res) {
  // Pull the real title out of the real parsed request body.
  const { title } = req.body;
  if (!title) {
    // 400 Bad Request — the CLIENT sent something wrong (missing data),
    // as opposed to a 500, which would mean the SERVER itself broke.
    res.status(400).json({ error: "title is required" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // Build the real new todo object and hand it the next real id.
  const todo = { id: nextId++, title, done: false };
  // Actually add it to the real in-memory list.
  todos.push(todo);
  // 201 + a real Location header pointing at the new todo's own URL.
  res.status(201).location(`/api/v1/todos/${todo.id}`).json(todo);
}

// Handles GET /api/v1/todos/:id — 200 vs 404 depending on whether the
// resource actually exists.
export function getTodoById(req, res) {
  // Look for a real todo whose id matches the real URL param.
  const todo = todos.find((t) => t.id === Number(req.params.id));
  if (!todo) {
    // 404 Not Found — this exact id genuinely doesn't exist.
    res.status(404).json({ error: "todo not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // It exists for real — send it back with a real 200.
  res.status(200).json(todo);
}

// Handles DELETE /api/v1/todos/:id — 204 No Content on success, since
// there's nothing left to send back after a real delete.
export function deleteTodo(req, res) {
  // Find the real position of the matching todo, if any.
  const index = todos.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) {
    // Already gone (or never existed) — a real 404, not a 204.
    res.status(404).json({ error: "todo not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // Actually remove it from the real in-memory list.
  todos.splice(index, 1);
  // 204 + .end() — no JSON body at all, since there's nothing left to send.
  res.status(204).end();
}
