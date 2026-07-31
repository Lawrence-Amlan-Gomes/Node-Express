// This is the customers.routes.js file for the "AsyncRouteErrorHandling"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/customers.controller.js — same real
// routes/controllers split this project always uses.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createCustomer, // The function that runs when a new customer should be created
  getCustomer, // The function that runs when one customer should be found by id
  deleteAllCustomers, // The function that runs when every customer should be removed
} = require("../controllers/customers.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/customers"

router.post("/", createCustomer); // When someone sends POST /customers, run createCustomer
router.get("/:id", getCustomer); // When someone visits GET /customers/123, run getCustomer with id 123
router.delete("/", deleteAllCustomers); // When someone sends DELETE /customers, run deleteAllCustomers

module.exports = router; // Share this router so server.js can mount it
