// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here. Reading this
// file should tell you every endpoint this resource has, at a glance,
// without wading through the logic behind each one.
import { Router } from "express";
import { createCharge, getChargeCount } from "../controllers/charges.controller.js";

// A mini version of "app" — mounted at "/charges" by server.js.
const router = Router();

// POST /charges — the real idempotency-key check happens in the controller.
router.post("/", createCharge);
// GET /charges/count — reports how many charges ACTUALLY ran, for real.
router.get("/count", getChargeCount);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
