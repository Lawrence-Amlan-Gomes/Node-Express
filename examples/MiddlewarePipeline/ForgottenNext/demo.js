// Proves that a middleware which never calls next() (and never sends a
// response) really does hang a request forever — measured with a real
// timeout race, not just asserted. AbortController lets us cancel our own
// request after a generous real timeout instead of waiting forever
// ourselves.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();

const controller = new AbortController();
const timeoutMs = 800;
const timer = setTimeout(() => controller.abort(), timeoutMs);
const start = Date.now();

try {
  await fetch(`http://localhost:${port}/hangs`, { signal: controller.signal });
  console.log("/hangs actually responded — this should never happen if the bug is really there");
} catch (err) {
  const elapsed = Date.now() - start;
  console.log(`/hangs never responded — request was cancelled after ${elapsed}ms (${err.name}), proving the missing next() really does hang it forever`);
} finally {
  clearTimeout(timer);
}

server.close();
