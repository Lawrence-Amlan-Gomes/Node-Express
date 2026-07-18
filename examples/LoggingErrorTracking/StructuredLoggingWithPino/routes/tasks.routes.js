// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logging or business logic lives
// here at all.
import { Router } from "express";
import { listTasks, getTaskById, createTask } from "../controllers/tasks.controller.js";

// A mini version of "app" — mounted at "/tasks" by server.js.
const router = Router();

// GET /tasks — logs a real, structured info line every time.
router.get("/", listTasks);
// GET /tasks/:id — logs info on a real hit, warn on a real miss.
router.get("/:id", getTaskById);
// POST /tasks — logs info on a real success, warn on real bad input.
router.post("/", createTask);

// Exported so server.js can import it and mount it.
export default router;
