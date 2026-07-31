// This is the products.routes.js file for the "MongoConnectionAndDocuments" mini-project.
// What this file does: it maps each real URL + method to the matching
// function in controllers/products.controller.js. No database code lives
// in this file at all — this file only points requests to the right place.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createProduct, // The function that runs when a new product should be created
  listProductTypes, // The function that runs when the real per-field types should be shown
  listProducts, // The function that runs when every product should be listed
  deleteAllProducts, // The function that runs when every product should be deleted
} = require("../controllers/products.controller"); // Get these 4 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/products"

router.get("/types", listProductTypes); // When someone visits GET /products/types, run listProductTypes
router.post("/", createProduct); // When someone sends POST /products, run createProduct
router.get("/", listProducts); // When someone visits GET /products, run listProducts
router.delete("/", deleteAllProducts); // When someone sends DELETE /products, run deleteAllProducts

module.exports = router; // Share this router so server.js can mount it
