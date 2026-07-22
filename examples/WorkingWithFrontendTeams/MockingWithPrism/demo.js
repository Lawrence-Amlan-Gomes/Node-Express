// This mini-project has NO real server.js/routes/controllers on purpose —
// unlike every other topic in this project, the whole point here is that
// the real backend genuinely doesn't exist yet. Prism (a real, standard
// open-source tool) reads openapi.yaml and serves REAL mock responses
// generated straight from it — this script only ever calls that real
// mock server over real HTTP, exactly like a real frontend dev would.
import { spawn } from "node:child_process";
import { join } from "node:path";

// Spawns the REAL prism CLI (already installed as a real devDependency)
// as its own separate OS process. -p 0 asks the OS for any free port —
// decoupled from the fixed port a human uses in the Postman guide below,
// avoiding the same same-fixed-port collision risk documented elsewhere
// in this project whenever a demo starts its own throwaway server.
// -m false disables Prism's own default "multiprocess" mode (it forks a
// second internal process via Node's cluster module for faster logging)
// — confirmed necessary here: with it left on, Prism crashes with
// "Cannot read properties of undefined (reading 'isPrimary')" specifically
// when spawned as a NESTED child of another Node process (this project's
// own real `next build`), because cluster.isPrimary can't resolve
// correctly in that nested context. Runs fine standalone either way.
const prism = spawn(join(import.meta.dirname, "node_modules/.bin/prism"), ["mock", "openapi.yaml", "-p", "0", "-m", "false"], {
  cwd: import.meta.dirname,
});

// Prism logs its own real bound port once it's actually ready — parsed
// out here, with a real hard timeout so a genuine future problem fails
// loudly instead of hanging this whole demo forever. 30s (not the usual
// 10s) on purpose: this project's own production build runs several of
// these demos concurrently across multiple real worker processes, and a
// real, spawned child process genuinely starts slower under that real
// CPU contention than it does standalone.
let capturedStderr = "";
prism.stderr.on("data", (chunk) => {
  capturedStderr += chunk.toString();
});
const port = await new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error(`Prism never reported a real listening port within 30s. Real captured stderr: ${capturedStderr}`)),
    30_000,
  );
  prism.stdout.on("data", (chunk) => {
    const match = chunk.toString().match(/is listening on http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) {
      clearTimeout(timer);
      resolve(Number(match[1]));
    }
  });
});
const base = `http://localhost:${port}`;

// A real request against a backend that doesn't exist as real code
// anywhere — yet a real, schema-shaped response still comes back.
const listRes = await fetch(`${base}/reviews`);
const list = await listRes.json();
console.log(`GET /reviews (real mock server, no real backend behind it) => ${listRes.status}`);
console.log(JSON.stringify(list, null, 2));

// A real POST — Prism validates the real request body against the real
// spec's NewReview schema, then returns the real example response.
const createRes = await fetch(`${base}/reviews`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: 42, rating: 4, comment: "Solid, real value for the price." }),
});
const created = await createRes.json();
console.log(`\nPOST /reviews => ${createRes.status}`);
console.log(JSON.stringify(created, null, 2));

// A real request that violates the spec — missing every required field.
const invalidRes = await fetch(`${base}/reviews`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
const invalidBody = await invalidRes.json();
console.log(`\nPOST /reviews (empty body, violates the real spec) => ${invalidRes.status}`);
console.log(JSON.stringify(invalidBody, null, 2));

// Stop the real spawned process — required, not just tidy, or this
// script (and the runner that calls it) would hang forever.
prism.kill();
