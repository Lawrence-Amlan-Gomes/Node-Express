// This is the leads.routes.js file for the "PostgresJoinGroupBy"
// mini-project. What this file does: maps each real Lead URL + method to
// the matching function in controllers/leads.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createLead, // The function that runs when a new lead should be created
  deleteAllLeads, // The function that runs when every lead should be removed
} = require("../controllers/leads.controller"); // Get these 2 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/leads"

router.post("/", createLead); // When someone sends POST /leads, run createLead
router.delete("/", deleteAllLeads); // When someone sends DELETE /leads, run deleteAllLeads

module.exports = router; // Share this router so server.js can mount it
