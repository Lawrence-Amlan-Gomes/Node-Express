// Everything a plain WebSocket connection does, kept in its own file — the
// same "one file owns this concern" idea as a controller, just for a real
// WebSocket connection instead of an HTTP request/response.
export function registerEchoHandlers(wss) {
  wss.on("connection", (socket) => {
    // The server can push a message the INSTANT a client connects — no
    // request from the client required. A real REST endpoint can never do
    // this; it can only ever reply to a request it already received.
    socket.send(JSON.stringify({ type: "welcome", message: "Real WebSocket connection open. Send me anything." }));

    socket.on("message", (raw) => {
      const text = raw.toString();
      console.log(`Server received a real message: ${text}`);

      if (text === "ping") {
        // A real, immediate, TWO-WAY reply over the SAME already-open
        // connection — no new HTTP request/response round trip needed.
        socket.send(JSON.stringify({ type: "pong", serverTime: Date.now() }));
      }
    });
  });
}
