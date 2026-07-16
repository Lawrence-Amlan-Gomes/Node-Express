// OWASP's "Security Misconfiguration" category covers exactly this: an
// Express app's DEFAULT headers quietly reveal information and leave
// real, well-known protections turned off. helmet sets a real batch of
// HTTP response headers that fix this in one line — this proves the
// actual, real header difference, not a description of what it "does."
import express from "express";
import helmet from "helmet";
import { pathToFileURL } from "node:url";

export const appWithoutHelmet = express();
appWithoutHelmet.get("/", (req, res) => res.json({ ok: true }));

export const appWithHelmet = express();
appWithHelmet.use(helmet());
appWithHelmet.get("/", (req, res) => res.json({ ok: true }));

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4063;
  appWithHelmet.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
