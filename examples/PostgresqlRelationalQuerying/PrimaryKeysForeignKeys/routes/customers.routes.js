// This is the customers.routes.js file for the "PrimaryKeysForeignKeys"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/customers.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createCustomer, // The function that runs when a new customer should be created
  listCustomers, // The function that runs when every customer should be listed
  deleteAllCustomers, // The function that runs when every customer should be removed
} = require("../controllers/customers.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/customers"

router.post("/", createCustomer); // When someone sends POST /customers, run createCustomer
router.get("/", listCustomers); // When someone visits GET /customers, run listCustomers
router.delete("/", deleteAllCustomers); // When someone sends DELETE /customers, run deleteAllCustomers

module.exports = router; // Share this router so server.js can mount it
