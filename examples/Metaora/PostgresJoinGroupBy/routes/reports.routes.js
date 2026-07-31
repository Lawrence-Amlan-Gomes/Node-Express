// This is the reports.routes.js file for the "PostgresJoinGroupBy"
// mini-project. What this file does: maps each real report URL to the
// matching function in controllers/reports.controller.js.
const { Router } = require("express"); // Load Express's Router tool, a mini version of a full app
const {
  recoveredLeadsByBusiness, // Metaora's own INNER JOIN + GROUP BY report
  allBusinessesLeadCounts, // The LEFT JOIN version — proves the INNER vs LEFT difference for real
  explainJoin, // Returns Postgres's own real EXPLAIN plan for the report query
} = require("../controllers/reports.controller"); // Get these 3 real functions from the controller file

const router = Router(); // Create a real, empty router — server.js will mount this at "/reports"

router.get("/recovered-leads-by-business", recoveredLeadsByBusiness); // Metaora's own exact report
router.get("/all-businesses-lead-counts", allBusinessesLeadCounts); // The LEFT JOIN contrast
router.get("/explain-join", explainJoin); // The real query plan, proving what the index does

module.exports = router; // Share this router so server.js can mount it
