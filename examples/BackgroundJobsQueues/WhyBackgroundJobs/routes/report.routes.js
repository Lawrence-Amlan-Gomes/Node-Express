import { Router } from "express";
import { generateReportSync, generateReportAsync, getReportStatus } from "../controllers/report.controller.js";

const router = Router();

router.post("/reports/sync", generateReportSync);
router.post("/reports/async", generateReportAsync);
router.get("/reports/:id/status", getReportStatus);

export default router;
