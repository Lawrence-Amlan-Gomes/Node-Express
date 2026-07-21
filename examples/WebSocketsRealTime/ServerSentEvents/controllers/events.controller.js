const TOTAL_TICKS = 5;

// Streams real events to ONE already-open HTTP connection — this is the
// whole idea of SSE: one real request, many real responses over time.
export function streamEvents(req, res) {
  // These three real headers are what make this an SSE connection instead
  // of an ordinary JSON response — the client must be told to expect a
  // continuous stream, not one finished body.
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let tick = 0;

  const interval = setInterval(() => {
    tick++;
    const payload = JSON.stringify({ tick, serverTime: Date.now() });
    // The real SSE wire format: "data: <payload>\n\n" — that blank line
    // is what tells a real SSE client "this one event is complete."
    res.write(`data: ${payload}\n\n`);

    if (tick >= TOTAL_TICKS) {
      clearInterval(interval);
      // Ends the real connection after a fixed, known number of events —
      // a real production stream (e.g. live scores) would just keep going
      // until the client disconnects.
      res.end();
    }
  }, 500);

  // If the real client disconnects early, stop pushing into a dead
  // connection instead of leaking a real interval forever.
  req.on("close", () => clearInterval(interval));
}
