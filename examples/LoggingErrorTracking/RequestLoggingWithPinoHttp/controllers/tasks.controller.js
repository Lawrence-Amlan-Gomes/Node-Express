// A "controller" is where the ACTUAL logic for a request lives. This
// section's whole point is what pino-http logs AUTOMATICALLY, with NO
// logging code written inside these handlers at all — that's the real
// contrast with the previous section's manual logger.info() calls.

// A real, in-memory list of tasks — enough to prove real automatic
// request logging without needing a real database for this concept.
const tasks = [
  { id: 1, title: "Write the logging topic", done: false },
  { id: 2, title: "Ship it", done: false },
];

// Handles GET /tasks — no logging code here at all; pino-http logs the
// real request/response automatically once it finishes.
export function listTasks(req, res) {
  res.status(200).json(tasks);
}

// Handles GET /tasks/:id — same real absence of logging code.
export function getTaskById(req, res) {
  // Real params always arrive as strings — Number() converts it for real comparison.
  const id = Number(req.params.id);
  // Look for a real task whose id matches the real URL param.
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    // This exact id genuinely doesn't exist — a real 404. pino-http logs this
    // request automatically at a real WARN level (see server.js's customLogLevel).
    res.status(404).json({ error: "task not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // It exists for real — send it back with a real 200.
  res.status(200).json(task);
}

// Handles GET /broken — a deliberate, real 500, to prove what pino-http
// actually logs when a response genuinely fails.
export function getBroken(req, res) {
  // A real, simulated server-side failure — a real 500, on purpose.
  res.status(500).json({ error: "simulated failure" });
}
