// A single real Express API exposing MongoDB's two real schema design
// options at two separate real URL prefixes — a real, direct proof of
// the cost difference between them, over real HTTP, not a throwaway
// script calling Mongoose directly.
require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const embeddedRouter = require("./routes/embedded.routes");
const referencedRouter = require("./routes/referenced.routes");

// Creates the real, empty Express app every route below attaches to.
const app = express();

// Needed so both resources' POST routes can read req.body.
app.use(express.json());

// APPROACH 1: embedding.
app.use("/posts-embedded", embeddedRouter);
// APPROACH 2: referencing.
app.use("/posts-referenced", referencedRouter);

// Opens a real connection to the real Atlas cluster. Mongoose queues
// operations internally until this resolves, so the routes above can be
// used right away without this file explicitly waiting on it here.
mongoose.connect(process.env.MONGODB_DATABASE_URL);

// Exported so demo.js can import this exact app and drive it with real
// HTTP requests, instead of calling Mongoose directly.
module.exports = app;

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports the app above and controls its own ephemeral-port
// listener instead. CommonJS's own real check for "was this the entry file."
if (require.main === module) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4044;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
