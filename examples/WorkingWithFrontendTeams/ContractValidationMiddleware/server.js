// server.js wires the real spec in as REAL, ENFORCED middleware — not
// just documentation sitting next to the code, hoping it stays accurate.
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import ordersRouter from "./routes/orders.routes.js";

// __dirname doesn't exist in ESM — rebuilds the equivalent so the spec
// file loads correctly no matter which folder this script is run FROM.
const __dirname = dirname(fileURLToPath(import.meta.url));

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so the validator (and POST /orders) can read req.body.
app.use(express.json());

// The real enforcement: every request from here down gets checked
// against openapi.yaml BEFORE it can reach any route below. A request
// that violates the spec never reaches routes/controllers at all.
app.use(
  OpenApiValidator.middleware({
    apiSpec: join(__dirname, "openapi.yaml"),
    validateRequests: true,
  }),
);

// Only requests that already passed real spec validation reach this point.
app.use("/orders", ordersRouter);

// express-openapi-validator throws a real error (with real per-field
// details) when a request fails validation — this is the ONE place that
// error gets turned into real JSON, instead of every route re-implementing
// its own validation error handling.
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port.
  const PORT = process.env.PORT ?? 4123;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
