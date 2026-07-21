// This demo DOES import { app } directly and start it itself — a
// deliberate exception to this project's usual "demo.js only ever calls
// fetch(), never imports the app directly" rule. That rule exists to keep
// demo.js on the same side of the HTTP boundary a real client would be
// on. Here it doesn't apply: the whole point of this section is attaching
// a debugger to THIS EXACT process, so the server has to run inside this
// same process for that to mean anything.
import { app } from "./server.js";
import inspector from "node:inspector";

async function main() {
  // Port 0 asks the OS for any real free port — this demo's own server is
  // throwaway and only used internally, so it never needs to be the same
  // fixed 4096 a human would use to try this section's PostmanCheck/Chrome
  // DevTools walkthrough separately. This also avoids a real, confirmed
  // collision: Next.js can invoke this same Server Component more than
  // once for a single page request, and two real processes both trying
  // to bind the SAME fixed port crash with EADDRINUSE.
  const server = app.listen(0);
  const { port: PORT } = server.address();

  // Same real reasoning applies to the inspector's own port — 0 lets the
  // OS pick a free one instead of the fixed default (9229), which could
  // just as easily collide under the same concurrent-render conditions.
  inspector.open(0, "127.0.0.1", false);
  console.log(`Real inspector protocol now open on: ${inspector.url()}`);

  // A real session is a real connection to that protocol — normally
  // Chrome DevTools opens one of these for you when you click "inspect".
  const session = new inspector.Session();
  session.connect();

  // Wraps session.post's callback API in a real Promise, so this script
  // can await each real inspector command in order.
  function evaluate(expression) {
    return new Promise((resolve, reject) => {
      session.post("Runtime.evaluate", { expression }, (err, result) => {
        if (err) reject(err);
        else resolve(result.result.value);
      });
    });
  }

  // Proves the debugger can run REAL arbitrary code inside the live
  // process — the same thing typing into DevTools' Console tab does.
  const mathResult = await evaluate("2 ** 10");
  console.log(`\nReal code evaluated live, inside the running process: 2 ** 10 = ${mathResult}`);

  // Send three real HTTP requests to the real live server, so its real
  // requestCount actually changes while the debugger is attached.
  console.log("\nSending 3 real requests to the live server...");
  for (let i = 0; i < 3; i++) {
    await fetch(`http://localhost:${PORT}/compute?n=10`);
  }

  // Reads the server's REAL current state, live, through the debugger —
  // not by calling the API again, but by reaching directly into the
  // running process's memory the same way Chrome DevTools would.
  const liveRequestCount = await evaluate("globalThis.__requestCount");
  console.log(`Real requestCount read LIVE through the debugger session: ${liveRequestCount}`);

  session.disconnect();
  inspector.close();
  server.close();
}

main();
