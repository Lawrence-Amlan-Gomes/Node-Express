import { Router } from "express";
import { subscribeBuggy, subscribeFixed, listenerCounts } from "../controllers/listeners.controller.js";

const router = Router();

router.get("/subscribe-buggy", subscribeBuggy);
router.get("/subscribe-fixed", subscribeFixed);
router.get("/listener-counts", listenerCounts);

export default router;
