// This is the server.js file for the "MongoConnectionAndDocuments" mini-project.
// What this file does: it builds the real Express app, connects the
// "/products" URLs to their routes, and starts a real server on a fixed
// port ONLY when this file is run directly.
require("dotenv").config({ quiet: true }); // Load the real values from .env into this program
const express = require("express"); // Load the Express library, the tool we use to build the web server
const productsRouter = require("./routes/products.routes"); // Get the real router that knows about /products

const app = express(); // Create a new, real, empty Express app

app.use(express.json()); // Turn on reading JSON request bodies, so req.body works

app.use("/products", productsRouter); // Send every request starting with /products to the products router

module.exports = app; // Share this app so it can be imported directly if ever needed

if (require.main === module) { // Only run the code below if this exact file was started directly (not imported)
  const PORT = process.env.PORT ?? 4130; // Use the PORT from .env, or 4130 if none is set
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`)); // Start the real server and print the real address
}
