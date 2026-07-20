import express from "express";
import { pathToFileURL } from "node:url";
import fibonacciRoutes from "./routes/fibonacci.routes.js";

const app = express();

app.use("/", fibonacciRoutes);

const PORT = process.env.PORT ?? 4091;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`ComposeMultiContainer app listening on port ${PORT}`);
  });
}

export { app };
