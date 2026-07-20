// A real, plain Express app — nothing in THIS file is Docker-specific.
// That's the actual point: a well-built Express app doesn't need to know
// or care that it's about to be packaged into a container. Docker wraps
// this file; it never changes it.
import express from "express";
import { pathToFileURL } from "node:url";
import statusRoutes from "./routes/status.routes.js";

const app = express();

app.use("/", statusRoutes);

// Every real container needs to listen on the SAME port the Dockerfile's
// EXPOSE line documents and the "docker run -p" command maps to — 4090
// here, matching this project's port-audit convention.
const PORT = process.env.PORT ?? 4090;

// Same ESM "run directly vs imported" guard used across this whole
// project (see co-founder/build-conventions.md) — lets a demo script
// import { app } without it starting a real server, while "node server.js"
// (which is exactly what the Dockerfile's CMD runs) still listens for real.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`DockerfileBasics app listening on port ${PORT}`);
  });
}

export { app };
