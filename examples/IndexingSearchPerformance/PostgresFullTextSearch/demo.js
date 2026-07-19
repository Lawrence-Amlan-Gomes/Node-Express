// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT talk to Prisma directly at all. Runs the exact SAME real
// full-text search phrase against a real 50,000-row Postgres table:
// once with no search index (to_tsvector computed live, every row),
// once right after adding a real generated tsvector column and a real
// GIN index — and prints Postgres's own real, measured execution time
// and real ranked results for both.
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

  // Seed 50,000 real rows through the real API — no search column/index yet.
  console.log("Seeding 50,000 real rows (no search index yet)...");
  const seedRes = await fetch(`${base}/articles/reset`, { method: "POST" });
  const seed = await seedRes.json();
  console.log(`Seeded ${seed.seeded} rows. Searching for: "${seed.searchTerm}" (expecting ${seed.expectedMatches} real matches)\n`);

  // BEFORE — a real GET request, to_tsvector(body) computed live for every row.
  const beforeRes = await fetch(`${base}/articles/search`);
  const before = await beforeRes.json();
  console.log(`BEFORE the search index (to_tsvector computed live on every row):`);
  console.log(before.plan.join("\n"));
  console.log(`Real matches found: ${before.matchCount} | Real measured execution time: ${before.executionMs} ms`);
  console.log("Real sample results:", before.results);

  // Add a real generated tsvector column and a real GIN index, through the real API.
  console.log("\nAdding a real generated search_vector column + a real GIN index...\n");
  await fetch(`${base}/articles/index`, { method: "POST" });

  // AFTER — the same real search phrase, now matched against the real indexed column, with real ranking.
  const afterRes = await fetch(`${base}/articles/search-indexed`);
  const after = await afterRes.json();
  console.log(`AFTER the search index (matches search_vector, real GIN index used: ${after.indexUsed}):`);
  console.log(after.plan.join("\n"));
  console.log(`Real matches found: ${after.matchCount} | Real measured execution time: ${after.executionMs} ms`);
  console.log("Real top-ranked results (ts_rank, highest relevance first):", after.results);

  // Compute and print the real, measured speedup — not an estimate.
  const speedup = (before.executionMs / after.executionMs).toFixed(1);
  console.log(`\nSame phrase, same 50,000 rows, same ${before.matchCount} real matches — ${before.executionMs} ms vs ${after.executionMs} ms: a real, measured ${speedup}x faster, PLUS real relevance ranking the unindexed version never had.`);

  // Clean up after this run — a real shared database, not a throwaway
  // local one, so nothing from this demo should be left behind.
  await fetch(`${base}/articles`, { method: "DELETE" });

  // Required, not just tidy — a listening server keeps this script alive forever.
  server.close();
}

main().catch((err) => {
  // Print the real error message if anything above actually failed.
  console.error("FAILED:", err.message);
  // Mark the process as failed, so a CI run or Postman check can notice.
  process.exitCode = 1;
});
