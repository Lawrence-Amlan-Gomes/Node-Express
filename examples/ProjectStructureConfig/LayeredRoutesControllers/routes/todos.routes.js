// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here. Reading this
// file should tell you every endpoint this resource has, at a glance,
// without wading through the logic behind each one.
import { Router } from "express";
import { listTodos, getTodoById, createTodo } from "../controllers/todos.controller.js";

const router = Router();

router.get("/", listTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);

export default router;
