import express from "express";
import { pathToFileURL } from "node:url";
import cacheRoutes from "./routes/cache.routes.js";

const app = express();

app.use("/", cacheRoutes);

const PORT = process.env.PORT ?? 4094;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export { app };
