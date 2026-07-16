import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PrismaMigrateWorkflowRunner from "@/example-runners/MigrationsSchemaDesign/PrismaMigrateWorkflowRunner";
import MongooseEmbedVsReferenceRunner from "@/example-runners/MigrationsSchemaDesign/MongooseEmbedVsReferenceRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function MigrationHistoryDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-orange-500 mb-2.5">Two real, timestamped migrations. Both were really applied to the real remote database while building this page:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">20260715184508_init_post → CREATE TABLE &quot;Post&quot; (id, title)</div>
      <div className="pl-2 mb-1.5 text-green-500">20260715184547_add_published_flag → ALTER TABLE &quot;Post&quot; ADD COLUMN &quot;published&quot; BOOLEAN DEFAULT false</div>
      <div className="mt-2 text-muted">
        A real row that was added BEFORE the second migration ran kept all its data, and got published = false automatically. This was checked directly, not just assumed.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Versioned Schema Changes with Prisma Migrate",
    paragraphs: [
      "The last topic used a command called db push. It just says \"make the database match my schema, right now.\" It keeps no history of how it got there. Prisma Migrate is the better tool for real work. Every single schema change becomes its own real, timestamped file, saved into the project. This builds a real trail. It shows exactly how the schema changed over time. That trail matters once more than one person needs to make the same change.",
      "A real problem showed up while building this. Prisma Migrate needs to fully own a schema. It needs its own history of changes. We pointed it at the last topic's schema, which already had a Task table made by db push, with no history. Prisma thought that table was a mistake. It wanted to RESET the whole schema to fix it. That would have deleted Task too. So this example uses its own separate schema instead. The real lesson: pick ONE way to manage a schema, and stick with it. Don't mix them.",
      "The demo below runs against the table's CURRENT shape, after both real changes shown above. It never sets \"published\" when making a new row. This is on purpose. It proves the column's own real default fills in the value by itself.",
    ],
    extra: <MigrationHistoryDiagram />,
    demo: <PrismaMigrateWorkflowRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/prisma/migrations/20260715184508_init_post/migration.sql", note: "Real migration #1 — creates the Post table." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/prisma/migrations/20260715184547_add_published_flag/migration.sql", note: "Real migration #2 — adds the published column with a real default." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/demo.js", note: "Real CRUD against the current, post-migration shape." },
    ],
  },
  {
    heading: "Schema Design in MongoDB: Embedding vs Referencing",
    paragraphs: [
      "MongoDB has no fixed shape to change, so it has no migration tool to learn. A collection is happy to hold documents that look a bit different from each other. The real question here is not \"how do I change my schema.\" It's \"where should related data actually live.\" You have two choices: INSIDE the parent document (this is called embedding), or as its own separate document in its own collection (this is called referencing).",
      "The demo below builds the exact same real content — one post, two comments — both ways. Then it counts the REAL number of queries each way needs, just to get the post together with its comments. Embedding needs only 1 query. The comments were never stored anywhere else. Referencing needs 2 — a second query, to separately grab every comment that points at that post.",
      "Embedding wins for this one way of reading data. But it isn't free. MongoDB has a real, hard rule: a single document can never be bigger than 16MB. So a list that keeps growing forever — every comment ever posted, on a post that stays popular for years — can become unsafe. A separate collection never runs into that. This is the same basic trade-off from this stage's very first topic, SQL vs NoSQL, now shown as one real MongoDB decision.",
    ],
    demo: <MongooseEmbedVsReferenceRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/embedded-models.js", note: "The embedded approach — comments live inside the post's own array field." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/referenced-models.js", note: "The referenced approach — a separate comments collection, linked by the post's real _id." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/demo.js", note: "Builds the same content both ways and counts the real queries each needs." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Prisma Migrate turns every schema change into its own real, timestamped file — a true history of how the schema became what it is today. That matters once more than one person needs to make the same change. Mixing it with a schema that db push already touched is a real problem, confirmed directly here — Prisma sees the untracked table as a mistake and wants to reset everything. MongoDB skips migrations completely, because it has no fixed schema to protect. Its real decision instead is embedding (related data lives inside the parent document, cheap to read together, but capped at 16MB) versus referencing (related data lives in its own collection, no size limit, but costs an extra query). Neither database's way is \"better.\" They're solving two different problems. Postgres needs migrations because it enforces a schema. MongoDB needs an embed-or-reference decision because it doesn't.",
    ],
    extra: (
      <>
        <FlowChain steps={["schema needs to change", "Postgres: write + apply a real migration.sql, committed", "MongoDB: no migration — just decide embed vs reference for new/changed data", "either way: prove the current shape works with real, running code"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Prisma Migrate's real value is the saved history itself — a record you can review and replay of every schema change, not just \"the schema is correct now.\"",
            "Never mix db push and migrate dev on the same schema — Migrate needs to fully own a schema's history, or it treats anything else as a mistake and wants to reset it.",
            "MongoDB's embed-vs-reference choice is a real, concrete engineering trade-off (how many queries you need vs. the 16MB size limit) — not just a matter of taste.",
            "A real production system usually needs BOTH kinds of decisions at once — a migration plan for its SQL store, an embed-vs-reference call for its document store — because the two databases solve two different halves of the same problem.",
          ]}
        />
      </>
    ),
  },
];

export default function MigrationsSchemaDesignPage() {
  return (
    <StudyPage
      title="Migrations & Schema Design"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro="Two real, different problems: keeping every change to a SQL schema saved and reviewable over time (Prisma Migrate, on a real remote Postgres database), and deciding where related data should actually live when there's no schema to change at all (embedding vs referencing, on a real remote MongoDB database)."
      sections={sections}
    />
  );
}
