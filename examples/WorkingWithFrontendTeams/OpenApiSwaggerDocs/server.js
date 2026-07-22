// server.js creates the app, wires the real spec into real interactive
// docs, mounts the real Products routes, and starts listening.
import express from "express";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import productsRouter from "./routes/products.routes.js";

// __dirname doesn't exist in ESM — this rebuilds the equivalent so the
// spec file loads correctly no matter which folder this script is run FROM.
const __dirname = dirname(fileURLToPath(import.meta.url));
// Read the real openapi.yaml file's real text off disk.
const specText = readFileSync(join(__dirname, "openapi.yaml"), "utf-8");
// Parse the real YAML text into a real JS object — the same spec a
// frontend dev (or a tool like Prism, see the next section) would read.
export const openApiSpec = parse(specText);

// Creates the real, empty Express app every route below attaches to.
export const app = express();
// Needed so POST /products can read req.body.
app.use(express.json());

// Serves the raw real spec as JSON — useful for tools that consume it
// programmatically (Prism, a codegen tool, an API client).
app.get("/openapi.json", (req, res) => res.status(200).json(openApiSpec));
// Serves REAL, interactive documentation at /docs, generated straight
// from the spec above — a frontend dev can open this in a browser, read
// every real endpoint, and even click "Try it out" to send a real request.
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Every request under "/products" is handed off to the real products router.
app.use("/products", productsRouter);

// Only actually listen when this file is run directly (`node server.js`) —
// demo.js imports { app } and controls its own ephemeral-port listener.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // A real, fixed, known port — matching openapi.yaml's own servers: entry.
  const PORT = process.env.PORT ?? 4121;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT} — docs at /docs`));
}
