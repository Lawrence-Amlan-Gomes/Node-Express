// api-server.js's job is small on purpose, same as every other topic's
// server.js: create the app, wire in global middleware, mount the real
// routes, and — here specifically — log every request that actually
// arrives, so we can PROVE whether a preflight really happened instead
// of just asserting it. The real route logic lives in controllers/, one
// layer down.
const express = require("express");
const cors = require("cors");
const createApiRoutes = require("./routes/api.routes");

// A factory, not a plain module-level app, because demo.js needs to
// supply the REAL allowed origin at runtime (the "frontend" server's
// own real port, decided by demo.js, not known ahead of time here).
function createApiServer(allowedOrigin) {
  // Creates the real, empty Express app every route below attaches to.
  const app = express();
  // Every request that actually arrives gets pushed here, in real order.
  const requestLog = [];

  // Runs before anything else — records the real method + path of
  // EVERY request that reaches this server, including any real OPTIONS
  // preflight the browser sends on its own.
  app.use((req, res, next) => {
    requestLog.push(`${req.method} ${req.path}`);
    next();
  });

  // The real cors middleware — configured for one specific real origin
  // (never "*" once credentials/specific origins matter), handling the
  // real preflight OPTIONS response automatically.
  app.use(cors({ origin: allowedOrigin, methods: ["GET", "PUT", "POST"] }));
  // Needed so POST /json-data can read req.body.
  app.use(express.json());
  // Mounts the three real routes declared in routes/api.routes.js.
  app.use(createApiRoutes());

  // Both are handed back to demo.js — the real app to serve, and the
  // real log to read once every request has actually happened.
  return { app, requestLog };
}

module.exports = { createApiServer };
