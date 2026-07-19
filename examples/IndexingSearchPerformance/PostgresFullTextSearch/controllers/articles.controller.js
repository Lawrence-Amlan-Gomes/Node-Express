// The real Prisma calls (and the real raw-SQL search-column/index
// management) live here — the routes file never talks to Prisma
// directly, only this controller does.
import { PrismaClient } from "@prisma/client";

// A real Prisma client, talking to a real remote Postgres database.
const prisma = new PrismaClient();

// How many real rows to seed — big enough that computing to_tsvector()
// live, for every row, on every search, is genuinely expensive.
const ROW_COUNT = 50000;
// Every 500th row's body gets this real phrase embedded in it — so a
// real search for it returns a real, known, meaningfully-sized result
// set (ROW_COUNT / 500 matches) instead of either "everything" or "one."
const SEARCH_TERM = "postgres indexing";

// Handles POST /articles/reset — always starts from the exact same real,
// known state: no search column/index yet, and ROW_COUNT freshly seeded rows.
async function resetArticles(req, res) {
  // Drop any search index left over from a previous run.
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS article_search_idx`);
  // Drop any generated search_vector column left over from a previous run too.
  await prisma.$executeRawUnsafe(`ALTER TABLE "Article" DROP COLUMN IF EXISTS search_vector`);
  // Clear out anything left over from a previous run.
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Article" RESTART IDENTITY`);
  // Insert ROW_COUNT real rows in ONE fast bulk statement. Every 500th
  // row's body contains the real search phrase; every other row is
  // generic filler text that should never match a real search for it.
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Article" (title, body)
    SELECT
      'Article ' || i,
      CASE WHEN i % 500 = 0
        THEN 'A deep dive into postgres indexing strategies for read-heavy systems, covering b-tree usage and query planning basics for backend engineers.'
        ELSE 'A general engineering note about caching layers, request pipelines, and everyday backend maintenance tasks that keep a service healthy.'
      END
    FROM generate_series(1, ${ROW_COUNT}) AS i
  `);
  // Report the real row count, the real search phrase, and the real
  // expected number of matches (every 500th row, by construction).
  res.status(201).json({ seeded: ROW_COUNT, searchTerm: SEARCH_TERM, expectedMatches: ROW_COUNT / 500 });
}

// Pulls the real total matched-row count straight out of the top node
// of a real EXPLAIN ANALYZE plan's own text — the same real number
// Postgres itself reports it actually returned.
function parsePlan(planText) {
  // Pull the real millisecond figure straight out of Postgres's own report.
  const executionMs = Number(planText.match(/Execution Time: ([\d.]+) ms/)?.[1]);
  // Pull the real row count the top plan node actually returned — the real, final match count.
  const matchCount = Number(planText.match(/actual time=[\d.]+\.\.[\d.]+ rows=(\d+)/)?.[1]);
  // Hand both real numbers back to whichever route called this.
  return { executionMs, matchCount };
}

// Handles GET /articles/search — the BEFORE version. No generated
// column, no index — to_tsvector('english', body) has to be computed
// live, for every one of ROW_COUNT rows, on every single search.
async function searchArticles(req, res) {
  // EXPLAIN ANALYZE actually RUNS the real query and reports Postgres's
  // own real, measured cost. $1 is a real, safely-bound parameter.
  const rows = await prisma.$queryRawUnsafe(
    `EXPLAIN ANALYZE SELECT id, title FROM "Article" WHERE to_tsvector('english', body) @@ plainto_tsquery('english', $1)`,
    SEARCH_TERM,
  );
  // Postgres returns the plan as one text row per line — join into one real array.
  const plan = rows.map((row) => row["QUERY PLAN"]);
  // Parse the real execution time and real match count out of that plan text.
  const { executionMs, matchCount } = parsePlan(plan.join("\n"));
  // A second, real (non-EXPLAIN) query — a small real sample of the
  // actual matching titles, so the demo can show real results, not just a plan.
  const results = await prisma.$queryRawUnsafe(
    `SELECT id, title FROM "Article" WHERE to_tsvector('english', body) @@ plainto_tsquery('english', $1) LIMIT 3`,
    SEARCH_TERM,
  );
  // Send back the real measured time, the real match count, the real plan, and real sample results.
  res.status(200).json({ searchTerm: SEARCH_TERM, executionMs, matchCount, indexUsed: false, plan, results });
}

// Handles POST /articles/index — adds a real GENERATED column that
// Postgres keeps in sync automatically (STORED means it's computed once
// on write, not recomputed on every read), then a real GIN index on it —
// the real index type built for searching inside tsvector values.
async function createSearchIndex(req, res) {
  // The real generated column — Postgres computes and stores this itself.
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Article" ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED`,
  );
  // The real GIN index — B-tree can't efficiently index a tsvector's
  // many lexemes; GIN is the real index type built for exactly this.
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS article_search_idx ON "Article" USING GIN (search_vector)`);
  // Refresh Postgres's real internal statistics immediately, same reason as the B-tree section.
  await prisma.$executeRawUnsafe(`ANALYZE "Article"`);
  res.status(201).json({ created: true, column: "search_vector", index: "article_search_idx" });
}

// Handles GET /articles/search-indexed — the AFTER version. Matches
// against the real, already-computed search_vector column (via the real
// GIN index), and adds real relevance ranking with ts_rank — a real
// capability a plain to_tsvector() match doesn't give you at all.
async function searchArticlesIndexed(req, res) {
  // EXPLAIN ANALYZE actually RUNS the real query and reports Postgres's
  // own real, measured cost. $1 is a real, safely-bound parameter.
  const rows = await prisma.$queryRawUnsafe(
    `EXPLAIN ANALYZE SELECT id, title, ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank FROM "Article" WHERE search_vector @@ plainto_tsquery('english', $1) ORDER BY rank DESC`,
    SEARCH_TERM,
  );
  // Postgres returns the plan as one text row per line — join into one real array.
  const plan = rows.map((row) => row["QUERY PLAN"]);
  // Also joined into one real string, so the two checks below can search across every line at once.
  const planText = plan.join("\n");
  // Parse the real execution time and real match count out of that plan text.
  const { executionMs, matchCount } = parsePlan(planText);
  // A real GIN index scan names the real index it used, right in the plan text.
  const indexUsed = planText.includes("article_search_idx");
  // A second, real (non-EXPLAIN) query — the real top-ranked titles, proving
  // ts_rank is a genuine capability, not just something the plan mentions.
  const results = await prisma.$queryRawUnsafe(
    `SELECT id, title, ts_rank(search_vector, plainto_tsquery('english', $1)) AS rank FROM "Article" WHERE search_vector @@ plainto_tsquery('english', $1) ORDER BY rank DESC LIMIT 3`,
    SEARCH_TERM,
  );
  res.status(200).json({ searchTerm: SEARCH_TERM, executionMs, matchCount, indexUsed, plan, results });
}

// Handles DELETE /articles — drops the real index and the real generated
// column, then empties the real table. Used by demo.js to leave this
// real shared database exactly as it was found when it's done.
async function deleteAllArticles(req, res) {
  // Drop the real index first, so nothing is left behind for the next run.
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS article_search_idx`);
  // Drop the real generated column too — back to the exact original table shape.
  await prisma.$executeRawUnsafe(`ALTER TABLE "Article" DROP COLUMN IF EXISTS search_vector`);
  // Actually clear the real table for real.
  const result = await prisma.article.deleteMany();
  // Confirm the real, now-empty, no-index, no-extra-column state back to the caller.
  res.status(200).json({ deletedArticles: result.count, indexDropped: true, columnDropped: true });
}

export { resetArticles, searchArticles, createSearchIndex, searchArticlesIndexed, deleteAllArticles };
