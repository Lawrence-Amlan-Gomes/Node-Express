import express from "express";
import { pathToFileURL } from "node:url";
import orderRoutes from "./routes/order.routes.js";

// A second, real, standalone Express app — its own real deployment,
// entirely separate from users-service, communicating with it only over
// a real network call.
const app = express();
app.use("/", orderRoutes);

const PORT = process.env.PORT ?? 4112;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
