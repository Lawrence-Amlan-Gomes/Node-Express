// Two real APIs on the SAME port, side by side — one with no CORS
// configuration at all, one properly configured — so a real browser
// page can hit both and show the real, different outcome.
const express = require("express");
const cors = require("cors");

function createApiServer(allowedOrigin) {
  const app = express();

  // NO cors() middleware on this route at all — the server still
  // answers normally (there is nothing server-side stopping this
  // request), but with no Access-Control-Allow-Origin header, a real
  // browser refuses to hand the response to the page's own JS.
  app.get("/no-cors", (req, res) => {
    res.json({ data: "this data really left the server" });
  });

  // Properly configured for one specific real origin.
  app.get("/with-cors", cors({ origin: allowedOrigin }), (req, res) => {
    res.json({ data: "this data is allowed through to the browser's JS" });
  });

  // Sets a real cookie on the API's own origin the first time it's hit.
  app.get("/set-cookie", cors({ origin: allowedOrigin, credentials: true }), (req, res) => {
    res.cookie("session", "real-session-value", { httpOnly: true });
    res.json({ ok: true });
  });

  // Reports whether a cookie actually arrived with THIS request —
  // credentials (cookies) only cross an origin boundary if BOTH sides
  // opt in: the server needs credentials: true (with one specific real
  // origin — "*" is rejected outright for credentialed requests), AND
  // the client's own fetch call needs credentials: "include".
  app.get("/whoami", cors({ origin: allowedOrigin, credentials: true }), (req, res) => {
    res.json({ cookieReceived: req.headers.cookie ?? null });
  });

  return app;
}

module.exports = { createApiServer };
