// This is the server.js file for the "ConstraintsDataIntegrity"
// mini-project. What this file does: builds the real Express app, connects
// the "/restrict", "/cascade", and "/products" URLs to their routes, and
// starts a real server on a fixed port only when this exact file is run
// directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const restrictRouter = require("./routes/restrict.routes"); // Get the real router that knows about /restrict
const cascadeRouter = require("./routes/cascade.routes"); // Get the real router that knows about /cascade
const productsRouter = require("./routes/products.routes"); // Get the real router that knows about /products

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/restrict", restrictRouter); // Send every request starting with /restrict to the restrict router
app.use("/cascade", cascadeRouter); // Send every request starting with /cascade to the cascade router
app.use("/products", productsRouter); // Send every request starting with /products to the products router

module.exports = app; // Share this app so a demo/test could import and use it directly

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4147; // Use the PORT from .env, or 4147 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
