// This is the leads.routes.js file for the "PrismaCrudBasics" mini-project.
// What this file does: maps each real Lead URL + method to the matching
// function in controllers/leads.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  createLead, // The function that runs when a new lead should be created
  listLeads, // The function that runs when leads should be listed (with a real filter)
  updateLeadStatus, // The function that runs when one lead's status should change
  deleteLead, // The function that runs when one lead should be removed
  deleteAllLeads, // The function that runs when every lead should be removed
} = require("../controllers/leads.controller"); // Get these 5 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/leads"

router.post("/", createLead); // When someone sends POST /leads, run createLead
router.get("/", listLeads); // When someone visits GET /leads (optionally ?status=...), run listLeads
router.patch("/:id", updateLeadStatus); // When someone sends PATCH /leads/123, run updateLeadStatus with id 123
router.delete("/:id", deleteLead); // When someone sends DELETE /leads/123, run deleteLead with id 123
router.delete("/", deleteAllLeads); // When someone sends DELETE /leads, run deleteAllLeads

module.exports = router; // Share this router so server.js can mount it
