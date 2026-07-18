// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here at all.
import { Router } from "express";
import { getHealth } from "../controllers/health.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// GET /health — a real, minimal proof the app is genuinely still up.
router.get("/health", getHealth);

// Exported so server.js can import it and mount it.
export default router;
