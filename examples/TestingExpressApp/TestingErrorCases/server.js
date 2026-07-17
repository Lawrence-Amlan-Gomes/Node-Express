// This app tests two kinds of "not the happy path" behavior:
//   1. Input validation middleware — checking a request BEFORE the
//      real route handler runs, and rejecting it early with a real
//      400 if it's bad.
//   2. A thrown error inside an async route handler — proving
//      Express 5's real automatic behavior: a rejected promise (which
//      is what a throw inside an "async" function actually becomes)
//      gets forwarded to the centralized error-handling middleware
//      automatically. No try/catch needed. That's the same real
//      Express 5 behavior taught in the "Error Handling in Express"
//      topic — this section proves it's actually testable too.
import express from "express";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

const tasks = [{ id: 1, title: "Write tests", done: false }];
let nextId = 2;

// Real custom Error subclasses. Giving each one its own real
// statusCode means the error-handling middleware at the bottom can
// look at ONE shared property (err.statusCode) to decide the right
// HTTP status, instead of a big if/else chain checking error text.
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

// A real piece of VALIDATION MIDDLEWARE. It runs BEFORE the real
// route handler below. If the body is bad, it calls next(err) and
// the real route handler never even runs.
function validateNewTask(req, res, next) {
  const { title } = req.body;
  if (typeof title !== "string" || title.trim().length === 0) {
    return next(new ValidationError("title is required and must be a non-empty string"));
  }
  next();
}

app.post("/tasks", validateNewTask, (req, res) => {
  const task = { id: nextId++, title: req.body.title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// This handler is "async" but has NO try/catch at all. If the task
// isn't found, it just throws. In Express 5, throwing inside an
// async handler is automatically turned into a real call to
// next(err) for you — the request doesn't hang, and it doesn't crash
// the process either. It safely reaches the error middleware below.
app.patch("/tasks/:id/complete", async (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new NotFoundError(`no task with id ${id}`);
  }
  task.done = true;
  res.status(200).json(task);
});

// The REAL centralized error-handling middleware. Express recognizes
// this as error-handling middleware specifically because it takes
// FOUR arguments (err, req, res, next) instead of three — that's not
// a style choice, Express checks the function's arity.
app.use((err, req, res, next) => {
  if (err.statusCode) {
    // A real, expected error (bad input, missing resource) — safe to
    // send its real message straight to the client.
    return res.status(err.statusCode).json({ error: err.message });
  }
  // A real, UNEXPECTED error. Never leak its real internal message or
  // stack trace to the client — that can reveal internal details an
  // attacker could use. Log the real details server-side only.
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4061;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
