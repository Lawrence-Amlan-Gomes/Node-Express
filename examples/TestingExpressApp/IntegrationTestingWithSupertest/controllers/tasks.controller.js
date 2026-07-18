// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// A real, in-memory list of tasks — enough to prove real integration
// testing without needing a real database for this specific concept.
const tasks = [
  { id: 1, title: "Write tests", done: false },
  { id: 2, title: "Ship the feature", done: false },
];

// Handles GET /tasks.
export function listTasks(req, res) {
  // Send back the real, full list — this is what Supertest checks against.
  res.status(200).json(tasks);
}

// Handles GET /tasks/:id.
export function getTaskById(req, res) {
  // Real params always arrive as strings — Number() converts it for real comparison.
  const id = Number(req.params.id);
  // Look for a real task whose id matches the real URL param.
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    // This exact id genuinely doesn't exist — a real 404, not a crash or a hang.
    res.status(404).json({ error: "task not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // It exists for real — send it back with a real 200.
  res.status(200).json(task);
}
