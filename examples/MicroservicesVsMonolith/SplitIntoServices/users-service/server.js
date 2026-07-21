import express from "express";
import { pathToFileURL } from "node:url";
import userRoutes from "./routes/user.routes.js";

// A real, complete, standalone Express app — its own real deployment,
// runnable entirely on its own, with zero knowledge that "orders" exist.
const app = express();
app.use("/", userRoutes);

const PORT = process.env.PORT ?? 4111;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
