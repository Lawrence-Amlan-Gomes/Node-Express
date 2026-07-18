// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual session logic lives here at all.
import { Router } from "express";
import { login, me, logout } from "../controllers/auth.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// POST /login — the real bcrypt.compare and session write happen in the controller.
router.post("/login", login);
// GET /me — the real session lookup happens in the controller.
router.get("/me", me);
// POST /logout — the real session.destroy() call happens in the controller.
router.post("/logout", logout);

// Exported so server.js can import it and mount it.
export default router;
