// This is the orders.routes.js file for the "InnerLeftJoin" mini-project.
// What this file does: maps each real URL + method to the matching
// function in controllers/orders.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createOrder, listOrders, deleteAllOrders } = require("../controllers/orders.controller"); // Get these 3 real functions

const router = Router(); // Create a real, empty router — server.js will mount this at "/orders"

router.post("/", createOrder); // When someone sends POST /orders, run createOrder
router.get("/", listOrders); // When someone visits GET /orders, run listOrders
router.delete("/", deleteAllOrders); // When someone sends DELETE /orders, run deleteAllOrders

module.exports = router; // Share this router so server.js can mount it
