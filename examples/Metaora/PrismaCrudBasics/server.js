// This is the server.js file for the "PrismaCrudBasics" mini-project.
// What this file does: builds the real Express app and connects the real
// "/businesses" and "/leads" URLs to their routes, then starts a real
// server on a fixed port only when this exact file is run directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const businessesRouter = require("./routes/businesses.routes"); // Get the real router that knows about /businesses
const leadsRouter = require("./routes/leads.routes"); // Get the real router that knows about /leads

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/businesses", businessesRouter); // Send every request starting with /businesses to the businesses router
app.use("/leads", leadsRouter); // Send every request starting with /leads to the leads router

module.exports = app; // Share this app so it can be imported and tested directly

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4141; // Use the PORT from .env, or 4141 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
