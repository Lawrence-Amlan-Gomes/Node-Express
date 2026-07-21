import { taskQueue } from "../queues/task.queue.js";

// Adds a real job with real retry rules: try up to 3 times total, and
// wait a real, fixed 500ms between each failed attempt before trying
// again — BullMQ handles the real waiting and re-queueing on its own,
// nothing here has to implement a retry loop by hand.
export async function queueFlakyTask(req, res) {
  const job = await taskQueue.add(
    "flaky-task",
    {},
    { attempts: 3, backoff: { type: "fixed", delay: 500 } },
  );
  res.status(202).json({ jobId: job.id });
}

// Reports the real, live state of a job — including how many real
// attempts have happened so far, and the real error from the most recent
// failure, if any.
export async function getTaskStatus(req, res) {
  const job = await taskQueue.getJob(req.params.id);
  if (!job) {
    res.status(404).json({ error: "No job with that id" });
    return;
  }

  const state = await job.getState();
  res.json({
    id: job.id,
    state,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason ?? null,
    returnValue: job.returnvalue ?? null,
  });
}
