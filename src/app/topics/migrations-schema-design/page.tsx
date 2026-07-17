import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import PrismaMigrateWorkflowRunner from "@/example-runners/MigrationsSchemaDesign/PrismaMigrateWorkflowRunner";
import MongooseEmbedVsReferenceRunner from "@/example-runners/MigrationsSchemaDesign/MongooseEmbedVsReferenceRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function MigrationHistoryDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "20260715184508_init_post", caption: 'CREATE TABLE "Post" (id, title) — the real, first migration file.' },
    { label: "20260715184547_add_published_flag", caption: 'ALTER TABLE "Post" ADD COLUMN "published" BOOLEAN DEFAULT false — the real, second migration file.' },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real, timestamped migrations — both really applied to the real remote database</div>
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
        <span className="text-yellow-500 text-xs">A real row added BEFORE migration 2 ran kept all its data, and got published = false automatically — checked directly, not just assumed.</span>
      </div>
    </div>
  );
}

function EmbedVsReferenceDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same content, one post plus two comments — two real ways to store it</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">EMBEDDING — 1 real query</div>
          <div className="text-body text-xs leading-relaxed">Comments live INSIDE the post document. Fetching the post already brings its comments — nothing else to ask for.</div>
        </div>
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">REFERENCING — 2 real queries</div>
          <div className="text-body text-xs leading-relaxed">Comments live in their OWN collection, linked by the post&apos;s real _id. A second query is needed to fetch them.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Embedding is cheaper to read — but MongoDB caps a single document at 16MB, a real hard limit an ever-growing embedded list can hit.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Versioned Schema Changes with Prisma Migrate",
    body: (
      <>
        <p>
          The last topic used a command called db push. It just says &quot;make the database match my schema, right
          now.&quot; It keeps no history of how it got there. Prisma Migrate is the better tool for real work.
        </p>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Every Change Becomes Its Own Real, Saved File",
              description: "This builds a real trail showing exactly how the schema changed over time — it matters once more than one person needs to make the same change.",
            },
            {
              label: "Migrate Needs to Fully Own a Schema",
              description: "A real problem showed up while building this: pointing Migrate at a schema db push had already touched made Prisma think that table was a mistake, and it wanted to RESET the whole schema.",
            },
            {
              label: "The Migrated Table Sits Behind a Real API, Not a Script",
              description: "Same layering as every other Express topic here: server.js wires things together, routes/posts.routes.js declares the endpoints, and controllers/posts.controller.js is the ONLY file that actually calls prisma.post.create() and friends.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Pick ONE way to manage a schema, and stick with it — mixing db push and migrate dev on the same schema is a
          real, confirmed problem, not a hypothetical one.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — POST/GET/DELETE on /posts — against the
          table&apos;s CURRENT shape, after both real changes shown above. It never sets &quot;published&quot; when
          making a new row, on purpose — this proves the column&apos;s own real default fills in the value by itself.
        </p>
      </>
    ),
    extra: <MigrationHistoryDiagram />,
    demo: <PrismaMigrateWorkflowRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/prisma/migrations/20260715184508_init_post/migration.sql", note: "Real migration #1 — creates the Post table." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/prisma/migrations/20260715184547_add_published_flag/migration.sql", note: "Real migration #2 — adds the published column with a real default." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/routes/posts.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/controllers/posts.controller.js", note: "The ONLY file that talks to Prisma — real CRUD against the current, post-migration shape." },
      { path: "examples/MigrationsSchemaDesign/PrismaMigrateWorkflow/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MigrationsSchemaDesign/PrismaMigrateWorkflow"
        runCommand="node server.js"
        runPort={4043}
        steps={[
          {
            method: "POST",
            path: "/posts",
            body: JSON.stringify({ title: "Postman check" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"title":"Postman check","published":false} — published comes from the column default, never sent in the body',
          },
          { method: "GET", path: "/posts", expectStatus: 200, expectBody: "A real array containing every post currently in the table." },
          { method: "DELETE", path: "/posts", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every post, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Schema Design in MongoDB: Embedding vs Referencing",
    body: (
      <>
        <p>
          MongoDB has no fixed shape to change, so it has no migration tool to learn. The real question here is not
          &quot;how do I change my schema.&quot; It&apos;s &quot;where should related data actually live.&quot;
        </p>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "Embedding: Related Data Lives INSIDE the Parent",
              description: "The comments were never stored anywhere else. Fetching the post costs 1 real query, comments included.",
            },
            {
              label: "Referencing: Related Data Lives in Its OWN Document",
              description: "Comments live in their own collection. Fetching the post plus its comments costs 2 real queries — a second one to separately grab everything pointing at that post.",
            },
            {
              label: "Both Approaches Sit Behind a Real API",
              description: "One real Express server exposes both: /posts-embedded and /posts-referenced, each with its own routes file and controller — the query count itself is measured server-side, inside the controller, and returned as real response data.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          Embedding wins for reading one thing together — but it isn&apos;t free. MongoDB has a real, hard rule: a
          single document can never be bigger than 16MB, so a list that keeps growing forever can become unsafe.
        </Callout>
        <p>
          The demo below calls both real URL prefixes over real HTTP, building the exact same real content — one
          post, two comments — both ways, then reads back the REAL number of queries each way needed, measured
          server-side and returned right in the response.
        </p>
      </>
    ),
    extra: <EmbedVsReferenceDiagram />,
    demo: <MongooseEmbedVsReferenceRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/embedded-models.js", note: "The embedded approach — comments live inside the post's own array field." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/referenced-models.js", note: "The referenced approach — a separate comments collection, linked by the post's real _id." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/controllers/embedded.controller.js", note: "The ONLY file that talks to Mongoose for the embedded approach, mounted at /posts-embedded." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/controllers/referenced.controller.js", note: "The ONLY file that talks to Mongoose for the referenced approach, mounted at /posts-referenced." },
      { path: "examples/MigrationsSchemaDesign/MongooseEmbedVsReference/demo.js", note: "Calls both real URL prefixes over real HTTP and prints both real results together." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MigrationsSchemaDesign/MongooseEmbedVsReference"
        runCommand="node server.js"
        runPort={4044}
        steps={[
          {
            method: "POST",
            path: "/posts-embedded",
            body: JSON.stringify({ title: "Postman check", comments: [{ body: "hi" }] }, null, 2),
            expectStatus: 201,
            expectBody: '{"_id":"<a real ObjectId>","title":"Postman check","comments":[{"body":"hi","_id":"<a real ObjectId>"}],"__v":0}',
          },
          {
            method: "GET",
            path: "/posts-embedded/<the real _id from the POST above>",
            expectStatus: 200,
            expectBody: '{"post":{...},"queryCount":1}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Prisma Migrate turns every schema change into its own real, timestamped file — a true history of
        how the schema became what it is today. That matters once more than one person needs to make the same change.
        Mixing it with a schema that db push already touched is a real problem, confirmed directly here — Prisma sees
        the untracked table as a mistake and wants to reset everything. MongoDB skips migrations completely, because it
        has no fixed schema to protect. Its real decision instead is embedding (related data lives inside the parent
        document, cheap to read together, but capped at 16MB) versus referencing (related data lives in its own
        collection, no size limit, but costs an extra query). Neither database&apos;s way is &quot;better.&quot;
        They&apos;re solving two different problems. Postgres needs migrations because it enforces a schema. MongoDB
        needs an embed-or-reference decision because it doesn&apos;t.
      </p>
    ),
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
