// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual response logic lives here at all.
import { Router } from "express";
import { listTasks, getTaskById } from "../controllers/tasks.controller.js";

// A mini version of "app" — mounted at "/tasks" by server.js.
const router = Router();

// GET /tasks — the real list Supertest checks against.
router.get("/", listTasks);
// GET /tasks/:id — the real 200-vs-404 outcome Supertest checks against.
router.get("/:id", getTaskById);

// Exported so server.js can import it and mount it.
export default router;
