import { Router } from "express";
import { streamEvents } from "../controllers/events.controller.js";

const router = Router();

// Looks like a plain GET route — the streaming behavior lives entirely in
// the controller, not in how this route gets declared.
router.get("/events", streamEvents);

export default router;
