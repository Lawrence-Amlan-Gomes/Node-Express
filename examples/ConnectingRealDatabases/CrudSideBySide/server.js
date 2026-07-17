// A single real Express API exposing the SAME job (create/read/update/
// delete a task) against TWO different real databases, at two separate
// real URL prefixes — a real, direct proof of how the same job looks in
// each, over real HTTP, not two throwaway scripts calling ORMs directly.
require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const postgresTasksRouter = require("./routes/postgres-tasks.routes");
const mongoTasksRouter = require("./routes/mongo-tasks.routes");

// Creates the real, empty Express app every route below attaches to.
const app = express();

// Needed so both resources' POST routes can read req.body.
app.use(express.json());

// The Postgres half of the comparison, via Prisma.
app.use("/postgres-tasks", postgresTasksRouter);
// The MongoDB half of the comparison, via Mongoose.
app.use("/mongo-tasks", mongoTasksRouter);

// Opens a real connection to the real Atlas cluster. Mongoose queues
// operations internally until this resolves, so the mongo routes above
// can be used right away without this file explicitly waiting on it.
mongoose.connect(process.env.MONGODB_DATABASE_URL);

// Exported so demo.js can import this exact app and drive it with real
// HTTP requests, instead of calling either ORM directly.
module.exports = app;

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports the app above and controls its own ephemeral-port
// listener instead. CommonJS's own real check for "was this the entry file."
if (require.main === module) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4042;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
