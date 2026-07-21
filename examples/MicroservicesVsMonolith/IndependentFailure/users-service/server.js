import express from "express";
import { pathToFileURL } from "node:url";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use("/", userRoutes);

const PORT = process.env.PORT ?? 4113;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
