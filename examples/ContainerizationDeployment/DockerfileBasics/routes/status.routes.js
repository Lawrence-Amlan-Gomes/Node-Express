// Declares path + method -> controller function only. No Docker-specific
// code belongs here either — routing doesn't change based on where the
// process happens to be running.
import { Router } from "express";
import { getStatus } from "../controllers/status.controller.js";

const router = Router();

router.get("/", getStatus);

export default router;
