import express from "express";
import { pathToFileURL } from "node:url";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use("/", reportRoutes);

const PORT = process.env.PORT ?? 4099;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
