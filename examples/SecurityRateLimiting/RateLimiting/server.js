// Rate limiting caps how many real requests one real client can make in
// a real time window — without it, a single client (accidental buggy
// retry loop, or a real attacker) can hammer an endpoint as fast as the
// network allows, exhausting real server resources or brute-forcing a
// login endpoint one password guess per request.
import express from "express";
import { rateLimit } from "express-rate-limit";
import { pathToFileURL } from "node:url";

export const app = express();

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

app.get("/limited", limiter, (req, res) => {
  res.status(200).json({ data: "this request was allowed through" });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4062;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
