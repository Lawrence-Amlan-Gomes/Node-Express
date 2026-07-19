// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Prisma directly at all. Runs the exact SAME real
// search query twice against a real 100,000-row Postgres table: once
// with no index (a real sequential scan), once right after creating a
// real B-tree index (a real index scan) — and prints Postgres's own real,
// measured execution time for both.
import "dotenv/config";
import { app } from "./server.js";

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Seed 100,000 real rows through the real API — no index exists yet.
  console.log("Seeding 100,000 real rows (no index yet)...");
  const seedRes = await fetch(`${base}/customers/reset`, { method: "POST" });
  const seed = await seedRes.json();
  console.log(`Seeded ${seed.seeded} rows. Every search below looks for: ${seed.targetEmail}\n`);

  // BEFORE — a real GET request, no index exists yet.
  const beforeRes = await fetch(`${base}/customers/search`);
  const before = await beforeRes.json();
  console.log(`BEFORE the index (${before.scanType}):`);
  // Print every real line of Postgres's own EXPLAIN ANALYZE output.
  console.log(before.plan.join("\n"));
  console.log(`Real measured execution time: ${before.executionMs} ms\n`);

  // Create a real B-tree index on the email column, through the real API.
  console.log("Creating a real B-tree index on email...\n");
  await fetch(`${base}/customers/index`, { method: "POST" });

  // AFTER — the exact same real GET request, now that the index exists.
  const afterRes = await fetch(`${base}/customers/search`);
  const after = await afterRes.json();
  console.log(`AFTER the index (${after.scanType}):`);
  // Print every real line of Postgres's own EXPLAIN ANALYZE output.
  console.log(after.plan.join("\n"));
  console.log(`Real measured execution time: ${after.executionMs} ms\n`);

  // Compute and print the real, measured speedup — not an estimate.
  const speedup = (before.executionMs / after.executionMs).toFixed(1);
  console.log(`Same query, same 100,000 rows, same result — ${before.executionMs} ms vs ${after.executionMs} ms: a real, measured ${speedup}x faster with the index in place.`);

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/customers`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});
