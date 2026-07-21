import express from "express";
import { pathToFileURL } from "node:url";
import priceRoutes from "./routes/price.routes.js";
import { startPriceTicker } from "./controllers/price.controller.js";

const app = express();

app.use("/", priceRoutes);

// Starts ticking the real price immediately, the moment this module loads
// — not tied to any request. Exported so demo.js can clearInterval() it
// when it's done, letting the process exit cleanly instead of hanging.
const ticker = startPriceTicker();

const PORT = process.env.PORT ?? 4103;

// Only actually listen on the real fixed port when this file is run
// directly — see co-founder/build-conventions.md's ESM run-guard entry.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app, ticker };
