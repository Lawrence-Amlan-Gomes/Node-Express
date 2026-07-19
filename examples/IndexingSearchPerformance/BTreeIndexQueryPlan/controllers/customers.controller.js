// The real Prisma calls (and the real raw-SQL index management) live
// here — the routes file never talks to Prisma directly, only this
// controller does.
import { PrismaClient } from "@prisma/client";

// A real Prisma client, talking to a real remote Postgres database.
const prisma = new PrismaClient();

// How many real rows to seed — big enough that a real sequential scan
// genuinely has measurable work to do, the same reasoning the pagination
// topic's own BigList table used.
const ROW_COUNT = 100000;
// The one real email every search in this section looks for — deliberately
// the LAST row inserted, so a real sequential scan has to check almost
// every other row before it can even rule this one in or out. This makes
// the seq-scan-vs-index-scan gap as honest and visible as possible.
const TARGET_EMAIL = `user${ROW_COUNT}@example.com`;

// Handles POST /customers/reset — always starts from the exact same real,
// known state: no index yet, and ROW_COUNT freshly seeded rows.
async function resetCustomers(req, res) {
  // Drop any index left over from a previous run, so "before" is always
  // genuinely "no index," never accidentally reusing a leftover one.
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS customer_email_idx`);
  // Clear out anything left over from a previous run.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Customer" RESTART IDENTITY`);
  // Insert ROW_COUNT real rows in ONE fast bulk statement — not
  // ROW_COUNT individual round trips to a real remote database.
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Customer" (email, name) SELECT 'user' || i || '@example.com', 'Customer ' || i FROM generate_series(1, ${ROW_COUNT}) AS i`,
  );
  // Report the real row count and the real email this section will search for.
  res.status(201).json({ seeded: ROW_COUNT, targetEmail: TARGET_EMAIL });
}

// Handles GET /customers/search — runs the SAME real query every time;
// only the table's real index state (set by the two routes below) changes
// what Postgres's own planner decides to do with it.
async function searchCustomer(req, res) {
  // EXPLAIN ANALYZE actually RUNS the real query and reports Postgres's
  // own real, measured cost — not a Node-side stopwatch guessing at it.
  // $1 is a real, safely-bound parameter — never string-interpolated.
  const rows = await prisma.$queryRawUnsafe(
    `EXPLAIN ANALYZE SELECT id, email, name FROM "Customer" WHERE email = $1`,
    TARGET_EMAIL,
  );
  // Postgres returns the plan as one text row per line — join into one real array.
  const plan = rows.map((row) => row["QUERY PLAN"]);
  // Also joined into one real string, so the two checks below can search across every line at once.
  const planText = plan.join("\n");
  // A real B-tree index scan shows up as "Index Scan" in the plan text —
  // a real sequential scan shows "Seq Scan" instead.
  const scanType = planText.includes("Index Scan") ? "Index Scan" : "Seq Scan";
  // Pull the real millisecond figure straight out of Postgres's own report.
  const executionMs = Number(planText.match(/Execution Time: ([\d.]+) ms/)?.[1]);
  // Send back the real scan type Postgres actually chose, its real
  // measured time, and the real full plan so it can be read line by line.
  res.status(200).json({ email: TARGET_EMAIL, scanType, executionMs, plan });
}

// Handles POST /customers/index — creates a real B-tree index on email.
// A plain CREATE INDEX (no USING clause) IS a B-tree index in Postgres —
// B-tree is the real, unwritten default index type.
async function createIndex(req, res) {
  // The real DDL statement that creates the real index.
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS customer_email_idx ON "Customer" (email)`);
  // ANALYZE refreshes Postgres's real internal statistics immediately —
  // without this, the planner can keep using stale stats and stick with
  // its old plan for a while, which would make this demo flaky.
  await prisma.$executeRawUnsafe(`ANALYZE "Customer"`);
  res.status(201).json({ created: true, index: "customer_email_idx" });
}

// Handles DELETE /customers — drops the real index and empties the real
// table, with no reseed. Used by demo.js to leave this real shared
// database exactly as it was found (empty, no extra index) when it's done.
async function deleteAllCustomers(req, res) {
  // Drop the real index first, so nothing is left behind for the next run.
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS customer_email_idx`);
  // Actually clear the real table for real.
  const result = await prisma.customer.deleteMany();
  // Confirm the real, now-empty, no-index state back to the caller.
  res.status(200).json({ deletedCustomers: result.count, indexDropped: true });
}

export { resetCustomers, searchCustomer, createIndex, deleteAllCustomers };
