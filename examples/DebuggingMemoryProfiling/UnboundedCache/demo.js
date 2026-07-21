import { app } from "./server.js";

// Port 0 asks the OS for any real free port — this demo's own server is
// throwaway and separate from the fixed 4094 a human uses for the
// PostmanCheck walkthrough. Avoids a real, confirmed collision: Next.js
// can invoke this same Server Component more than once for one page
// request, and two real processes both binding the SAME fixed port crash
// with EADDRINUSE.
const server = app.listen(0);
const { port: PORT } = server.address();

console.log("Requesting 20 real, UNIQUE ids from /data-buggy — nothing ever evicts an entry...");
for (let i = 0; i < 20; i++) {
  await fetch(`http://localhost:${PORT}/data-buggy/user-${i}`);
}

console.log("Requesting 20 real, UNIQUE ids from /data-fixed — capped at 5, oldest evicted first...");
for (let i = 0; i < 20; i++) {
  await fetch(`http://localhost:${PORT}/data-fixed/user-${i}`);
}

const statsRes = await fetch(`http://localhost:${PORT}/cache-stats`);
const stats = await statsRes.json();

console.log("\nReal cache sizes after 20 real, unique requests to each route:");
console.log(JSON.stringify(stats, null, 2));

console.log(
  `\nbuggySize grew to match every unique id ever seen (${stats.buggySize}) — that never stops growing. fixedSize stayed capped at ${stats.maxFixedSize}, no matter how many more unique ids arrive.`,
);

server.close();
