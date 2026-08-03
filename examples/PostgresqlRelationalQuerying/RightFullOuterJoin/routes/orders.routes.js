// This is the orders.routes.js file for the "RightFullOuterJoin"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/orders.controller.js or
// controllers/joins.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createOrder, listOrders, deleteAllOrders } = require("../controllers/orders.controller"); // Plain order CRUD
const { rightJoinOrdersCustomers, fullOuterJoinOrdersCustomers } = require("../controllers/joins.controller"); // The 2 real JOIN queries

const router = Router(); // Create a real, empty router — server.js will mount this at "/orders"

router.post("/", createOrder); // When someone sends POST /orders, run createOrder
router.get("/", listOrders); // When someone visits GET /orders, run listOrders
router.get("/right-join-customers", rightJoinOrdersCustomers); // GET /orders/right-join-customers — every customer, matched or not
router.get("/full-outer-join-customers", fullOuterJoinOrdersCustomers); // GET /orders/full-outer-join-customers — every row from BOTH tables
router.delete("/", deleteAllOrders); // When someone sends DELETE /orders, run deleteAllOrders

module.exports = router; // Share this router so server.js can mount it
