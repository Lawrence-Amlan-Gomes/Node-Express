// The only file with real logic in it — everything Docker-specific
// (which base image, which files get copied in) lives in the Dockerfile,
// not here. This handler doesn't know or care that it's running inside
// a container at all.
import os from "node:os";

// Handles GET / — proves the app running INSIDE a container is a real,
// working Node process, not a stand-in.
export function getStatus(req, res) {
  // os.hostname() inside a Docker container returns the container's own
  // short random ID (e.g. "a3f9c1d2e8b1") — a real, visible sign this
  // response came from inside a container, not from your own machine.
  res.json({
    message: "Hello from inside a real Docker container!",
    hostname: os.hostname(),
    nodeVersion: process.version,
    platform: process.platform,
    uptimeSeconds: Math.round(process.uptime()),
  });
}
