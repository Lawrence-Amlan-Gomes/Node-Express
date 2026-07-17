// The real Prisma calls for the Postgres half of this comparison — the
// routes file never talks to Prisma directly, only this controller does.
const { PrismaClient } = require("@prisma/client");

// A real Prisma client for this section's own SideBySideTask table.
const prisma = new PrismaClient();

// Handles POST /postgres-tasks.
async function createTask(req, res) {
  // A real INSERT, run for real against the real database.
  const created = await prisma.task.create({ data: { title: req.body.title } });
  res.status(201).json(created);
}

// Handles GET /postgres-tasks.
async function listTasks(req, res) {
  // A real SELECT of every row currently in the table.
  const tasks = await prisma.task.findMany();
  res.json(tasks);
}

// Handles PATCH /postgres-tasks/:id.
async function updateTask(req, res) {
  // A real UPDATE, by primary key (id).
  const updated = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: { done: req.body.done },
  });
  res.json(updated);
}

// Handles DELETE /postgres-tasks/:id.
async function deleteTask(req, res) {
  // A real DELETE, by primary key.
  const deleted = await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.json(deleted);
}

// Handles DELETE /postgres-tasks — clears every real row, used by demo.js
// to reset the table between runs, through the API itself.
async function deleteAllTasks(req, res) {
  const result = await prisma.task.deleteMany();
  res.json({ deletedCount: result.count });
}

module.exports = { createTask, listTasks, updateTask, deleteTask, deleteAllTasks };
