import os from "node:os";

// Handles GET / — the exact same handler runs whether this container is
// sitting on this laptop or on the real Coolify server. Nothing here
// changes based on WHERE it's deployed — that's the whole point of a
// container: the same image runs identically everywhere.
export function getRoot(req, res) {
  res.json({
    message: "Hello from a real, deployed Docker container!",
    hostname: os.hostname(),
    nodeVersion: process.version,
    // Coolify (and every real host) sets NODE_ENV=production for you —
    // a real, visible sign this response came from the real deployment,
    // not a local run.
    environment: process.env.NODE_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}

// Handles GET /health — real hosts (Coolify included) poll an endpoint
// like this on a real interval to know whether to keep routing traffic
// to this container, or restart it.
export function getHealth(req, res) {
  res.json({ status: "ok" });
}
