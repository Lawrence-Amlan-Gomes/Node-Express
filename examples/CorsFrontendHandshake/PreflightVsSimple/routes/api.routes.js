// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual response logic lives here at all.
const { Router } = require("express");
const { getSimpleData, putComplexData, postJsonData } = require("../controllers/api.controller");

// A factory, not a plain router, because api-server.js needs a FRESH
// router every time createApiServer() runs — there's no per-route real
// logic here, just three path/method declarations.
function createApiRoutes() {
  const router = Router();

  // GET — a real CORS-safelisted "simple" method, no preflight in front of it.
  router.get("/simple-data", getSimpleData);
  // PUT — NOT safelisted, a real OPTIONS preflight happens first.
  router.put("/complex-data", putComplexData);
  // POST with JSON — also NOT safelisted, a real OPTIONS preflight happens first.
  router.post("/json-data", postJsonData);

  return router;
}

module.exports = createApiRoutes;
