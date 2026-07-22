// A routes file's only job: declare which path+method maps to which
// controller function — matches openapi.yaml's own paths exactly.
import { Router } from "express";
import { createOrder, getOrder } from "../controllers/orders.controller.js";

// A mini version of "app" — server.js mounts this at "/orders".
const router = Router();

// POST /orders — the real spec validation already happened in server.js.
router.post("/", createOrder);
// GET /orders/:id — one real order, or a real 404.
router.get("/:id", getOrder);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
