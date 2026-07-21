import { Router } from "express";
import { getReportUnprotected, getReportProtected, getComputeCounts } from "../controllers/report.controller.js";

const router = Router();

router.get("/report-unprotected", getReportUnprotected);
router.get("/report-protected", getReportProtected);
router.get("/compute-counts", getComputeCounts);

export default router;
