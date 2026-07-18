// A "controller" is where the ACTUAL logic for a request lives. Nothing
// in here knows or cares what URL path the client actually visited to
// get here — that's the routes file's job, not this one.
import { logger } from "../logger.js";

// A real, in-memory list of tasks — enough to prove real structured
// logging without needing a real database for this specific concept.
const tasks = [{ id: 1, title: "Write the logging topic", done: false }];
// Tracks the next real id to hand out to a newly created task.
let nextId = 2;

// Handles GET /tasks.
export function listTasks(req, res) {
  // A real, structured info log — the extra object becomes real, separate
  // JSON fields (count), not text buried inside a sentence.
  logger.info({ count: tasks.length }, "listed all tasks");
  // Send back the real, current list.
  res.status(200).json(tasks);
}

// Handles GET /tasks/:id.
export function getTaskById(req, res) {
  // Real params always arrive as strings — Number() converts it for real comparison.
  const id = Number(req.params.id);
  // Look for a real task whose id matches the real URL param.
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    // A real WARN log — this isn't a bug, but it's worth a closer look
    // than a plain info line if it happens a lot in real production traffic.
    logger.warn({ taskId: id }, "requested a task id that does not exist");
    // This exact id genuinely doesn't exist — a real 404.
    res.status(404).json({ error: "task not found" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // A real, structured info log — taskId is its own real field, not string-glued.
  logger.info({ taskId: task.id }, "fetched a single task");
  // It exists for real — send it back with a real 200.
  res.status(200).json(task);
}

// Handles POST /tasks.
export function createTask(req, res) {
  // Pull the real title straight out of the real parsed request body.
  const { title } = req.body;
  if (typeof title !== "string" || title.trim().length === 0) {
    // A real WARN log — bad input isn't a server bug, but it IS worth knowing about.
    logger.warn({ body: req.body }, "rejected a task create with a missing or empty title");
    // Bad input — a real 400, no task gets created.
    res.status(400).json({ error: "title is required" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // Build the real new task and hand it the next real id.
  const task = { id: nextId++, title, done: false };
  // Actually add it to the real in-memory list.
  tasks.push(task);
  // A real, structured info log — taskId and title are their own real
  // fields. A real log-search tool (or a human) can filter on taskId
  // directly — it could never reliably do that with a plain string like
  // `console.log("created task " + task.id)`.
  logger.info({ taskId: task.id, title: task.title }, "created a new task");
  // 201 — a genuinely new task was really created.
  res.status(201).json(task);
}
