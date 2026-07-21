// Every response reports this real process's own real PID — the only
// way to actually prove PM2 restarted it with a genuinely NEW process.
export function getStatus(req, res) {
  res.json({ pid: process.pid });
}
