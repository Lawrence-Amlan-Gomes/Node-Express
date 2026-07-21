import { emailQueue } from "../queues/email.queue.js";

// Writes a real job into Redis and responds immediately — this process
// never sends the real email itself.
export async function queueWelcomeEmail(req, res) {
  const { email } = req.body;
  const job = await emailQueue.add("welcome-email", { email });
  res.status(202).json({ jobId: job.id, queuedFor: email });
}

// Lets a real client check on a job's real progress, regardless of which
// real process ends up actually running it.
export async function getEmailJobStatus(req, res) {
  const job = await emailQueue.getJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: "No job with that id" });
    return;
  }

  const state = await job.getState();
  res.json({ id: job.id, state, returnValue: job.returnvalue ?? null });
}
