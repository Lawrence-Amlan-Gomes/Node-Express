// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// Real custom Error subclasses. Giving each one its own real statusCode
// means the error-handling middleware in server.js can look at ONE
// shared property (err.statusCode) to decide the right HTTP status,
// instead of a big if/else chain checking error text.
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    // Every ValidationError carries its own real, correct HTTP status.
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    // Every NotFoundError carries its own real, correct HTTP status.
    this.statusCode = 404;
  }
}

// A real, in-memory list of tasks — enough to prove real validation and
// real error forwarding without needing a real database for this concept.
const tasks = [{ id: 1, title: "Write tests", done: false }];
// Tracks the next real id to hand out to a newly created task.
let nextId = 2;

// A real piece of VALIDATION MIDDLEWARE. It runs BEFORE the real route
// handler below (wired up in routes/tasks.routes.js). If the body is
// bad, it calls next(err) and the real route handler never even runs.
export function validateNewTask(req, res, next) {
  // Pull the real title straight out of the real parsed request body.
  const { title } = req.body;
  if (typeof title !== "string" || title.trim().length === 0) {
    // Bad input — hand a real ValidationError to next(), skipping the real handler entirely.
    return next(new ValidationError("title is required and must be a non-empty string"));
  }
  // The real title passed — let the real route handler run next.
  next();
}

// Handles POST /tasks — only ever reached once validateNewTask above has
// already let the request through.
export function createTask(req, res) {
  // Build the real new task and hand it the next real id.
  const task = { id: nextId++, title: req.body.title, done: false };
  // Actually add it to the real in-memory list.
  tasks.push(task);
  // 201 — a genuinely new task was really created.
  res.status(201).json(task);
}

// Handles PATCH /tasks/:id/complete. This handler is "async" but has NO
// try/catch at all. If the task isn't found, it just throws. In Express
// 5, throwing inside an async handler is automatically turned into a
// real call to next(err) for you — the request doesn't hang, and it
// doesn't crash the process either. It safely reaches the error
// middleware in server.js.
export async function completeTask(req, res) {
  // Real params always arrive as strings — Number() converts it for real comparison.
  const id = Number(req.params.id);
  // Look for a real task whose id matches the real URL param.
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    // Thrown on purpose — Express 5 forwards this automatically, no try/catch needed.
    throw new NotFoundError(`no task with id ${id}`);
  }
  // Actually mark the real task done, for real.
  task.done = true;
  // Send back the real, updated task.
  res.status(200).json(task);
}
