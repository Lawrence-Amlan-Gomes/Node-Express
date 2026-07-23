// A tiny real Express app — the thing Nginx will proxy to.
// os.hostname() inside a container is that container's own real, random ID —
// the same trick this project's other Docker demos already use to PROVE a
// request really passed through a real, specific container.
import os from "node:os";
import express from "express";

const app = express();

// One real route. Every response says which real container answered it.
app.get("/", (req, res) => {
  res.json({
    message: "Hello from behind Nginx",
    containerHostname: os.hostname(),
    timestamp: new Date().toISOString(),
  });
});

// Docker/Compose reads PORT from the environment — no hardcoded port here.
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`App container listening on port ${PORT}`);
});
