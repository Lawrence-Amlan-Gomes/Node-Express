import { Router } from "express";
import { getLatestPrice } from "../controllers/price.controller.js";

const router = Router();

// A plain, ordinary REST route — nothing polling-specific about the route
// itself. Polling is a CLIENT-side habit (asking this over and over), not
// something the server declares.
router.get("/latest-price", getLatestPrice);

export default router;
