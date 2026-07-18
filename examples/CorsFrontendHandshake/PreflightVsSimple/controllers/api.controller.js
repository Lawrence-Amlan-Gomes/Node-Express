// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here, or what CORS middleware ran before it — that's the routes
// file's job, not this one.

// Handles GET /simple-data. A "simple" request per the actual
// Fetch/CORS spec: GET, with no custom headers, no non-simple
// Content-Type. The browser sends this straight through — no preflight
// needed.
function getSimpleData(req, res) {
  // Send back a real, fixed JSON reply — proving this route was really reached.
  res.json({ data: "simple GET result" });
}

// Handles PUT /complex-data. PUT is NOT one of the CORS-safelisted
// simple methods (only GET, HEAD, POST qualify) — a real browser sends
// a real OPTIONS preflight first, to ask permission, before ever
// sending this real PUT.
function putComplexData(req, res) {
  // Send back a real, fixed JSON reply — proving this route was really reached.
  res.json({ data: "PUT result" });
}

// Handles POST /json-data. A JSON POST is also non-simple —
// application/json is not one of the CORS-safelisted content types
// (only form-urlencoded, multipart, and text/plain qualify) — this
// also triggers a real preflight first.
function postJsonData(req, res) {
  // Echo back the real request body, proving express.json() really parsed it.
  res.json({ data: "POST result", received: req.body });
}

module.exports = { getSimpleData, putComplexData, postJsonData };
