import express from "express";
import { pathToFileURL } from "node:url";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use("/", productRoutes);

const PORT = process.env.PORT ?? 4098;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
