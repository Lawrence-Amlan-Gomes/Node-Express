// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual JWT logic lives here at all.
import { Router } from "express";
import { login, requireAuth, me } from "../controllers/auth.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// POST /login — the real jwt.sign call happens in the controller.
router.post("/login", login);
// GET /me — requireAuth runs FIRST, re-verifying the real token's
// signature before the real me handler ever runs.
router.get("/me", requireAuth, me);

// Exported so server.js can import it and mount it.
export default router;
