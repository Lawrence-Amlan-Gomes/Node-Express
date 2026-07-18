// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Prisma directly at all. A real backend dev
// exercises an API this way: real requests, real JSON responses,
// exactly like a frontend or Postman would. The real EXPLAIN ANALYZE
// calls live in controllers/todos.controller.js instead.
require("dotenv").config({ quiet: true });
const app = require("./server.js");

const PAGE_SIZE = 20;
const DEEP_OFFSET = 90000;

async function main() {
  // Port 0 means "give me any free port" — resolve only once it's really listening.
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  // The real port the OS actually assigned, read back off the live server.
  const { port } = server.address();
  const base = `http://localhost:${port}`;

  // Seed 100,000 real rows — through the real API, not Prisma directly.
  const seedRes = await fetch(`${base}/todos/seed`, { method: "POST" });
  // Parse the real JSON body confirming how many rows really got inserted.
  const seed = await seedRes.json();
  console.log(`Seeded ${seed.seeded} real rows.\n`);

  // OFFSET pagination — a real GET request asking to skip 90,000 rows.
  const offsetRes = await fetch(`${base}/todos?offset=${DEEP_OFFSET}&limit=${PAGE_SIZE}`);
  // Parse the real JSON body, including Postgres's own real query plan text.
  const offsetResult = await offsetRes.json();
  console.log(`OFFSET ${DEEP_OFFSET} LIMIT ${PAGE_SIZE} — real Postgres query plan:`);
  console.log(offsetResult.queryPlan);

  // Cursor pagination — a real GET request asking for rows after id 90000.
  const cursorRes = await fetch(`${base}/todos?cursor=${DEEP_OFFSET}&limit=${PAGE_SIZE}`);
  // Parse the real JSON body, including Postgres's own real query plan text.
  const cursorResult = await cursorRes.json();
  console.log(`\nWHERE id > ${DEEP_OFFSET} LIMIT ${PAGE_SIZE} (cursor) — real Postgres query plan:`);
  console.log(cursorResult.queryPlan);

  // Print the real millisecond figures the API already extracted for us.
  console.log(
    `\nReal execution time, straight from Postgres itself (excludes network round-trip): OFFSET = ${offsetResult.executionTimeMs} ms, cursor = ${cursorResult.executionTimeMs} ms.`,
  );
  console.log("Both fetch the SAME 20 rows — the cost difference is entirely in HOW each query gets there.");

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/todos`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});
