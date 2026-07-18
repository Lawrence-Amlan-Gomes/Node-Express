// The real Prisma calls live here — the routes file never talks to
// Prisma directly, only this controller does.
const { PrismaClient } = require("@prisma/client");

// A real Prisma client for this section's own BigList table.
const prisma = new PrismaClient();

// How many real rows to seed — big enough that a naive OFFSET query
// genuinely has to do real, measurable extra work.
const ROW_COUNT = 100000;
// The default real page size used when a request doesn't specify ?limit=.
const DEFAULT_LIMIT = 20;

// Handles POST /todos/seed — fills the real table with ROW_COUNT real
// rows in ONE fast bulk statement (generate_series), not ROW_COUNT
// individual inserts. This only needs to run once per demo, and a real
// remote database shouldn't be hammered with 100k round trips just to
// set up test data.
async function seedTodos(req, res) {
  // Clear out anything left over from a previous run first.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BigList" RESTART IDENTITY`);
  // Insert ROW_COUNT real rows in one real, single SQL statement.
  await prisma.$executeRawUnsafe(
    `INSERT INTO "BigList" (value) SELECT 'row ' || i FROM generate_series(1, ${ROW_COUNT}) AS i`,
  );
  // Report the real number of rows that now genuinely exist.
  res.status(201).json({ seeded: ROW_COUNT });
}

// Handles GET /todos?offset=N&limit=N — "skip the first N rows, give me
// the next `limit`." Real Postgres has to walk through and throw away
// every skipped row, every single time this runs.
async function listTodos(req, res) {
  // A real page size, falling back to the default if none was given.
  const limit = Number(req.query.limit ?? DEFAULT_LIMIT);

  if (req.query.offset !== undefined) {
    // The real number of rows to skip before Postgres starts collecting the page.
    const offset = Number(req.query.offset);
    // EXPLAIN ANALYZE actually RUNS the query and reports its real, measured cost.
    const plan = await prisma.$queryRawUnsafe(
      `EXPLAIN ANALYZE SELECT * FROM "BigList" ORDER BY id OFFSET ${offset} LIMIT ${limit}`,
    );
    // Postgres returns the plan as one text row per line — join them into one real string.
    const queryPlan = plan.map((row) => row["QUERY PLAN"]).join("\n");
    // Pull the real millisecond figure straight out of Postgres's own report.
    const executionTimeMs = Number(queryPlan.match(/Execution Time: ([\d.]+) ms/)?.[1]);
    // Send back the real mode, the real inputs, and the real measured cost.
    return res.status(200).json({ mode: "offset", offset, limit, executionTimeMs, queryPlan });
  }

  if (req.query.cursor !== undefined) {
    // The real last-seen id — "give me rows after this one," not a row count to skip.
    const cursor = Number(req.query.cursor);
    // The indexed WHERE id > cursor jumps straight to the right spot using the primary key.
    const plan = await prisma.$queryRawUnsafe(
      `EXPLAIN ANALYZE SELECT * FROM "BigList" WHERE id > ${cursor} ORDER BY id LIMIT ${limit}`,
    );
    // Join the real plan lines into one real string, same as the offset branch above.
    const queryPlan = plan.map((row) => row["QUERY PLAN"]).join("\n");
    // Pull the real millisecond figure straight out of Postgres's own report.
    const executionTimeMs = Number(queryPlan.match(/Execution Time: ([\d.]+) ms/)?.[1]);
    // Send back the real mode, the real inputs, and the real measured cost.
    return res.status(200).json({ mode: "cursor", cursor, limit, executionTimeMs, queryPlan });
  }

  // Neither query param was given — this is a genuinely invalid request.
  res.status(400).json({ error: "must provide either ?offset= or ?cursor=" });
}

// Handles DELETE /todos — empties the real table with no reseed. Used
// by demo.js to leave this real shared database exactly as it was
// found (empty) when the run finishes.
async function resetTodos(req, res) {
  // Actually clear the real table for real.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BigList" RESTART IDENTITY`);
  // Confirm the real, now-empty state back to the caller.
  res.status(200).json({ cleared: true });
}

module.exports = { seedTodos, listTodos, resetTodos };
