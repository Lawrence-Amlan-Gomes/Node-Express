// Every response reports its own REAL process.pid — the only way to
// actually prove more than one real OS process is sharing this one port.
export function getStatus(req, res) {
  res.json({ pid: process.pid });
}

// A real, deliberate self-crash — not a fabricated one. Responds first,
// THEN really exits, so the primary's real "exit" handler has something
// genuine to react to.
export function crashMe(req, res) {
  res.json({ pid: process.pid, crashing: true });
  setTimeout(() => process.exit(1), 50);
}
