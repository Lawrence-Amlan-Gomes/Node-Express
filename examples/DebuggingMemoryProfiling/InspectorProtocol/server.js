// A real, plain Express app — nothing in this file is debugger-specific.
// That's the actual point of this section: attaching a debugger never
// requires changing your app's code, only how you START the process.
import express from "express";
import { pathToFileURL } from "node:url";
import computeRoutes from "./routes/compute.routes.js";

const app = express();

app.use("/", computeRoutes);

const PORT = process.env.PORT ?? 4096;

// Same ESM "run directly vs imported" guard used across this whole
// project (see co-founder/build-conventions.md).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  app.listen(PORT, () => {
    console.log(`InspectorProtocol app listening on port ${PORT}`);
  });
}

export { app };
