import { Router } from "express";
import { blocking } from "../controllers/blocking.controller.js";

const router = Router();

router.get("/blocking", blocking);

export default router;
