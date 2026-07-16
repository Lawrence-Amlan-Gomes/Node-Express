// The real API — logs every single request that actually arrives,
// including any OPTIONS request the BROWSER sends on its own before the
// real one. This is how we can PROVE whether a preflight really
// happened, instead of just asserting it.
const express = require("express");
const cors = require("cors");

function createApiServer(allowedOrigin) {
  const app = express();
  const requestLog = [];

  app.use((req, res, next) => {
    requestLog.push(`${req.method} ${req.path}`);
    next();
  });

  // The real cors middleware — configured for one specific real origin
  // (never "*" once credentials/specific origins matter), handling the
  // real preflight OPTIONS response automatically.
  app.use(cors({ origin: allowedOrigin, methods: ["GET", "PUT", "POST"] }));
  app.use(express.json());

  // A "simple" request per the actual Fetch/CORS spec: GET, with no
  // custom headers, no non-simple Content-Type. The browser sends this
  // straight through — no preflight needed.
  app.get("/simple-data", (req, res) => res.json({ data: "simple GET result" }));

  // PUT is NOT one of the CORS-safelisted simple methods (only GET,
  // HEAD, POST qualify) — a real browser sends a real OPTIONS preflight
  // first, to ask permission, before ever sending this real PUT.
  app.put("/complex-data", (req, res) => res.json({ data: "PUT result" }));

  // A JSON POST is also non-simple — application/json is not one of the
  // CORS-safelisted content types (only form-urlencoded, multipart, and
  // text/plain qualify) — this also triggers a real preflight first.
  app.post("/json-data", (req, res) => res.json({ data: "POST result", received: req.body }));

  return { app, requestLog };
}

module.exports = { createApiServer };
