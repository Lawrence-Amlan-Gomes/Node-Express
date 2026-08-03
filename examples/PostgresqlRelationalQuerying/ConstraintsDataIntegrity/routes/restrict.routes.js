// This is the restrict.routes.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/restrict.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createCustomer, createOrder, deleteCustomer, reset } = require("../controllers/restrict.controller"); // Get these 4 real functions

const router = Router(); // Create a real, empty router — server.js will mount this at "/restrict"

router.post("/customers", createCustomer); // POST /restrict/customers — create a real customer
router.post("/orders", createOrder); // POST /restrict/orders — create a real order pointing at that customer
router.delete("/customers/:id", deleteCustomer); // DELETE /restrict/customers/:id — the real, ON DELETE RESTRICT-guarded delete
router.delete("/reset", reset); // DELETE /restrict/reset — clears both real tables for a fresh run

module.exports = router; // Share this router so server.js can mount it
