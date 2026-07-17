import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import RelationalVsDocumentShapeRunner from "@/example-runners/SqlVsNosql/RelationalVsDocumentShapeRunner";
import ForeignKeysVsEmbeddingRunner from "@/example-runners/SqlVsNosql/ForeignKeysVsEmbeddingRunner";
import ReadPatternComparisonRunner from "@/example-runners/SqlVsNosql/ReadPatternComparisonRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function ShapeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The same blog post, built two real ways</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">RELATIONAL — 3 separate tables</div>
          <div className="text-body text-xs leading-relaxed">users, posts, and comments each live in their own table, linked by an id. Reading them back together requires a real JOIN.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">DOCUMENT — 1 embedded object</div>
          <div className="text-body text-xs leading-relaxed">The title, the author&apos;s name, and every comment already sit inside one object. No joining needed.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Neither shape is the &quot;right&quot; one — they&apos;re two different bets about how the data gets read and changed later.</span>
      </div>
    </div>
  );
}

function ForeignKeyDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The same broken data, two real outcomes</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">RELATIONAL — has a foreign key</div>
          <div className="text-body text-xs leading-relaxed">A post pointing at a user_id that doesn&apos;t exist gets REJECTED by SQLite itself — a real error, before it&apos;s ever saved.</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">DOCUMENT — nothing to check against</div>
          <div className="text-body text-xs leading-relaxed">The same kind of broken reference saves with NO error at all — there&apos;s no separate table for anything to check it against.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">A real trade-off, not a flaw in either one: SQL enforces correctness for you; a document store trusts your own code to.</span>
      </div>
    </div>
  );
}

function ReadPatternDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same two models — the winner flips depending on the question</div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5 mb-3">
        <div className="text-sublabel text-xs uppercase tracking-wide mb-1.5">Pattern A: get ONE post with its comments</div>
        <div className="flex flex-col gap-1 font-mono text-xs">
          <div><span className="text-red-500 font-semibold">RELATIONAL: 2 queries</span><span className="text-body"> — the data lives in separate tables.</span></div>
          <div><span className="text-green-500 font-semibold">DOCUMENT: 0 queries</span><span className="text-body"> — it&apos;s already all in one place. Document wins.</span></div>
        </div>
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
        <div className="text-sublabel text-xs uppercase tracking-wide mb-1.5">Pattern B: find one author&apos;s comments, across EVERY post</div>
        <div className="flex flex-col gap-1 font-mono text-xs">
          <div><span className="text-green-500 font-semibold">RELATIONAL: 1 query</span><span className="text-body"> — one indexed JOIN answers it. SQL wins.</span></div>
          <div><span className="text-red-500 font-semibold">DOCUMENT: 0 queries available</span><span className="text-body"> — your own code has to scan every document by hand.</span></div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Same Data, Two Real Shapes",
    body: (
      <>
        <p>
          SQL and NoSQL are not really about which one is better. They are about WHERE related data lives.
        </p>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "SQL Splits Data Into Separate Tables",
              description: "Related data lives in different tables. It links them together with an id.",
            },
            {
              label: "NoSQL Keeps Related Data Together",
              description: "A database like MongoDB stores everything about one thing in a single place. That one place is called a document.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Neither shape is the &quot;right&quot; one. They are just two different bets about how the data gets read and
          changed later. Real companies use both, depending on the actual problem, not on which one is newer.
        </Callout>
        <p>
          The demo below builds the exact same blog post, two ways, for real. First way: three linked SQLite tables —
          users, posts, comments — joined back together. Second way: one plain JS object, with everything already
          inside it. That second way is really just what a MongoDB document is.
        </p>
      </>
    ),
    extra: <ShapeDiagram />,
    demo: <RelationalVsDocumentShapeRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/RelationalVsDocumentShape/relational.js",
      note: "Real SQLite tables and a real JOIN query (node:sqlite, Node's own built-in engine — no install needed). document.js in the same folder is the embedded-object version.",
    },
  },
  {
    heading: "SQL Checks Your Rules. A Document Does Not.",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "A Foreign Key Is a Real Check the Database Runs",
              description: "A SQL database does not just assume a post belongs to a real user. It can actually check this, every single time.",
            },
            {
              label: "A Document Has Nothing to Check Against",
              description: "There's no separate table to check against. So nothing stops you from saving broken, mismatched data inside it.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          This is a real trade-off between safety and flexibility, not a flaw in either model. SQL enforces
          correctness for you, at the database level; a document store trusts your own application code to.
        </Callout>
        <p>
          The demo below proves both real results. First: adding a post that points at a user who doesn&apos;t exist
          gets REJECTED by SQLite itself — a real error, our own code didn&apos;t have to catch it later. Second:
          saving that same kind of broken data as a document works fine, with no error at all.
        </p>
      </>
    ),
    extra: <ForeignKeyDiagram />,
    demo: <ForeignKeysVsEmbeddingRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/ForeignKeysVsEmbedding/relational.js",
      note: "A real foreign key constraint that really rejects a bad insert. document.js in the same folder shows the equivalent situation going unchecked.",
    },
  },
  {
    heading: "Two Ways to Read Data, Two Different Winners",
    body: (
      <>
        <p>This is the real choice to make. It&apos;s proven here with real code, not just talked about.</p>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "Getting ONE Thing Favors a Document",
              description: "Everything is already sitting together — getting a post plus its own comments costs zero extra queries.",
            },
            {
              label: "Searching ACROSS MANY Things Favors SQL",
              description: "Every comment one person ever wrote, on every post — one real SQL query can answer that. A document database has to check every single one by hand instead.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          Which model wins depends on HOW you read the data — not on the data itself. Same two models, opposite
          winners. This is exactly why real backends often use BOTH: SQL for data that must stay correct and linked,
          documents for content read as one big chunk.
        </Callout>
        <p>
          The demo below tries both ways, on both real models. Getting one post&apos;s comments costs 2 real SQL
          queries; it costs 0 for the document. Finding one author&apos;s comments, across every post, costs 1 real
          SQL query — but forces a slow, manual check of every document.
        </p>
      </>
    ),
    extra: <ReadPatternDiagram />,
    demo: <ReadPatternComparisonRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/ReadPatternComparison/relational.js",
      note: "Real query-count instrumentation on both a single-aggregate fetch and a cross-post author search. document.js in the same folder is the manual-scan version.",
    },
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. SQL splits data into separate, linked tables. It can enforce those links with real rules, called
        foreign keys. It wins when your data has a lot of connections, needs to stay correct, or gets searched across
        many records at once. NoSQL document stores, like MongoDB, keep related data together in one place. There are
        no rules connecting one document to another. They win when you mostly read one whole thing at a time, and its
        shape can change from record to record. Most real, mature backends use BOTH, for different parts of the same
        app, instead of picking just one. That&apos;s exactly why this project is learning both PostgreSQL and MongoDB
        in this stage.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["how will you read the data?", "one thing at a time? → document", "many things connected? → relational", "often: use both, for different data"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "The real question is how the data gets read, not which one is faster in general. Each model wins for different kinds of reads. This was proven directly in this topic's third demo.",
            "A SQL database checks its rules at the database level. A document store does not. That's a real trade-off between safety and flexibility, not a flaw in either one.",
            "A document really is just JSON data, all bundled together. A SQL row is spread across tables and put back together with a join.",
            "Real production systems often use both — SQL for data that must stay correct, documents for content read in big chunks — instead of picking just one.",
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
      intro="Before connecting to a real PostgreSQL and a real MongoDB database in the next topic, this one builds the real decision framework first. It uses real, runnable code — SQLite's own built-in engine, plus plain JS objects — to show what each model's data really looks like, what each one actually checks for you, and which real way of reading data favors which model."
      sections={sections}
    />
  );
}
