// Real, measured proof — not an assumption — that OFFSET-based
// pagination gets slower as the offset grows, while cursor-based
// pagination stays fast, on a real 100,000-row Postgres table.
require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ROW_COUNT = 100000;
const PAGE_SIZE = 20;
const DEEP_OFFSET = 90000;

async function main() {
  // Seed 100,000 rows in ONE fast bulk statement (generate_series), not
  // 100,000 individual inserts — this only needs to run once per demo
  // execution, and a real remote database shouldn't be hammered with
  // 100k round trips just to set up test data.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BigList" RESTART IDENTITY`);
  await prisma.$executeRawUnsafe(
    `INSERT INTO "BigList" (value) SELECT 'row ' || i FROM generate_series(1, ${ROW_COUNT}) AS i`,
  );
  console.log(`Seeded ${ROW_COUNT} real rows.\n`);

  // OFFSET pagination: "give me page 4501" by literally counting past
  // the first 90,000 rows and throwing them away, every single time.
  const offsetPlan = await prisma.$queryRawUnsafe(
    `EXPLAIN ANALYZE SELECT * FROM "BigList" ORDER BY id OFFSET ${DEEP_OFFSET} LIMIT ${PAGE_SIZE}`,
  );
  const offsetPlanText = offsetPlan.map((row) => row["QUERY PLAN"]).join("\n");
  console.log(`OFFSET ${DEEP_OFFSET} LIMIT ${PAGE_SIZE} — real Postgres query plan:`);
  console.log(offsetPlanText);

  // Cursor pagination: "give me the next 20 rows after the row with id
  // 90000" — an indexed lookup (id is the primary key), not a count.
  const cursorPlan = await prisma.$queryRawUnsafe(
    `EXPLAIN ANALYZE SELECT * FROM "BigList" WHERE id > ${DEEP_OFFSET} ORDER BY id LIMIT ${PAGE_SIZE}`,
  );
  const cursorPlanText = cursorPlan.map((row) => row["QUERY PLAN"]).join("\n");
  console.log(`\nWHERE id > ${DEEP_OFFSET} LIMIT ${PAGE_SIZE} (cursor) — real Postgres query plan:`);
  console.log(cursorPlanText);

  const offsetTime = offsetPlanText.match(/Execution Time: ([\d.]+) ms/)?.[1];
  const cursorTime = cursorPlanText.match(/Execution Time: ([\d.]+) ms/)?.[1];
  console.log(`\nReal execution time, straight from Postgres itself (excludes network round-trip): OFFSET = ${offsetTime} ms, cursor = ${cursorTime} ms.`);
  console.log("Both fetch the SAME 20 rows — the cost difference is entirely in HOW each query gets there.");

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "BigList" RESTART IDENTITY`);
}

main()
  .catch((err) => {
    console.error("FAILED:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
