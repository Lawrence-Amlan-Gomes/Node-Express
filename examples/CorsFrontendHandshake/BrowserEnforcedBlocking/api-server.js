// api-server.js's job is small on purpose, same as every other topic's
// server.js: create the app and mount the real routes. The real route
// logic — and the real, per-route CORS configuration — lives one layer
// down, in routes/ and controllers/.
const express = require("express");
const createApiRoutes = require("./routes/api.routes");

// A factory, not a plain module-level app, because demo.js needs to
// supply the REAL allowed origin at runtime (the "frontend" server's
// own real port, decided by demo.js, not known ahead of time here).
function createApiServer(allowedOrigin) {
  // Creates the real, empty Express app every route below attaches to.
  const app = express();
  // Mounts the four real routes declared in routes/api.routes.js —
  // each one carries its own real cors() config (or deliberately none).
  app.use(createApiRoutes(allowedOrigin));
  // Handed back to demo.js, which decides when to actually start listening.
  return app;
}

module.exports = { createApiServer };
