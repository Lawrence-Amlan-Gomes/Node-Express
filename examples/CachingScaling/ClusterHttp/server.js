// A deliberate departure from this project's usual server.js shape: the
// cluster module's whole point is forking REAL separate OS processes, so
// this file is always meant to be run directly (never imported) — there
// is no single "app" to export, since the primary process never builds
// an Express app at all.
import cluster from "node:cluster";
import express from "express";
import statusRoutes from "./routes/status.routes.js";

const PORT = process.env.PORT ?? 4101;
const NUM_WORKERS = 3;

if (cluster.isPrimary) {
  console.log(`Real primary process ${process.pid} forking ${NUM_WORKERS} real worker processes...`);
  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = cluster.fork();
    // Logged here, not just in the worker's own "listening" message —
    // this is the one real source of truth for "which PIDs are the
    // ORIGINAL workers," independent of which ones happen to answer an
    // HTTP request first.
    console.log(`Real worker forked: ${worker.process.pid}`);
  }

  // THE REAL FAULT-ISOLATION BEHAVIOR: whenever any real worker process
  // exits — crash, deliberate exit, anything — fork a real replacement
  // immediately. This is the standard real production pattern; it's what
  // makes cluster "fault-isolated" rather than just "faster."
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Real worker ${worker.process.pid} exited (code ${code}, signal ${signal}) — forking a real replacement...`);
    cluster.fork();
  });

  // A real graceful-shutdown handler — without this, killing just the
  // primary process leaves every real forked worker running as an
  // orphan, since a signal to the primary does NOT automatically cascade
  // to its children. Real production process managers (PM2 included)
  // rely on exactly this kind of handler.
  process.on("SIGTERM", () => {
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });
} else {
  // Every real worker runs this exact same real Express app — cluster
  // handles the actual OS-level mechanics of sharing one port across all
  // of them.
  const app = express();
  app.use("/", statusRoutes);
  const server = app.listen(PORT, () => {
    console.log(`Real worker ${process.pid} listening on port ${server.address().port}`);
  });
}
