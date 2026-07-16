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
      <div className="text-orange-500 mb-2.5">The same blog post, built two real ways:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">RELATIONAL — users, posts, and comments live in 3 separate tables. We link them with an id. We join them back together when we read them.</div>
      <div className="pl-2 mb-1.5 text-green-500">DOCUMENT — one object holds the title, the author&apos;s name, and all the comments already. No joining needed.</div>
      <div className="mt-2 text-muted">
        Neither shape is the &quot;right&quot; one. They are just two different bets about how the data gets read and changed later.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Same Data, Two Real Shapes",
    paragraphs: [
      "SQL and NoSQL are not really about which one is better. They are about WHERE related data lives. A SQL database splits data into separate tables. It links them with an id. A NoSQL database, like MongoDB, keeps related data together in one place. That one place is called a document. Both are real, common choices. Real companies use both. The right one depends on your actual problem, not on which one is newer.",
      "The demo below builds the exact same blog post, two ways, for real. First way: three linked SQLite tables — users, posts, comments — joined back together. Second way: one plain JS object, with everything already inside it. That second way is really just what a MongoDB document is. Same end result. Two very different paths to get there.",
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
    heading: "SQL Checks Your Rules. A Document Does Not.",
    paragraphs: [
      "A SQL database does not just assume a post belongs to a real user. It can actually check this, every single time. This check is called a foreign key. A document has no separate table to check against. So nothing stops you from saving broken, mismatched data inside it.",
      "The demo below proves both real results. First: adding a post that points at a user who doesn't exist gets REJECTED by SQLite itself. That's a real error. Our own code didn't have to catch it later. Second: saving that same kind of broken data as a document works fine. No error at all. Nothing in the document model was watching for it.",
    ],
    demo: <ForeignKeysVsEmbeddingRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/SqlVsNosql/ForeignKeysVsEmbedding/relational.js",
      note: "A real foreign key constraint that really rejects a bad insert. document.js in the same folder shows the equivalent situation going unchecked.",
    },
  },
  {
    heading: "Two Ways to Read Data, Two Different Winners",
    paragraphs: [
      "This is the real choice to make. It's proven here with real code, not just talked about. Which model wins depends on HOW you read the data — not on the data itself. Getting ONE thing, like a post plus its own comments, is easier with a document. Everything is already sitting together. Searching ACROSS MANY things at once — every comment one person ever wrote, on every post — is easier with SQL. One question can answer that. A document database can't search across many documents like that. Your own code would have to check every single one by hand.",
      "The demo below tries both ways, on both real models. Getting one post's comments costs 2 real SQL queries. It costs 0 for the document. Finding one author's comments, across every post, costs 1 real SQL query. But it forces a slow, manual check of every document. Same two models. Opposite winners. This is exactly why real backends often use BOTH: SQL for data that must stay correct and linked, documents for content read as one big chunk.",
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
      "Quick recap. SQL splits data into separate, linked tables. It can enforce those links with real rules, called foreign keys. It wins when your data has a lot of connections, needs to stay correct, or gets searched across many records at once. NoSQL document stores, like MongoDB, keep related data together in one place. There are no rules connecting one document to another. They win when you mostly read one whole thing at a time, and its shape can change from record to record. Most real, mature backends use BOTH, for different parts of the same app, instead of picking just one. That's exactly why this project is learning both PostgreSQL and MongoDB in this stage.",
    ],
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
