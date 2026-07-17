import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import PostgresTransactionsRunner from "@/example-runners/TransactionsPerformance/PostgresTransactionsRunner";
import PostgresNPlusOneRunner from "@/example-runners/TransactionsPerformance/PostgresNPlusOneRunner";
import MongoTransactionsRunner from "@/example-runners/TransactionsPerformance/MongoTransactionsRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function RollbackDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "Step 1: take 500 from Alice", caption: "This write really happens for real, inside the transaction." },
    { label: "Step 2: balance check fails", caption: "A real error is thrown on purpose, deliberately AFTER step 1 already ran." },
    { label: "Result: Alice's balance goes back", caption: "The database undid a write that had already happened, because it was never allowed to finish alone." },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A transaction that fails partway through — checked directly</div>
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={step.label} className="rounded-card border border-border bg-surface-raised px-3 py-2 flex items-start gap-2.5">
            <span className="font-mono text-xs font-bold text-cyan-500 shrink-0 mt-0.5">{i + 1}.</span>
            <div>
              <div className="font-mono text-sm font-semibold text-cyan-500">{step.label}</div>
              <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">This is the real point of a transaction — not stopping the first write from happening, but making sure it never sticks around without every other step in the same group.</span>
      </div>
    </div>
  );
}

function NPlusOneDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">3 posts, fetched with their authors — two real, measured query counts</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">NAIVE: 4 real queries</div>
          <div className="text-body text-xs leading-relaxed">1 query for the posts, PLUS 1 more query per post, in a loop — grows by 1 for every extra post.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">include: {"{ author: true }"}: 2 real queries</div>
          <div className="text-body text-xs leading-relaxed">1 query for the posts, 1 batched query that grabs every needed author at once. Stays at 2, no matter how many posts.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Verified directly with Prisma&apos;s own query log — the fix is NOT one single SQL JOIN, it&apos;s two grouped queries instead.</span>
      </div>
    </div>
  );
}

function MongoTransactionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The same rollback guarantee, on a different real database</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">Before MongoDB 4.0</div>
          <div className="text-body text-xs leading-relaxed">No real transactions across MULTIPLE documents. A write to just one document was always safe on its own.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">MongoDB 4.0 and later</div>
          <div className="text-body text-xs leading-relaxed">Real, multi-document ACID transactions — session.withTransaction() gives the exact same all-or-nothing guarantee as Postgres.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">&quot;MongoDB can&apos;t do transactions&quot; is outdated folklore — checked directly against this project&apos;s own real Atlas cluster.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Real Transactions & Rollback in PostgreSQL",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "A Transaction Is an All-or-Nothing Unit",
              description: "It groups several real writes into ONE unit. If anything inside throws an error, EVERY write in that unit gets undone — even writes that had already worked, just moments before.",
              example: "prisma.$transaction(async (tx) => { ...every write here commits together, or none do... })",
            },
            {
              label: "The Transaction Lives in a Controller, Behind a Real API",
              description: "Same layering as every other Express topic here: server.js wires things together, routes/accounts.routes.js declares the endpoints, and controllers/accounts.controller.js is the ONLY file that actually calls prisma.$transaction.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          A transaction&apos;s real promise is called atomicity — every write inside it saves together, or none of
          them do, even if an earlier step inside the same transaction already ran for real.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — POST /accounts/transfer — proving both
          real outcomes on a real remote Postgres server. First: a real transfer of 50 from Alice to Bob works, both
          balances update together. Second: a transfer of 500 fails a balance check PARTWAY THROUGH — right after
          Alice&apos;s money was already taken out. Prisma undoes the whole thing.
        </p>
      </>
    ),
    extra: <RollbackDiagram />,
    demo: <PostgresTransactionsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/PostgresTransactions/routes/accounts.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/TransactionsPerformance/PostgresTransactions/controllers/accounts.controller.js", note: "The ONLY file that talks to Prisma — real $transaction usage, a successful transfer, then a forced failure that really rolls back." },
      { path: "examples/TransactionsPerformance/PostgresTransactions/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/TransactionsPerformance/PostgresTransactions"
        runCommand="node server.js"
        runPort={4045}
        steps={[
          { method: "POST", path: "/accounts/reset", expectStatus: 201, expectBody: "Two fresh real accounts — Alice with balance 100, Bob with balance 0." },
          {
            method: "POST",
            path: "/accounts/transfer",
            body: JSON.stringify({ amount: 500 }, null, 2),
            expectStatus: 400,
            expectBody: '{"error":"Insufficient balance — this transaction must not be allowed to commit."}',
          },
          { method: "GET", path: "/accounts", expectStatus: 200, expectBody: "Both balances unchanged from the reset — proof the failed transaction really rolled back." },
        ]}
      />
    ),
  },
  {
    heading: "The N+1 Query Problem in PostgreSQL",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "N+1: One Query Per Item, Instead of All Together",
              description: "You fetch a list of N things, then run one MORE query for each item just to get its related data — N+1 real queries total, instead of a small, fixed number.",
            },
            {
              label: "This Is One of the Most Common Real Slowdowns",
              description: "It's not just a Prisma thing — it shows up in any ORM, whenever related data gets fetched one item at a time inside a loop.",
            },
            {
              label: "The Query-Count Instrumentation Lives in the Controller",
              description: "The real query counter is measured server-side, inside controllers/posts.controller.js, and returned right in the API response — routes/server.js never touch Prisma directly.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Prisma&apos;s include fixes N+1 by grouping queries together — a fixed 2 total, not one single SQL JOIN,
          verified directly by watching Prisma&apos;s own query log.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — GET /posts/naive and GET /posts/optimized
          — reading back the REAL SQL query counts Prisma actually sent. For 3 posts, the naive way sends 4 real
          queries; include: {"{ author: true }"} sends only 2.
        </p>
      </>
    ),
    extra: <NPlusOneDiagram />,
    demo: <PostgresNPlusOneRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/PostgresNPlusOne/routes/posts.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/TransactionsPerformance/PostgresNPlusOne/controllers/posts.controller.js", note: "The ONLY file that talks to Prisma — real query-count instrumentation comparing the naive loop against include." },
      { path: "examples/TransactionsPerformance/PostgresNPlusOne/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/TransactionsPerformance/PostgresNPlusOne"
        runCommand="node server.js"
        runPort={4046}
        steps={[
          { method: "POST", path: "/posts/reset", expectStatus: 201, expectBody: "Two fresh real authors (Ada Lovelace, Grace Hopper) and three fresh real posts." },
          { method: "GET", path: "/posts/naive", expectStatus: 200, expectBody: '{"posts":[...],"queryCount":4}' },
          { method: "GET", path: "/posts/optimized", expectStatus: 200, expectBody: '{"posts":[...],"queryCount":2}' },
        ]}
      />
    ),
  },
  {
    heading: "MongoDB's Own Real Transactions",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "\"MongoDB Can't Do Transactions\" Is Outdated",
              description: "That was only true for changes touching MULTIPLE documents at once, before version 4.0. A write to just one document was always safe.",
            },
            {
              label: "session.withTransaction Gives the Same Guarantee",
              description: "Checked directly: this project's real MongoDB Atlas cluster is set up in exactly the way real transactions need.",
            },
            {
              label: "Same Layering, Different Database",
              description: "server.js wires things together, routes/accounts.routes.js declares the endpoints, and controllers/accounts.controller.js is the ONLY file that actually calls session.withTransaction.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          MongoDB&apos;s more common way to avoid needing transactions at all is exactly what the last topic covered:
          put related data inside one document, so there&apos;s only ever one document to update. Reach for a real
          transaction when that doesn&apos;t fit — truly separate things that still need to change together.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — POST /accounts/transfer — running the
          exact same Alice/Bob transfer story as the Postgres example. A forced balance-check failure proves the
          same real safety rule.
        </p>
      </>
    ),
    extra: <MongoTransactionDiagram />,
    demo: <MongoTransactionsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/MongoTransactions/routes/accounts.routes.js", note: "Declares which path/method maps to which controller function — no Mongoose code here at all." },
      { path: "examples/TransactionsPerformance/MongoTransactions/controllers/accounts.controller.js", note: "The ONLY file that talks to Mongoose — real session.withTransaction usage, a successful transfer, then a forced failure that really rolls back." },
      { path: "examples/TransactionsPerformance/MongoTransactions/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Mongoose at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/TransactionsPerformance/MongoTransactions"
        runCommand="node server.js"
        runPort={4047}
        steps={[
          { method: "POST", path: "/accounts/reset", expectStatus: 201, expectBody: "Two fresh real accounts — Alice with balance 100, Bob with balance 0." },
          {
            method: "POST",
            path: "/accounts/transfer",
            body: JSON.stringify({ amount: 500 }, null, 2),
            expectStatus: 400,
            expectBody: '{"error":"Insufficient balance — this transaction must not be allowed to commit."}',
          },
          { method: "GET", path: "/accounts", expectStatus: 200, expectBody: "Both balances unchanged from the reset — proof the failed transaction really rolled back." },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A transaction&apos;s real promise is called atomicity: every write inside it saves together, or
        none of them do. This was checked directly on both databases, by forcing a failure partway through and
        watching an already-run write get undone. The N+1 problem is a real, measurable slowdown, caused by fetching
        related data one item at a time instead of all together. Prisma&apos;s include fixes it with a fixed 2
        queries — not one single SQL join, which is a detail worth getting right in an interview. MongoDB has had
        real transactions across many documents since version 4.0. But the more common habit is still to avoid
        needing them, by keeping related data in one document. Reach for a real transaction when you have truly
        separate things that must change together — not as your default first choice.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["multiple writes must succeed together?", "wrap them in a real transaction", "any step throws → everything rolls back", "fetching related data for a LIST? → batch it (include / a single IN query), don't loop"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "A transaction's promise is atomicity — proven here by forcing a failure AFTER a real write already ran, and checking that the write really got undone, not just that later steps were skipped.",
            "The N+1 problem is a measurable, countable bug in the number of queries — not a vague slowdown. Prisma's include fixes it by grouping queries together (a fixed 2 total), not by turning it into one SQL JOIN.",
            "MongoDB has supported real transactions across many documents since version 4.0 — the old \"MongoDB can't do transactions\" claim is out of date, and worth correcting if it comes up.",
            "Embedding (last topic) and transactions (this topic) are two different tools for the same goal in MongoDB: keeping related data correct. Try embedding first. Reach for a real transaction only when the data truly can't live in one document.",
          ]}
        />
      </>
    ),
  },
];

export default function TransactionsPerformancePage() {
  return (
    <StudyPage
      title="Transactions & Query Performance"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro="Two real, important concerns, both proven with real forced failures and real counted queries: safe transactions with real rollback on both a remote PostgreSQL server and a remote MongoDB Atlas cluster, and the N+1 query problem, measured with Prisma's own real query log."
      sections={sections}
    />
  );
}
