// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — including, here, WHICH real cors()
// middleware (if any) runs in front of each one. No actual response
// logic lives here at all.
const { Router } = require("express");
const cors = require("cors");
const { getNoCors, getWithCors, setCookie, whoami } = require("../controllers/api.controller");

// A factory, not a plain router, because api-server.js needs the REAL
// allowed origin (decided by demo.js at runtime) to build each route's
// own real cors() middleware.
function createApiRoutes(allowedOrigin) {
  const router = Router();

  // NO cors() middleware on this route at all — a real, deliberate absence.
  router.get("/no-cors", getNoCors);
  // Properly configured for one specific real origin.
  router.get("/with-cors", cors({ origin: allowedOrigin }), getWithCors);
  // credentials: true is required for a real cookie to be allowed to cross origins at all.
  router.get("/set-cookie", cors({ origin: allowedOrigin, credentials: true }), setCookie);
  // Same real credentials: true requirement, so the browser is allowed to send the cookie back.
  router.get("/whoami", cors({ origin: allowedOrigin, credentials: true }), whoami);

  return router;
}

module.exports = createApiRoutes;
