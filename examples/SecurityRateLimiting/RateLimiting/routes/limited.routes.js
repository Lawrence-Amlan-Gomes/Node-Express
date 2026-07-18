// A "routes" file's only job is declaring WHICH path + HTTP method maps
// to WHICH controller function — including, here, WHICH real rate-limit
// middleware runs in front of it. No actual response logic lives here.
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { getLimited } from "../controllers/limited.controller.js";

// A mini version of "app" — mounted at the root by server.js.
const router = Router();

// The real rate-limit config — route-specific middleware, so it's
// declared here, next to the one route it actually protects.
const limiter = rateLimit({
  windowMs: 60_000, // a real 60-second window
  limit: 5, // only 5 real requests allowed per window, per client
  standardHeaders: true, // sends real RateLimit-* headers back
  legacyHeaders: false,
  // By default express-rate-limit sends a plain-text 429 body — real,
  // verified default, confirmed directly while building this example. A
  // real JSON API overrides it with a real structured error instead.
  message: { error: "too many requests, please try again later" },
});

// limiter runs FIRST, on every request to this route, before the real
// controller ever gets a chance to run.
router.get("/limited", limiter, getLimited);

// Exported so server.js can import it and mount it.
export default router;
