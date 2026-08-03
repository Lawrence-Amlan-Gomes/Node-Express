// This is the cascade.routes.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/cascade.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createCustomer, createOrder, listOrders, deleteCustomer, reset } = require("../controllers/cascade.controller"); // Get these 5 real functions

const router = Router(); // Create a real, empty router — server.js will mount this at "/cascade"

router.post("/customers", createCustomer); // POST /cascade/customers — create a real customer
router.post("/orders", createOrder); // POST /cascade/orders — create a real order pointing at that customer
router.get("/orders", listOrders); // GET /cascade/orders — used to prove the real cascade delete actually ran
router.delete("/customers/:id", deleteCustomer); // DELETE /cascade/customers/:id — the real, ON DELETE CASCADE delete
router.delete("/reset", reset); // DELETE /cascade/reset — clears both real tables for a fresh run

module.exports = router; // Share this router so server.js can mount it
