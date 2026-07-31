// This is the businesses.routes.js file for the "PrismaCrudBasics"
// mini-project. What this file does: maps each real Business URL + method
// to the matching function in controllers/businesses.controller.js — this
// section is really about /leads, so /businesses only needs enough real
// routes to seed a real Business for a Lead to belong to.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createBusiness, // The function that runs when a new business should be created
  deleteAllBusinesses, // The function that runs when every business should be removed
} = require("../controllers/businesses.controller"); // Get these 2 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/businesses"

router.post("/", createBusiness); // When someone sends POST /businesses, run createBusiness
router.delete("/", deleteAllBusinesses); // When someone sends DELETE /businesses, run deleteAllBusinesses

module.exports = router; // Share this router so server.js can mount it
