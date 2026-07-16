import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostgresTransactionsRunner from "@/example-runners/TransactionsPerformance/PostgresTransactionsRunner";
import PostgresNPlusOneRunner from "@/example-runners/TransactionsPerformance/PostgresNPlusOneRunner";
import MongoTransactionsRunner from "@/example-runners/TransactionsPerformance/MongoTransactionsRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function RollbackDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-orange-500 mb-2.5">A transaction that fails partway through — checked directly, on both databases:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">Step 1: take 500 from Alice (this write really happens)</div>
      <div className="pl-2 mb-1.5 text-cyan-500">Step 2: balance check fails → a real error is thrown on purpose</div>
      <div className="pl-2 mb-1.5 text-green-500">Result: Alice&apos;s balance goes back to what it was BEFORE step 1. The database undid a write that had already happened, because it was never allowed to finish alone.</div>
      <div className="mt-2 text-muted">
        This is the real point of a transaction. It&apos;s not about stopping the first write from happening — it&apos;s about making sure that write never sticks around without every other step in the same group.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Real Transactions & Rollback in PostgreSQL",
    paragraphs: [
      "A transaction groups several real writes into ONE all-or-nothing unit. Prisma has a tool for this called $transaction. It runs every action inside one function, as one single unit. If anything inside throws an error, EVERY write in that unit gets undone. Even writes that had already worked, just moments before.",
      "The demo below proves both real outcomes, on a real remote Postgres server. First: a real transfer of 50 from Alice to Bob works. Both balances update together. Second: a transfer of 500 fails a balance check PARTWAY THROUGH — right after Alice's money was already taken out. Prisma undoes the whole thing. We check Alice's balance again afterward. It's unchanged, as if that first step never happened.",
    ],
    extra: <RollbackDiagram />,
    demo: <PostgresTransactionsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/PostgresTransactions/demo.js", note: "Real $transaction usage — a successful transfer, then a forced failure that really rolls back." },
    ],
  },
  {
    heading: "The N+1 Query Problem in PostgreSQL",
    paragraphs: [
      "Here's the N+1 problem in plain terms. You fetch a list of N things. Then you run one MORE query, for each item, just to get its related data. That's N+1 real queries total, instead of a small, fixed number. This is one of the most common real slowdowns in any ORM. It's not just a Prisma thing.",
      "The demo below counts the REAL SQL queries Prisma actually sends. It uses Prisma's own query-logging tool, so this is measured, not guessed. For 3 posts, the naive way sends 4 real queries — 1 to get all the posts, plus 1 more for each post's author. Using include: { author: true } instead sends only 2 real queries. This is checked directly: it's NOT one single SQL join. It's Prisma's own trick — one query for the posts, and one more query that grabs every needed author at once. That count of 2 stays the same no matter how many posts there are. The naive way keeps growing by 1 query for every extra post.",
    ],
    demo: <PostgresNPlusOneRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/PostgresNPlusOne/demo.js", note: "Real query-count instrumentation comparing the naive loop against include." },
    ],
  },
  {
    heading: "MongoDB's Own Real Transactions",
    paragraphs: [
      "MongoDB has had real transactions across many documents since version 4.0. A lot of people still think \"MongoDB can't do transactions.\" That was only true for changes touching MULTIPLE documents at once, before version 4.0. A write to just one document was always safe. We checked this directly: this project's real MongoDB Atlas cluster is set up in exactly the way real transactions need.",
      "The demo below runs the exact same Alice/Bob transfer story as the Postgres example. It uses a real Mongoose tool called session.withTransaction. A forced balance-check failure proves the same real safety rule. Alice's money gets taken out. The code then throws an error on purpose. Her balance is checked again afterward, and it's unchanged.",
      "MongoDB's more common way to avoid needing transactions at all is exactly what the last topic covered: put related data inside one document, so there's only ever one document to update. Real transactions matter most when that doesn't fit — like two truly separate things, such as two different bank accounts, that still need to change together.",
    ],
    demo: <MongoTransactionsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/TransactionsPerformance/MongoTransactions/demo.js", note: "Real session.withTransaction usage — a successful transfer, then a forced failure that really rolls back." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. A transaction's real promise is called atomicity: every write inside it saves together, or none of them do. This was checked directly on both databases, by forcing a failure partway through and watching an already-run write get undone. The N+1 problem is a real, measurable slowdown, caused by fetching related data one item at a time instead of all together. Prisma's include fixes it with a fixed 2 queries. It's not one single SQL join, which is a detail worth getting right in an interview. MongoDB has had real transactions across many documents since version 4.0. But the more common habit is still to avoid needing them, by keeping related data in one document. Reach for a real transaction when you have truly separate things that must change together — not as your default first choice.",
    ],
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
