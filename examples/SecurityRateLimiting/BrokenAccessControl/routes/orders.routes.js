// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual ownership-check logic lives here.
import { Router } from "express";
import { getOrderVulnerable, getOrderFixed } from "../controllers/orders.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// THE VULNERABILITY lives entirely in the controller — this route
// declaration looks identical to the fixed one below.
router.get("/orders-vulnerable/:id", getOrderVulnerable);
// THE FIX also lives entirely in the controller — same shape, real
// extra check inside.
router.get("/orders-fixed/:id", getOrderFixed);

// Exported so server.js can import it and mount it.
export default router;
