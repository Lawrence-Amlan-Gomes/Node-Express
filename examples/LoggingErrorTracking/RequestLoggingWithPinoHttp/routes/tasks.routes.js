// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic (and no logging code at
// all) lives here either.
import { Router } from "express";
import { listTasks, getTaskById, getBroken } from "../controllers/tasks.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// GET /tasks — pino-http logs this automatically, no code needed here.
router.get("/tasks", listTasks);
// GET /tasks/:id — same real automatic logging, 200 or 404.
router.get("/tasks/:id", getTaskById);
// GET /broken — a real, deliberate 500, to see what pino-http logs for a real failure.
router.get("/broken", getBroken);

// Exported so server.js can import it and mount it.
export default router;
