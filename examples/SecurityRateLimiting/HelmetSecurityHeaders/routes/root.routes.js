// A "routes" file's only job is declaring WHICH path + HTTP method maps to
// WHICH controller function — no actual response logic lives here at all.
import { Router } from "express";
import { getRoot } from "../controllers/root.controller.js";

// A factory, not a plain router, because server.js mounts this SAME real
// route on two different real apps (with and without helmet).
function createRootRoutes() {
  const router = Router();

  // The one real route both apps share — identical on purpose, so the
  // ONLY real difference between the two apps is their response headers.
  router.get("/", getRoot);

  return router;
}

export default createRootRoutes;
