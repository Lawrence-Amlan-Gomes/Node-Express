// This is the products.routes.js file for the "PostgresConnectionAndTypes" mini-project.
// What this file does: it maps each real URL + method to the matching
// function in controllers/products.controller.js. No database code lives
// in this file at all — this file only points requests to the right place.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createProduct, // The function that runs when a new product should be created
  listProducts, // The function that runs when every product should be listed
  listColumns, // The function that runs when the real column types should be shown
  deleteAllProducts, // The function that runs when every product should be deleted
} = require("../controllers/products.controller"); // Get these 4 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/products"

router.get("/columns", listColumns); // When someone visits GET /products/columns, run listColumns
router.post("/", createProduct); // When someone sends POST /products, run createProduct
router.get("/", listProducts); // When someone visits GET /products, run listProducts
router.delete("/", deleteAllProducts); // When someone sends DELETE /products, run deleteAllProducts

module.exports = router; // Share this router so server.js can mount it
