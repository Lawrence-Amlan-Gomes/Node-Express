// server.js's job is small on purpose: create two real apps and mount
// the same real route on each. The real difference between them is
// entirely in the MIDDLEWARE, not the route logic — which is exactly
// why the controller and route are shared between both.
//
// OWASP's "Security Misconfiguration" category covers exactly this: an
// Express app's DEFAULT headers quietly reveal information and leave
// real, well-known protections turned off. helmet sets a real batch of
// HTTP response headers that fix this in one line — this proves the
// actual, real header difference, not a description of what it "does."
import express from "express";
import helmet from "helmet";
import { pathToFileURL } from "node:url";
import createRootRoutes from "./routes/root.routes.js";

// The real app with NO extra security headers — Express's own bare defaults.
export const appWithoutHelmet = express();
// Mounts the exact same real route as the helmet-protected app below.
appWithoutHelmet.use(createRootRoutes());

// The real app WITH helmet() turned on — a real batch of protective headers.
export const appWithHelmet = express();
// helmet() is real, global middleware — it has to run before the route
// below, so every real response from this app carries its real headers.
appWithHelmet.use(helmet());
// Mounts the exact same real route as the plain app above.
appWithHelmet.use(createRootRoutes());

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports both real apps above and controls its own ephemeral-port
// listeners instead. process.argv[1] is often a relative path while
// import.meta.url is always an absolute file:// URL, so pathToFileURL is
// needed for a correct comparison (see co-founder/build-conventions.md's
// ESM main-module note).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Two real, fixed, known ports — so a person (or Postman) running this
  // file directly can hit BOTH real apps and compare their real headers.
  const PORT_WITHOUT_HELMET = process.env.PORT_WITHOUT_HELMET ?? 4076;
  const PORT_WITH_HELMET = process.env.PORT_WITH_HELMET ?? 4063;
  // Actually starts the plain app for real, opening its own port.
  appWithoutHelmet.listen(PORT_WITHOUT_HELMET, () => console.log(`WITHOUT helmet: http://localhost:${PORT_WITHOUT_HELMET}`));
  // Actually starts the helmet-protected app for real, opening its own port.
  appWithHelmet.listen(PORT_WITH_HELMET, () => console.log(`WITH helmet: http://localhost:${PORT_WITH_HELMET}`));
}
