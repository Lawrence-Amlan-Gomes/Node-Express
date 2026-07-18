// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here, or what CORS middleware ran before it — that's the routes
// file's job, not this one.

// Handles GET /no-cors. There is nothing server-side stopping this
// request — the server still answers normally — but with no
// Access-Control-Allow-Origin header, a real browser refuses to hand
// the response to the page's own JS.
function getNoCors(req, res) {
  // Send back a real reply — the server's own job is already done here.
  res.json({ data: "this data really left the server" });
}

// Handles GET /with-cors. Properly configured (by the routes file) for
// one specific real origin, so the browser really does let the page's
// own JS read this response.
function getWithCors(req, res) {
  // Send back a real reply — this time the browser will really allow it through.
  res.json({ data: "this data is allowed through to the browser's JS" });
}

// Handles GET /set-cookie. Sets a real cookie on the API's own origin
// the first time it's hit.
function setCookie(req, res) {
  // Actually sets a real, httpOnly cookie on the response.
  res.cookie("session", "real-session-value", { httpOnly: true });
  // Confirm the real cookie was set.
  res.json({ ok: true });
}

// Handles GET /whoami. Reports whether a cookie actually arrived with
// THIS request — credentials (cookies) only cross an origin boundary if
// BOTH sides opt in: the server needs credentials: true (with one
// specific real origin — "*" is rejected outright for credentialed
// requests), AND the client's own fetch call needs credentials:
// "include".
function whoami(req, res) {
  // Report the real cookie header this exact request actually arrived with, if any.
  res.json({ cookieReceived: req.headers.cookie ?? null });
}

module.exports = { getNoCors, getWithCors, setCookie, whoami };
