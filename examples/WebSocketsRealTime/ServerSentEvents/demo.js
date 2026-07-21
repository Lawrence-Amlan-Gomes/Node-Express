import { app } from "./server.js";

const server = app.listen(0);
const { port } = server.address();

console.log("Opening ONE real HTTP connection to /events...");

const response = await fetch(`http://localhost:${port}/events`);
const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = "";
let eventsReceived = 0;

// Reads the real, ongoing response body in chunks — never fully "finished"
// until the server itself decides to close it, unlike a normal fetch that
// completes the instant a response body arrives.
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  buffer += decoder.decode(value, { stream: true });

  // A real SSE message always ends in a blank line ("\n\n") — split on
  // that to pull out each complete real event as it arrives, regardless
  // of how the bytes happened to be chunked over the wire.
  let boundary;
  while ((boundary = buffer.indexOf("\n\n")) !== -1) {
    const rawEvent = buffer.slice(0, boundary);
    buffer = buffer.slice(boundary + 2);

    if (rawEvent.startsWith("data: ")) {
      const data = JSON.parse(rawEvent.slice("data: ".length));
      eventsReceived++;
      console.log(`  Real event #${data.tick} — pushed by the server, no request from us: ${JSON.stringify(data)}`);
    }
  }
}

console.log(`\nReal events received over ONE real HTTP connection: ${eventsReceived}`);
console.log("Compare that to polling: this used exactly 1 real request total, not one per update.");

server.close();
