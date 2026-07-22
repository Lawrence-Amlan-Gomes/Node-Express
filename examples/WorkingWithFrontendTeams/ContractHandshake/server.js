// server.js creates TWO real, separate apps — v1 (the original, honored
// contract) and v2 (the same endpoint, silently changed) — so both can be
// compared side by side, each on its own real, documented port.
import express from "express";
import { pathToFileURL } from "node:url";
import { profileRouterV1, profileRouterV2 } from "./routes/profile.routes.js";

// The real v1 app — GET /profile returns { id, name, email }.
export const appV1 = express();
appV1.use(profileRouterV1);

// The real v2 app — GET /profile returns { id, fullName, email } instead.
export const appV2 = express();
appV2.use(profileRouterV2);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports both apps and controls its own ephemeral-port listeners.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Two real, fixed, documented ports — one per app version.
  const PORT_V1 = process.env.PORT_V1 ?? 4119;
  const PORT_V2 = process.env.PORT_V2 ?? 4120;
  appV1.listen(PORT_V1, () => console.log(`v1 (honored contract) listening on http://localhost:${PORT_V1}`));
  appV2.listen(PORT_V2, () => console.log(`v2 (drifted contract) listening on http://localhost:${PORT_V2}`));
}
