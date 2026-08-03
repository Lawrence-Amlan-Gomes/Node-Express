// This is the server.js file for the "InnerLeftJoin" mini-project.
// What this file does: builds the real Express app, connects the
// "/customers" and "/orders" URLs to their routes, and starts a real
// server on a fixed port only when this exact file is run directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const customersRouter = require("./routes/customers.routes"); // Get the real router that knows about /customers
const ordersRouter = require("./routes/orders.routes"); // Get the real router that knows about /orders

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/customers", customersRouter); // Send every request starting with /customers to the customers router
app.use("/orders", ordersRouter); // Send every request starting with /orders to the orders router

module.exports = app; // Share this app so a demo/test could import and use it directly

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4144; // Use the PORT from .env, or 4144 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
