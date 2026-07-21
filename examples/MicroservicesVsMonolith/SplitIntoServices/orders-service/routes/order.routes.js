import { Router } from "express";
import { getOrder } from "../controllers/order.controller.js";

const router = Router();
router.get("/orders/:id", getOrder);
export default router;
