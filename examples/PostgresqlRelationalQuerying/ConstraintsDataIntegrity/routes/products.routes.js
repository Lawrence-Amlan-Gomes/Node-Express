// This is the products.routes.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: maps each real URL + method to the
// matching function in controllers/products.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const { createProduct, listProducts, deleteAllProducts } = require("../controllers/products.controller"); // Get these 3 real functions

const router = Router(); // Create a real, empty router — server.js will mount this at "/products"

router.post("/", createProduct); // POST /products — proves the real CHECK and UNIQUE constraints
router.get("/", listProducts); // GET /products — lists every real row currently in the table
router.delete("/", deleteAllProducts); // DELETE /products — clears the table for a fresh run

module.exports = router; // Share this router so server.js can mount it
