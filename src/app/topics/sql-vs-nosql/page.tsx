import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import RelationalVsDocumentShapeRunner from "@/example-runners/SqlVsNosql/RelationalVsDocumentShapeRunner";
import ForeignKeysVsEmbeddingRunner from "@/example-runners/SqlVsNosql/ForeignKeysVsEmbeddingRunner";
import ReadPatternComparisonRunner from "@/example-runners/SqlVsNosql/ReadPatternComparisonRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function ShapeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-orange-500 mb-2.5">The same blog post, modeled two real ways:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">RELATIONAL — users, posts, comments in 3 separate tables, linked by ids. Reassembled with a JOIN at query time.</div>
      <div className="pl-2 mb-1.5 text-green-500">DOCUMENT — one object: title, author name, and comments all embedded together already. No reassembly needed.</div>
      <div className="mt-2 text-muted">
        Neither shape is inherently correct — they are two different bets about how the data will actually be read and changed.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Same Domain, Two Real Shapes",
    paragraphs: [
      "SQL vs NoSQL isn't a battle of syntax — it's a decision about WHERE related data physically lives. A relational database (SQL) splits data into separate tables and links them by id; a document database (NoSQL, like MongoDB) keeps related data embedded together in one place. Both are real, common, production-proven choices — the right one depends on the shape of the actual problem, not on which is newer or trendier.",
      "The demo below builds the exact same blog post — a title, an author, and some comments — both ways for real: as three linked SQLite tables (users, posts, comments, reassembled with a real JOIN), and as one embedded JS object (which really is exactly what a MongoDB document is — JSON-shaped data). Same final result, two structurally different paths to get there.",
    ],
    extra: <ShapeDiagram />,
    demo: <RelationalVsDocumentShapeRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/RelationalVsDocumentShape/relational.js",
      note: "Real SQLite tables and a real JOIN query (node:sqlite, Node's own built-in engine — no install needed). document.js in the same folder is the embedded-object version.",
    },
  },
  {
    heading: "Relationships Are Enforced in SQL, Not in a Document",
    paragraphs: [
      "A relational database doesn't just SUGGEST that a post belongs to a real user — it can enforce it, with a foreign key constraint the database itself checks on every insert. A document model has no separate table to check an embedded field against, so nothing enforces that an embedded author name (or any other embedded relationship) is actually consistent with anything else in the data.",
      "The demo below proves both real outcomes: trying to insert a post pointing at a user_id that doesn't exist gets REJECTED by SQLite itself (a real thrown error, not application code catching it after the fact); creating the equivalent 'orphaned' document succeeds with no error whatsoever, because there's nothing in the document model itself to notice.",
    ],
    demo: <ForeignKeysVsEmbeddingRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/ForeignKeysVsEmbedding/relational.js",
      note: "A real foreign key constraint that really rejects a bad insert. document.js in the same folder shows the equivalent situation going unchecked.",
    },
  },
  {
    heading: "Two Query Patterns, Two Different Winners",
    paragraphs: [
      "This is the actual decision framework, proven with real code instead of just asserted: which model is \"better\" depends entirely on how the data actually gets READ, not on the data itself. Fetching ONE aggregate (a post plus its own comments) favors documents — it's already sitting together, no query needed. Searching ACROSS MANY aggregates at once (every comment a specific person ever wrote, over every post that exists) favors relational — SQL answers that in one real, indexed, set-based query, while a document model has no query engine to ask, so the application itself has to loop through every single document by hand.",
      "The demo below runs both real patterns against both real models: getting one post's comments costs 2 real SQL queries but 0 for the document; finding one author's comments across every post costs 1 real SQL query but forces a manual scan of every document in the document model. Same two models, opposite winners — which is exactly why a real backend often uses BOTH (a relational store for its core, consistency-critical data, a document store for content that's read as whole chunks and rarely needs cross-cutting queries), rather than treating this as an either/or choice.",
    ],
    demo: <ReadPatternComparisonRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/ReadPatternComparison/relational.js",
      note: "Real query-count instrumentation on both a single-aggregate fetch and a cross-post author search. document.js in the same folder is the manual-scan version.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. SQL (relational) splits data into separate, linked tables and enforces those relationships with real constraints (foreign keys) — it wins when data has many evolving relationships, needs strong consistency, or gets queried across many records at once (reporting, search, anything that isn't \"give me this one thing\"). NoSQL document stores (like MongoDB) embed related data together in one place with no enforced schema between documents — they win when you mostly read one whole aggregate at a time and its shape varies or nests deeply per record. Most real, mature backends use BOTH for different parts of the same system (polyglot persistence) rather than picking one dogmatically — which is exactly why this project is building real depth in both PostgreSQL and MongoDB in this stage, instead of just one.",
    ],
    extra: (
      <>
        <FlowChain steps={["what's the read pattern?", "one aggregate at a time? → document", "many aggregates / relationships? → relational", "often: both, for different data"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "The real decision axis is read pattern and relationship complexity, not \"which is faster\" in the abstract — each model wins at different query shapes, proven directly in this topic's third demo.",
            "Relational databases enforce declared relationships (foreign keys) at the database layer; document stores don't — that's a real trade-off between safety and flexibility, not a flaw in either.",
            "A document is genuinely just JSON-shaped data (embedded, denormalized); a relational row is normalized data reassembled at query time via joins.",
            "Real production systems commonly use both — relational for consistency-critical core data, document for content read as whole chunks — polyglot persistence, not a single either/or choice.",
          ]}
        />
      </>
    ),
  },
];

export default function SqlVsNosqlPage() {
  return (
    <StudyPage
      title="SQL vs NoSQL"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro="Before connecting to a real PostgreSQL and a real MongoDB database in this stage's next topic, this one builds the actual decision framework — using real, runnable code (SQLite's own built-in engine, plus plain embedded JS objects) to prove what each model's data shape really looks like, what each one actually enforces, and which real read patterns favor which model."
      sections={sections}
    />
  );
}
