// This is the sales.routes.js file for the "AggregateFunctionsBasics" mini-project.
// What this file does: same real job as products.routes.js in
// "PostgresConnectionAndTypes" — it maps each real URL + method to the
// matching function in controllers/sales.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createSale, listSales, salesSummary, deleteAllSales } = require("../controllers/sales.controller"); // Get these 4 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/sales"

router.get("/summary", salesSummary); // When someone visits GET /sales/summary, run salesSummary
router.post("/", createSale); // When someone sends POST /sales, run createSale
router.get("/", listSales); // When someone visits GET /sales, run listSales
router.delete("/", deleteAllSales); // When someone sends DELETE /sales, run deleteAllSales

module.exports = router; // Share this router so server.js can mount it
