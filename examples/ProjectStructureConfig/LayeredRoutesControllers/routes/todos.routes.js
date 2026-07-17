// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here. Reading this
// file should tell you every endpoint this resource has, at a glance,
// without wading through the logic behind each one.
import { Router } from "express";
import { listTodos, getTodoById, createTodo } from "../controllers/todos.controller.js";

// A mini version of "app" — .get/.post work the same, but it does nothing
// until server.js actually mounts it.
const router = Router();

// GET /todos (the "/todos" prefix is added by server.js, not written here).
router.get("/", listTodos);
// GET /todos/:id — the real logic for both lives in the controller, not here.
router.get("/:id", getTodoById);
// POST /todos — creates a new one; again, zero logic in this file.
router.post("/", createTodo);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
