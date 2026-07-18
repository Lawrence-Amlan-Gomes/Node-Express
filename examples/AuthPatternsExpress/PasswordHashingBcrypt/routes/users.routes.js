// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual bcrypt logic lives here at all.
import { Router } from "express";
import { registerUser, loginUser } from "../controllers/users.controller.js";

// A mini version of "app" — mounted at "/users" by server.js.
const router = Router();

// POST /users/register — the real bcrypt.hash call happens in the controller.
router.post("/register", registerUser);
// POST /users/login — the real bcrypt.compare call happens in the controller.
router.post("/login", loginUser);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
