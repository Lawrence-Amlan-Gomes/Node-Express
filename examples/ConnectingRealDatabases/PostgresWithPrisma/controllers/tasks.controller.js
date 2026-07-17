// This is where the real Prisma calls live — the routes file never talks
// to Prisma directly, only this controller does. This is the same
// routes/controllers layering this project already taught in "Project
// Structure & Config," now applied to a real database-backed resource.
const { PrismaClient } = require("@prisma/client");

// A real Prisma client for this schema — shared by every handler below.
const prisma = new PrismaClient();

// Handles POST /tasks.
async function createTask(req, res) {
  // A real INSERT, run for real against the real database.
  const created = await prisma.task.create({
    data: { title: req.body.title },
  });
  // 201 means "created" — the correct real status code for a successful POST.
  res.status(201).json(created);
}

// Handles GET /tasks.
async function listTasks(req, res) {
  // A real SELECT of every row currently in the table.
  const tasks = await prisma.task.findMany();
  res.json(tasks);
}

// Handles PATCH /tasks/:id.
async function updateTask(req, res) {
  // A real UPDATE, by primary key (id) — req.params.id always arrives as a
  // string, so Number() converts it to match the column's real integer type.
  const updated = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { done: req.body.done },
  });
  res.json(updated);
}

// Handles DELETE /tasks/:id.
async function deleteTask(req, res) {
  // A real DELETE, by primary key.
  const deleted = await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json(deleted);
}

// Handles DELETE /tasks — clears every real row. Not a typical REST
// endpoint on a real production API, but a real, honest one here: this
// project's demo.js needs a real way to reset the table between runs,
// through the API itself, instead of reaching around it into Prisma.
async function deleteAllTasks(req, res) {
  // A real bulk DELETE — count tells the caller how many rows were removed.
  const result = await prisma.task.deleteMany();
  res.json({ deletedCount: result.count });
}

module.exports = { createTask, listTasks, updateTask, deleteTask, deleteAllTasks };
