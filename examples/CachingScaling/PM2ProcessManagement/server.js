// This file skips the usual ESM "run directly vs imported" guard used
// everywhere else in this project — confirmed necessary: PM2's fork mode
// actually runs scripts through its OWN wrapper module
// (node_modules/pm2/lib/ProcessContainerFork.js), so process.argv[1]
// never equals this file's own path when PM2 starts it, and the guard
// silently never fires — no listen(), no error, just a process that
// looks "online" in `pm2 list` but never opens a real port. Safe here
// because nothing in this mini-project ever imports server.js as a
// module — it's always run directly, or via PM2.
import express from "express";
import statusRoutes from "./routes/status.routes.js";

const app = express();

app.use("/", statusRoutes);

const PORT = process.env.PORT ?? 4102;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${server.address().port}`);
});
