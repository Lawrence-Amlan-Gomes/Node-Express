import { Router } from "express";
import { dataBuggy, dataFixed, cacheStats } from "../controllers/cache.controller.js";

const router = Router();

router.get("/data-buggy/:id", dataBuggy);
router.get("/data-fixed/:id", dataFixed);
router.get("/cache-stats", cacheStats);

export default router;
