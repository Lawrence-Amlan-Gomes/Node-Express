import { Router } from "express";
import { queueFlakyTask, getTaskStatus } from "../controllers/task.controller.js";

const router = Router();

router.post("/jobs/flaky-task", queueFlakyTask);
router.get("/jobs/flaky-task/:id/status", getTaskStatus);

export default router;
