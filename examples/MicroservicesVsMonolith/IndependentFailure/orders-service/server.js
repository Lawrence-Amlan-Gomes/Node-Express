import express from "express";
import { pathToFileURL } from "node:url";
import orderRoutes from "./routes/order.routes.js";

const app = express();
app.use("/", orderRoutes);

const PORT = process.env.PORT ?? 4114;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
