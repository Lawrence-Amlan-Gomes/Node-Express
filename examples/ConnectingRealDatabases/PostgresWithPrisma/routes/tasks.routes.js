// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
const { Router } = require("express");
const { createTask, listTasks, updateTask, deleteTask, deleteAllTasks } = require("../controllers/tasks.controller");

// A mini version of "app" — mounted at "/tasks" by server.js.
const router = Router();

// POST /tasks — create a real task.
router.post("/", createTask);
// GET /tasks — list every real task.
router.get("/", listTasks);
// PATCH /tasks/:id — update one real task.
router.patch("/:id", updateTask);
// DELETE /tasks/:id — delete one real task.
router.delete("/:id", deleteTask);
// DELETE /tasks — clear every real task (used by demo.js to reset between runs).
router.delete("/", deleteAllTasks);

// Exported so server.js can import it and mount it under "/tasks".
module.exports = router;
