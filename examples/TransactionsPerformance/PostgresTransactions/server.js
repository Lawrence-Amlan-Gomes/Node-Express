// This example is a real Express API, not just a script that calls
// Prisma directly. A real backend job never talks to an ORM straight
// from a throwaway script — it exposes real HTTP routes, and the ORM
// logic (including the real $transaction call) lives in a controller
// behind them, same as every other Express topic in this project.
require("dotenv").config({ quiet: true });
const express = require("express");
const accountsRouter = require("./routes/accounts.routes");

// Creates the real, empty Express app every route below attaches to.
const app = express();

// Needed so POST /accounts/transfer can read req.body.
app.use(express.json());

// Every request under "/accounts" is handed off to the real accounts router.
app.use("/accounts", accountsRouter);

// Exported so demo.js can import this exact app and drive it with real
// HTTP requests, instead of calling Prisma directly.
module.exports = app;

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports the app above and controls its own ephemeral-port
// listener instead. CommonJS's own real check for "was this the entry file."
if (require.main === module) {
  // A real, fixed, known port — so a person (or Postman) running this file
  // directly always knows exactly where to send a request.
  const PORT = process.env.PORT ?? 4045;
  // Actually starts the server for real, opening the port and listening.
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
