import express from "express";
import { pathToFileURL } from "node:url";
import deployRoutes from "./routes/deploy.routes.js";

const app = express();

app.use("/", deployRoutes);

const PORT = process.env.PORT ?? 4092;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`DeployToCoolify app listening on port ${PORT}`);
  });
}

export { app };
