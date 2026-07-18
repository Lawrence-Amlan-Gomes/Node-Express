// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — no Prisma code lives here at all.
const { Router } = require("express");
const { seedTodos, listTodos, resetTodos } = require("../controllers/todos.controller");

// A mini version of "app" — mounted at "/todos" by server.js.
const router = Router();

// POST /todos/seed — fills the real table with 100,000 real rows.
router.post("/seed", seedTodos);
// GET /todos?offset=N or ?cursor=N — runs the matching real, measured query.
router.get("/", listTodos);
// DELETE /todos — empties the real table (used by demo.js to leave it clean).
router.delete("/", resetTodos);

module.exports = router;
