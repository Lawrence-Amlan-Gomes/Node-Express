import { Router } from "express";
import { getOrderBasic, getOrderEnriched } from "../controllers/order.controller.js";

const router = Router();
router.get("/orders/:id/basic", getOrderBasic);
router.get("/orders/:id", getOrderEnriched);

export default router;
