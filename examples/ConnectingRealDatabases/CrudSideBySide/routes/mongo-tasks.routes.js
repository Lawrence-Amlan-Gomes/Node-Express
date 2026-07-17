// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Mongoose code lives here at all.
const { Router } = require("express");
const { createTask, listTasks, updateTask, deleteTask, deleteAllTasks } = require("../controllers/mongo-tasks.controller");

// A mini version of "app" — mounted at "/mongo-tasks" by server.js.
const router = Router();

router.post("/", createTask);
router.get("/", listTasks);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
// Clears every real document — used by demo.js to reset between runs.
router.delete("/", deleteAllTasks);

module.exports = router;
