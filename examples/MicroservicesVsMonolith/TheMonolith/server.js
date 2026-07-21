import express from "express";
import { pathToFileURL } from "node:url";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// Both real concerns — users AND orders — mounted on the SAME app, in the
// SAME real process. One deployment, one thing to start, one thing that
// can crash and take everything else down with it.
app.use("/", userRoutes);
app.use("/", orderRoutes);

const PORT = process.env.PORT ?? 4110;

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
}

export { app };
