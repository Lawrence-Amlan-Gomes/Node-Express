import { Router } from "express";
import { queueWelcomeEmail, getEmailJobStatus } from "../controllers/email.controller.js";

const router = Router();

router.post("/jobs/welcome-email", queueWelcomeEmail);
router.get("/jobs/welcome-email/:id/status", getEmailJobStatus);

export default router;
