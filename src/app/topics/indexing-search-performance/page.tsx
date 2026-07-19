import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import BTreeIndexQueryPlanRunner from "@/example-runners/IndexingSearchPerformance/BTreeIndexQueryPlanRunner";
import PostgresFullTextSearchRunner from "@/example-runners/IndexingSearchPerformance/PostgresFullTextSearchRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md.

function SeqScanVsIndexScanDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">
        The SAME real search, before and after a real B-tree index — measured directly, on 100,000 real rows
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">NO INDEX — Seq Scan</div>
          <div className="text-body text-xs leading-relaxed">
            Postgres checks rows one at a time, in order, until it finds a match — up to all 100,000 of them.
            Measured: 8.4 ms.
          </div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">WITH A B-TREE INDEX — Index Scan</div>
          <div className="text-body text-xs leading-relaxed">
            Postgres walks the real, sorted B-tree structure instead — a few comparisons jump almost straight to the
            one row. Measured: 0.12 ms.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-blue-500 bg-blue-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-blue-500 text-xs">
          Real, measured result: ~72x faster — the exact factor shifts slightly run to run (network, server load), but
          the SHAPE of the gap — checking almost everything vs. jumping almost straight there — does not.
        </span>
      </div>
    </div>
  );
}

function TsvectorGinDiagram() {
  const steps: { label: string; description: string }[] = [
    { label: "1. Raw text", description: "The real body column — plain English sentences, nothing special about them yet." },
    { label: "2. to_tsvector('english', body)", description: "Strips filler words (\"a\", \"the\", \"for\") and reduces real words to a root form — \"indexing\" and \"indexed\" both become the same lexeme, \"index\"." },
    { label: "3. A real GIN index", description: "Maps each real lexeme back to every row that contains it — like a book's index page, but built and maintained by Postgres itself." },
    { label: "4. A real search", description: "Matches against the index's lexemes directly, instead of re-deriving them from raw text on every single search." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">How Postgres full-text search actually works, step by step</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2">
            <div className="font-mono text-xs text-purple-500 font-semibold mb-0.5">{step.label}</div>
            <div className="text-body text-xs leading-relaxed">{step.description}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">NO search_vector column</div>
          <div className="text-body text-xs leading-relaxed">Steps 2-3 happen LIVE, for every one of 50,000 rows, on every single search. Measured: 1329 ms.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">A GENERATED search_vector + GIN index</div>
          <div className="text-body text-xs leading-relaxed">Step 2 happens ONCE, when a row is written. Step 4 just looks the result up. Measured: 0.35 ms.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "B-Tree Indexes & EXPLAIN ANALYZE",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "A Table With No Index Is a Phone Book With No Alphabetical Order",
              description: "To find one row, Postgres has to check every row, one at a time, until it finds a match — a real \"sequential scan.\"",
              example: "Looking for one email among 100,000 rows with no index means checking up to all 100,000 of them.",
            },
            {
              label: "A B-Tree Index Is a Real, Sorted Shortcut",
              description: "CREATE INDEX builds a separate, sorted tree structure pointing at each row's real location on disk — Postgres can jump almost straight there instead of checking every row.",
              example: "CREATE INDEX customer_email_idx ON \"Customer\" (email) — no USING clause needed, B-tree is Postgres's own real default index type.",
            },
            {
              label: "EXPLAIN ANALYZE Actually Runs the Query and Reports the Real Cost",
              description: "Not a guess, not an estimate — Postgres executes the real query for real and reports its own real, measured execution time, plus which plan it actually chose.",
              example: "\"Seq Scan\" vs \"Index Scan\" appears literally, by name, in the real plan text.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          An index doesn&apos;t change what a query returns — it changes how much real work Postgres has to do to find
          it. On a table with 100,000 rows, that&apos;s the difference between checking (up to) all of them and
          jumping almost straight to the one row you actually want.
        </Callout>
        <p>
          The demo below runs the exact same real search twice against a real 100,000-row Postgres table — once with
          no index (a real sequential scan), once right after creating a real B-tree index (a real index scan) — and
          prints Postgres&apos;s own real, measured execution time for both.
        </p>
      </>
    ),
    extra: <SeqScanVsIndexScanDiagram />,
    demo: <BTreeIndexQueryPlanRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/IndexingSearchPerformance/BTreeIndexQueryPlan/routes/customers.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/IndexingSearchPerformance/BTreeIndexQueryPlan/controllers/customers.controller.js", note: "The ONLY file that talks to Prisma — seeds 100,000 rows, runs EXPLAIN ANALYZE, and creates/drops the real index." },
      { path: "examples/IndexingSearchPerformance/BTreeIndexQueryPlan/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/IndexingSearchPerformance/BTreeIndexQueryPlan"
        runCommand="node server.js"
        runPort={4081}
        steps={[
          {
            method: "POST",
            path: "/customers/reset",
            note: "Seeds 100,000 real rows and drops any leftover index — always run this first.",
            expectStatus: 201,
            expectBody: '{"seeded":100000,"targetEmail":"user100000@example.com"}',
          },
          {
            method: "GET",
            path: "/customers/search",
            note: "Run this BEFORE creating the index — no index exists yet.",
            expectStatus: 200,
            expectBody: 'The real query plan — "Seq Scan" appears in the plan text, Execution Time typically 5-15 ms on this table size.',
          },
          {
            method: "POST",
            path: "/customers/index",
            note: "Creates the real B-tree index on email.",
            expectStatus: 201,
            expectBody: '{"created":true,"index":"customer_email_idx"}',
          },
          {
            method: "GET",
            path: "/customers/search",
            note: "Run this again AFTER creating the index — the exact same request, same URL.",
            expectStatus: 200,
            expectBody: 'The real query plan — "Index Scan using customer_email_idx" appears in the plan text, Execution Time typically well under 1 ms.',
          },
          {
            method: "DELETE",
            path: "/customers",
            note: "Cleans up — drops the real index and clears the real table.",
            expectStatus: 200,
            expectBody: '{"deletedCustomers":100000,"indexDropped":true}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Full-Text Search with tsvector & a GIN Index",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "A Plain Text Match Doesn't Understand Language",
              description: "It can't tell \"index,\" \"indexing,\" and \"indexed\" are related, and it can't rank one match as more relevant than another. Postgres's own full-text search engine can do both.",
            },
            {
              label: "to_tsvector Breaks Real Text Into Searchable Lexemes",
              description: "It strips common filler words and reduces real words to a root form (stemming) — a real, searchable value built from a plain text column.",
              example: "to_tsvector('english', 'indexing strategies') reduces to real lexemes like index and strategi.",
            },
            {
              label: "A GIN Index Is Built for Exactly This",
              description: "A B-tree can't efficiently index the many lexemes inside one tsvector value — GIN (Generalized Inverted iNdex) is Postgres's real index type for that, mapping each lexeme back to every row that contains it.",
            },
            {
              label: "ts_rank Adds Real Relevance Ranking",
              description: "Not just \"does it match\" but \"how well does it match\" — a real capability a plain match by itself doesn't give you.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          The real cost of full-text search without an index isn&apos;t just slow — it&apos;s to_tsvector() being
          recomputed from scratch, on every row, on every single search. A GENERATED column plus a GIN index computes
          it once, on write, and just looks it up from then on.
        </Callout>
        <p>
          The demo below runs the exact same real search phrase against a real 50,000-row Postgres table — once with
          no search index (to_tsvector computed live, on every row), once right after adding a real generated
          tsvector column and a real GIN index — and prints Postgres&apos;s own real, measured execution time and
          real ranked results for both.
        </p>
      </>
    ),
    extra: <TsvectorGinDiagram />,
    demo: <PostgresFullTextSearchRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/IndexingSearchPerformance/PostgresFullTextSearch/routes/articles.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/IndexingSearchPerformance/PostgresFullTextSearch/controllers/articles.controller.js", note: "The ONLY file that talks to Prisma — seeds 50,000 rows, runs the real searches, and adds/drops the real generated column and GIN index." },
      { path: "examples/IndexingSearchPerformance/PostgresFullTextSearch/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/IndexingSearchPerformance/PostgresFullTextSearch"
        runCommand="node server.js"
        runPort={4082}
        steps={[
          {
            method: "POST",
            path: "/articles/reset",
            note: "Seeds 50,000 real rows (100 of them containing the real search phrase) and drops any leftover search column/index — always run this first.",
            expectStatus: 201,
            expectBody: '{"seeded":50000,"searchTerm":"postgres indexing","expectedMatches":100}',
          },
          {
            method: "GET",
            path: "/articles/search",
            note: "Run this BEFORE creating the search index — to_tsvector(body) gets computed live, on every row.",
            expectStatus: 200,
            expectBody: 'The real query plan — a Seq Scan computing to_tsvector live, 100 real matches, Execution Time typically 1000+ ms on this table size.',
          },
          {
            method: "POST",
            path: "/articles/index",
            note: "Adds a real generated search_vector column and a real GIN index on it.",
            expectStatus: 201,
            expectBody: '{"created":true,"column":"search_vector","index":"article_search_idx"}',
          },
          {
            method: "GET",
            path: "/articles/search-indexed",
            note: "Run this AFTER creating the search index — a different route, since ranking (ts_rank) only makes sense against the already-computed column.",
            expectStatus: 200,
            expectBody: 'The real query plan — a Bitmap Index Scan using article_search_idx, the same 100 real matches, Execution Time typically well under 1 ms, plus real ts_rank scores in the results.',
          },
          {
            method: "DELETE",
            path: "/articles",
            note: "Cleans up — drops the real index and generated column, and clears the real table.",
            expectStatus: 200,
            expectBody: '{"deletedArticles":50000,"indexDropped":true,"columnDropped":true}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A table with no index forces Postgres to check every row, one at a time — a real sequential
        scan. A B-tree index (Postgres&apos;s own real default index type) builds a sorted shortcut, so most lookups
        jump almost straight to the right row instead. Full-text search is a different problem: it&apos;s not about
        skipping rows, it&apos;s about understanding language — to_tsvector breaks real text into searchable root
        forms (lexemes), and a GIN index maps each lexeme back to every row that has it, so a search doesn&apos;t
        have to recompute that mapping from scratch every single time. Both examples on this page measured a real,
        dramatic gap — not because the numbers were picked to look good, but because that&apos;s genuinely what an
        index does at real scale.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a slow query", "is it a WHERE on an exact value or range? → a B-tree index (Postgres's real default)", "is it searching inside real text for words/phrases? → tsvector + a GIN index, with ts_rank for relevance", "is it geospatial (near me) or JSON containment? → GiST/SP-GiST or a GIN index on jsonb — awareness-level here, not built"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "An index trades write cost for read cost: every INSERT/UPDATE now also has to update the index, but reads that use it get dramatically cheaper. Not free — a deliberate, real tradeoff.",
            "B-tree is the real, unwritten default for a reason: it handles exact matches, ranges, and sorting well, and covers the large majority of real indexing needs. Reach for GIN/GiST/BRIN only when the data shape genuinely calls for it (full text, geospatial, huge append-only tables).",
            "Postgres full-text search (tsvector/tsquery/ts_rank, all built in, zero extra infrastructure) is genuinely enough for a lot of real products — a searchable blog, a support ticket system, an internal admin tool.",
            "Elasticsearch earns its own infrastructure when a product needs things Postgres FTS doesn't do well: fuzzy/typo-tolerant matching at scale, faceted search and aggregations across huge datasets, or search relevance tuning as its own ongoing discipline. Knowing WHEN to reach for it matters more than the tool itself — most real APIs never need it.",
            "EXPLAIN ANALYZE is the real tool for 'why is this query slow' in any interview or job — it shows the REAL plan Postgres chose and the REAL time it took, not a guess.",
          ]}
        />
      </>
    ),
  },
];

export default function IndexingSearchPerformancePage() {
  return (
    <StudyPage
      title="Indexing & Search Performance"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro="A real, measured look at what an index actually buys you: a B-tree index that turns a 100,000-row sequential scan into a near-instant lookup, and a GIN index over Postgres's own full-text search that turns a 50,000-row live-recompute into an indexed, ranked search — both proven against a real remote Postgres database, with EXPLAIN ANALYZE reporting the real, measured cost."
      sections={sections}
    />
  );
}
