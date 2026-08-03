// This is the customers.routes.js file for the "Subqueries" mini-project.
// What this file does: maps each real URL + method to the matching
// function in controllers/customers.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createCustomer, listCustomers, bigSpenders, deleteAllCustomers } = require("../controllers/customers.controller"); // Get these 4 real functions

const router = Router(); // Create a real, empty router — server.js will mount this at "/customers"

router.post("/", createCustomer); // When someone sends POST /customers, run createCustomer
router.get("/", listCustomers); // When someone visits GET /customers, run listCustomers
router.get("/big-spenders", bigSpenders); // GET /customers/big-spenders — the real IN-subquery
router.delete("/", deleteAllCustomers); // When someone sends DELETE /customers, run deleteAllCustomers

module.exports = router; // Share this router so server.js can mount it
