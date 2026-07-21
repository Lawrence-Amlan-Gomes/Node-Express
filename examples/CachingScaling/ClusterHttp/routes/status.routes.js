import { Router } from "express";
import { getStatus, crashMe } from "../controllers/status.controller.js";

const router = Router();

router.get("/", getStatus);
router.get("/crash-me", crashMe);

export default router;
