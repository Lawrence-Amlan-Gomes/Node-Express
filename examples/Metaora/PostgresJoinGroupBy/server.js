// This is the server.js file for the "PostgresJoinGroupBy" mini-project.
// What this file does: same real shape as every other server.js in this
// project — builds the real Express app, connects the real URLs to their
// routes, and starts a real server on a fixed port only when this exact
// file is run directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const businessesRouter = require("./routes/businesses.routes"); // Get the real router that knows about /businesses
const leadsRouter = require("./routes/leads.routes"); // Get the real router that knows about /leads
const reportsRouter = require("./routes/reports.routes"); // Get the real router that knows about /reports

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/businesses", businessesRouter); // Send every request starting with /businesses to the businesses router
app.use("/leads", leadsRouter); // Send every request starting with /leads to the leads router
app.use("/reports", reportsRouter); // Send every request starting with /reports to the reports router

module.exports = app; // Share this app so it can be imported and tested directly

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4142; // Use the PORT from .env, or 4142 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
