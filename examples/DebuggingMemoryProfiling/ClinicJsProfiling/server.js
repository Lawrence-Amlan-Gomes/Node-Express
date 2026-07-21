import express from "express";
import { pathToFileURL } from "node:url";
import blockingRoutes from "./routes/blocking.routes.js";

const app = express();

app.use("/", blockingRoutes);

const PORT = process.env.PORT ?? 4095;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

export { app };
