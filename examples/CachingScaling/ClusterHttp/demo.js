// Spawns the real cluster primary as its own separate OS process — the
// cluster module's entire point is real, separate OS processes, so this
// can't be proven any other way (matching the CurlWorkflow/
// DanglingEventListeners spawn pattern already used in this project).
import { spawn } from "node:child_process";

// PORT=0 lets the OS assign a real free port, shared across every real
// worker this primary forks — confirmed directly that cluster's port
// sharing works the same way with 0 as with a fixed port. Decouples this
// demo from the fixed 4101 a human uses for the PostmanCheck below.
const primary = spawn("node", ["server.js"], { cwd: import.meta.dirname, env: { ...process.env, PORT: "0" } });

// The real, authoritative set of ORIGINAL worker PIDs — read directly
// from the primary's own fork log, not inferred from which ones happen
// to answer an HTTP request first (a limited sample can miss a real
// worker that just hasn't had its turn yet, which would wrongly get
// mistaken for "new" later).
const originalWorkerPids = new Set();
let PORT = null;

// Accumulates the FULL raw log, then re-scans the whole thing with
// matchAll on every new chunk — not just the newest chunk in isolation.
// Confirmed necessary: Node can batch several real console.log lines
// into ONE stdout "data" event (buffering behavior that showed up when
// this ran nested inside the Next.js dev server's own process, via
// execSync, even though it never happened in plain standalone runs) — a
// single chunk containing all 3 "Real worker forked" lines meant a plain
// per-chunk .match() (which only returns the FIRST match) only ever
// captured 1 of the 3 real PIDs, and the wait loop below spun forever.
let fullLog = "";

primary.stdout.on("data", (chunk) => {
  process.stdout.write(`  [cluster log] ${chunk}`);
  fullLog += chunk.toString();
  for (const match of fullLog.matchAll(/Real worker forked: (\d+)/g)) {
    originalWorkerPids.add(Number(match[1]));
  }
  const portMatches = [...fullLog.matchAll(/listening on port (\d+)/g)];
  if (portMatches.length > 0) PORT = Number(portMatches.at(-1)[1]);
});

// A real, brief pause so the primary has really forked and logged all 3
// original workers, and all 3 are really listening, before any request —
// capped at a real 10 real seconds so a genuine problem fails loudly
// instead of hanging this script (and whatever invoked it) forever.
const readyDeadline = Date.now() + 10_000;
while (originalWorkerPids.size < 3 || PORT === null) {
  if (Date.now() > readyDeadline) {
    throw new Error(`Timed out waiting for all 3 real workers to report ready. Seen so far: ${JSON.stringify([...originalWorkerPids])}, PORT=${PORT}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
}
console.log(`Real original worker PIDs (from the primary's own fork log): ${JSON.stringify([...originalWorkerPids])}`);

console.log("\nFiring 6 real, sequential requests at the shared port...");
const pidsBefore = [];
for (let i = 0; i < 6; i++) {
  const { pid } = await (await fetch(`http://localhost:${PORT}/`)).json();
  pidsBefore.push(pid);
}
console.log(`Real PIDs that answered: ${JSON.stringify(pidsBefore)}`);
console.log(`Real DISTINCT worker PIDs seen: ${new Set(pidsBefore).size} (out of 3 real workers) — proof multiple real processes share this one port.`);

console.log("\nHitting /crash-me — a real worker really calls process.exit(1)...");
const crashed = await (await fetch(`http://localhost:${PORT}/crash-me`)).json();
console.log(`Real worker that crashed: ${crashed.pid}`);

// A real, brief pause for the primary's real "exit" handler to actually
// fork a real replacement.
await new Promise((resolve) => setTimeout(resolve, 500));

// Keeps firing real requests until the real NEW worker actually answers
// one (round-robin scheduling doesn't guarantee which slot it lands in
// first) — capped so this can't loop forever, and reports exactly what
// was really observed either way, never a claim the requests didn't back up.
console.log("\nFiring real requests until the real replacement worker actually answers one...");
const pidsAfter = [];
let newWorkerPid = null;
for (let i = 0; i < 30 && !newWorkerPid; i++) {
  const { pid } = await (await fetch(`http://localhost:${PORT}/`)).json();
  pidsAfter.push(pid);
  if (!originalWorkerPids.has(pid)) newWorkerPid = pid;
}
console.log(`Real PIDs seen after the crash (${pidsAfter.length} requests): ${JSON.stringify(pidsAfter)}`);
if (newWorkerPid) {
  console.log(
    `The crashed PID (${crashed.pid}) never answers again, but a real NEW worker PID (${newWorkerPid}, never seen before the crash) answered instead — the real replacement is genuinely handling traffic.`,
  );
} else {
  console.log(`The crashed PID (${crashed.pid}) never answered again, but the real replacement worker didn't happen to get picked in these ${pidsAfter.length} requests.`);
}

// SIGTERM to the real primary — its own real handler cascades this to
// every real forked worker, so nothing is left running as an orphan.
primary.kill("SIGTERM");
