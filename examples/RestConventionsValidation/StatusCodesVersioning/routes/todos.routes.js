// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here. Reading this
// file should tell you every endpoint this resource has, at a glance,
// without wading through the logic behind each one.
import { Router } from "express";
import { listTodos, createTodo, getTodoById, deleteTodo } from "../controllers/todos.controller.js";

// A mini version of "app" — mounted at "/api/v1/todos" by server.js.
const router = Router();

// 200 OK — the default "this worked, here's the data" response.
router.get("/", listTodos);
// 201 Created (or 400 if the body is bad) — all real logic lives in the controller.
router.post("/", createTodo);
// 200 vs 404 — same route shape, two different real outcomes.
router.get("/:id", getTodoById);
// 204 No Content on a real delete.
router.delete("/:id", deleteTodo);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
