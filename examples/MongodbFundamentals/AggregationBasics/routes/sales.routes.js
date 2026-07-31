// This is the sales.routes.js file for the "AggregationBasics" mini-
// project. What this file does: it maps each real URL + method to the
// matching function in controllers/sales.controller.js. No database code
// lives in this file at all.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createSale, // The function that runs when a new sale should be created
  salesSummary, // The function that runs when the real per-category summary should be computed
  deleteAllSales, // The function that runs when every sale should be deleted
} = require("../controllers/sales.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/sales"

router.get("/summary", salesSummary); // When someone visits GET /sales/summary, run salesSummary
router.post("/", createSale); // When someone sends POST /sales, run createSale
router.delete("/", deleteAllSales); // When someone sends DELETE /sales, run deleteAllSales

module.exports = router; // Share this router so server.js can mount it
