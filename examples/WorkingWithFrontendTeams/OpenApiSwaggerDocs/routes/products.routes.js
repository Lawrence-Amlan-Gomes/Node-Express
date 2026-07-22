// A routes file's only job: declare which path+method maps to which
// controller function — matches openapi.yaml's own paths section exactly.
import { Router } from "express";
import { listProducts, getProduct, createProduct } from "../controllers/products.controller.js";

// A mini version of "app" — server.js mounts this at "/products".
const router = Router();

// GET /products — every real product.
router.get("/", listProducts);
// POST /products — create a real product.
router.post("/", createProduct);
// GET /products/:id — one real product, or a real 404.
router.get("/:id", getProduct);

// Exported so server.js can import it and decide what prefix it lives under.
export default router;
