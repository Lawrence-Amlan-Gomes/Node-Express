import { Router } from "express";
import { compute } from "../controllers/compute.controller.js";

const router = Router();

router.get("/compute", compute);

export default router;
