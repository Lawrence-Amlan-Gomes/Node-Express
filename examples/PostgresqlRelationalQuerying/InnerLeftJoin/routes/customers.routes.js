// This is the customers.routes.js file for the "InnerLeftJoin"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/customers.controller.js or
// controllers/joins.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createCustomer, listCustomers, deleteAllCustomers } = require("../controllers/customers.controller"); // Plain customer CRUD
const { innerJoinCustomersOrders, leftJoinCustomersOrders } = require("../controllers/joins.controller"); // The 2 real JOIN queries

const router = Router(); // Create a real, empty router — server.js will mount this at "/customers"

router.post("/", createCustomer); // When someone sends POST /customers, run createCustomer
router.get("/", listCustomers); // When someone visits GET /customers, run listCustomers
router.get("/inner-join-orders", innerJoinCustomersOrders); // GET /customers/inner-join-orders — only customers WITH orders
router.get("/left-join-orders", leftJoinCustomersOrders); // GET /customers/left-join-orders — every customer, matched or not
router.delete("/", deleteAllCustomers); // When someone sends DELETE /customers, run deleteAllCustomers

module.exports = router; // Share this router so server.js can mount it
