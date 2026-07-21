import { reportQueue } from "../queues/report.queue.js";

// Does the real slow work DIRECTLY inside the request handler — this real
// request cannot finish until the real 2-second task finishes.
export async function generateReportSync(req, res) {
  const start = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.json({ tookMs: Date.now() - start, mode: "sync" });
}

// Adds a real job to the real queue and responds IMMEDIATELY — the actual
// slow work happens later, in the worker, completely outside this request.
export async function generateReportAsync(req, res) {
  const start = Date.now();
  const job = await reportQueue.add("generate-report", {});
  res.json({ tookMs: Date.now() - start, mode: "async", jobId: job.id });
}

// Lets a real client check on a real job whose original request is long
// finished — the client no longer has any direct connection to it at all.
export async function getReportStatus(req, res) {
  const job = await reportQueue.getJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: "No job with that id" });
    return;
  }

  const state = await job.getState();
  res.json({ id: job.id, state, returnValue: job.returnvalue ?? null });
}
