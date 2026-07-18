// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — including, here, WHICH real middleware
// (validateNewTask) runs in front of a route. No actual validation or
// business logic lives here at all.
import { Router } from "express";
import { validateNewTask, createTask, completeTask } from "../controllers/tasks.controller.js";

// A mini version of "app" — mounted at "/tasks" by server.js.
const router = Router();

// validateNewTask runs FIRST — the real handler below never runs at all if it rejects the body.
router.post("/", validateNewTask, createTask);
// completeTask can throw with no try/catch — Express 5 forwards it automatically.
router.patch("/:id/complete", completeTask);

// Exported so server.js can import it and mount it.
export default router;
