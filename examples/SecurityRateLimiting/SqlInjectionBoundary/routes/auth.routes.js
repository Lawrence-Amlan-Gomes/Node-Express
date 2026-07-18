// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual SQL lives here at all.
import { Router } from "express";
import { loginVulnerable, loginFixed } from "../controllers/auth.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// THE VULNERABILITY lives entirely in the controller — this route
// declaration looks identical to the fixed one below.
router.post("/login-vulnerable", loginVulnerable);
// THE FIX also lives entirely in the controller — same shape, real
// parameterized query inside.
router.post("/login-fixed", loginFixed);

// Exported so server.js can import it and mount it.
export default router;
