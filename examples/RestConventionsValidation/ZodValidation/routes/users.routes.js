// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual logic lives here. Reading this
// file should tell you every endpoint this resource has, at a glance,
// without wading through the logic behind each one.
import { Router } from "express";
import { createUser } from "../controllers/users.controller.js";

// A mini version of "app" — mounted at "/users" by server.js.
const router = Router();

// POST /users — the real zod validation happens in the controller.
router.post("/", createUser);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
