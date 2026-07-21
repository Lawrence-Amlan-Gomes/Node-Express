import { Router } from "express";
import { getProduct, updateProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/product/:id", getProduct);
router.put("/product/:id", updateProduct);

export default router;
