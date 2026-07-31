// This is the server.js file for the "AsyncRouteErrorHandling" mini-project.
// What this file does: builds the real Express app, connects the
// "/customers" URLs to their routes, registers ONE real central
// error-handling middleware as the very LAST app.use(), and starts a real
// server on a fixed port only when this exact file is run directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const customersRouter = require("./routes/customers.routes"); // Get the real router that knows about /customers

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/customers", customersRouter); // Send every request starting with /customers to the customers router

// THIS is the "central error-handling middleware" the section is about.
// Express recognizes it as an error handler specifically because it takes
// 4 arguments (err, req, res, next) instead of the usual 3 — that's the
// one real rule Express uses to tell error middleware apart from normal
// middleware. It must be registered AFTER every real route, so a call to
// next(err) from any route above has somewhere real to land.
app.use((err, req, res, next) => { // Runs whenever any earlier route calls next(err) with a real error
  console.error("CENTRAL ERROR HANDLER caught:", err.message); // Log the real error server-side, so a real developer can see it
  res.status(500).json({ error: "Internal server error" }); // Send back one safe, generic message — never the raw internal error text
});

module.exports = app; // Share this app so it can be imported and tested directly

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4140; // Use the PORT from .env, or 4140 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
