import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import PostgresWithPrismaRunner from "@/example-runners/ConnectingRealDatabases/PostgresWithPrismaRunner";
import MongoWithMongooseRunner from "@/example-runners/ConnectingRealDatabases/MongoWithMongooseRunner";
import CrudSideBySideRunner from "@/example-runners/ConnectingRealDatabases/CrudSideBySideRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function PrismaFlowDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "schema.prisma declares the shape", caption: "Task { id, title, done, createdAt } — written once, in one file." },
    { label: "prisma generate builds a real client", caption: "Runs automatically after npm install here — creates real, typed JS functions." },
    { label: "a controller calls prisma.task.create({...})", caption: "The ORM call lives in controllers/tasks.controller.js — routes/server.js never touch Prisma directly." },
    { label: "Prisma turns it into real SQL", caption: "A real INSERT runs against the real Postgres server." },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What actually happens when a real request hits this API</div>
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
        <span className="text-yellow-500 text-xs">Every demo here lives inside its own real schema, &quot;node_express_learning&quot; — a real, shared Postgres server, kept in its own lane, never touching &quot;public.&quot;</span>
      </div>
    </div>
  );
}

function MongooseFlowDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Where the shape gets checked — a real, structural difference from Prisma</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">Prisma + Postgres</div>
          <div className="text-body text-xs leading-relaxed">The TABLE ITSELF has real columns. The database rejects a value that doesn&apos;t fit.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">Mongoose + MongoDB</div>
          <div className="text-body text-xs leading-relaxed">MongoDB itself checks NOTHING. Mongoose checks the shape only inside the controller&apos;s own JS code, before saving.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Every demo here lives inside its own real collection, &quot;learning_tasks&quot;, in a real, shared &quot;express&quot; database on Atlas — kept apart from everything else already there.</span>
      </div>
    </div>
  );
}

function ShapeComparisonDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The exact same job — two different real shapes come back</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">Postgres row (via /postgres-tasks)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed">{"{ id, title, done, createdAt }"}</div>
          <div className="text-body text-xs leading-relaxed mt-1">Exactly the columns written in schema.prisma. Nothing more. id is a plain integer.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">Mongo document (via /mongo-tasks)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed">{"{ _id, title, done, createdAt, __v }"}</div>
          <div className="text-body text-xs leading-relaxed mt-1">Same fields, PLUS a real _id (an ObjectId, not a plain integer) and __v — Mongoose&apos;s own bookkeeping field.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">One real Express API, two separate real URL prefixes, two separate real controllers — nothing in MongoDB forces a document to keep this exact shape.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Connecting to Real PostgreSQL with Prisma",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Prisma Is an ORM",
              description: "A tool that helps you talk to a SQL database. You write down your data's shape once, in a file called schema.prisma.",
            },
            {
              label: "Real JS Calls Become Real SQL — Inside a Controller",
              description: "Same layering this project already taught in \"Project Structure & Config\": server.js wires things together, routes/tasks.routes.js declares the endpoints, and controllers/tasks.controller.js is the ONLY file that actually calls prisma.task.create() and friends.",
            },
            {
              label: "The Connection String Lives in .env",
              description: "It tells Prisma where the real database lives. It's read from a real .env file — never written directly in the code, and never saved to git.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Prisma&apos;s ORM job is turning real, typed JS function calls into real SQL, from inside a real controller
          — and the database itself is what enforces the shape you declared in schema.prisma, rejecting anything that
          doesn&apos;t fit.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — POST/GET/PATCH/DELETE on /tasks — proving
          real CREATE, READ, UPDATE, and DELETE against a real PostgreSQL server that is actually running right now.
          Everything this demo touches lives inside a brand-new space called &quot;node_express_learning,&quot; made
          just for this project — it never touches that server&apos;s other real tables.
        </p>
      </>
    ),
    extra: <PrismaFlowDiagram />,
    demo: <PostgresWithPrismaRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/prisma/schema.prisma", note: "The real Prisma schema — declares the Task model and which schema/database to target." },
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/routes/tasks.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/controllers/tasks.controller.js", note: "The ONLY file that talks to Prisma — real CRUD, run for real against the remote Postgres server." },
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ConnectingRealDatabases/PostgresWithPrisma"
        runCommand="node server.js"
        runPort={4040}
        steps={[
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({ title: "Test via Postman" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"title":"Test via Postman","done":false,"createdAt":"<a real timestamp>"}',
          },
          { method: "GET", path: "/tasks", expectStatus: 200, expectBody: "A real array containing every task currently in the table." },
          { method: "DELETE", path: "/tasks", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every task, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Connecting to Real MongoDB with Mongoose",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "Mongoose Does the Same Job, for MongoDB",
              description: "You write down a schema, and Mongoose builds real JS functions for real document operations.",
            },
            {
              label: "Same Layering, Different ORM",
              description: "server.js wires things together, routes/tasks.routes.js declares the endpoints, and controllers/tasks.controller.js is the ONLY file that actually calls Task.create() and friends.",
            },
            {
              label: "But the Shape Is Only Checked on the JS Side",
              description: "MongoDB itself does not check that a document matches any shape at all — Mongoose is the only thing checking it, inside the controller's own code.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          This is a real trade-off between flexibility and safety, and it comes up again and again in this topic —
          MongoDB will happily store a document that doesn&apos;t match Mongoose&apos;s schema at all.
        </Callout>
        <p>
          The demo below calls a real, running Express API over real HTTP — the exact same four actions — CREATE,
          READ, UPDATE, DELETE — against a real MongoDB Atlas cluster that is actually running. Everything lives
          inside one collection, called &quot;learning_tasks,&quot; inside a database called &quot;express,&quot;
          kept fully separate from anything else already stored there.
        </p>
      </>
    ),
    extra: <MongooseFlowDiagram />,
    demo: <MongoWithMongooseRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/task-model.js", note: "The real Mongoose schema/model, pinned to the \"learning_tasks\" collection." },
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/routes/tasks.routes.js", note: "Declares which path/method maps to which controller function — no Mongoose code here at all." },
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/controllers/tasks.controller.js", note: "The ONLY file that talks to Mongoose — real CRUD, run for real against the remote MongoDB Atlas cluster." },
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Mongoose at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ConnectingRealDatabases/MongoWithMongoose"
        runCommand="node server.js"
        runPort={4041}
        steps={[
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({ title: "Test via Postman" }, null, 2),
            expectStatus: 201,
            expectBody: '{"title":"Test via Postman","done":false,"_id":"<a real ObjectId>","createdAt":"<a real timestamp>","__v":0}',
          },
          { method: "GET", path: "/tasks", expectStatus: 200, expectBody: "A real array containing every document currently in the collection." },
          { method: "DELETE", path: "/tasks", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every document, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "The Same CRUD, Side by Side",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "One Real API, Two Real Database Prefixes",
              description: "The exact same job runs for real against BOTH databases, behind one real Express server: /postgres-tasks (Prisma) and /mongo-tasks (Mongoose), each with its own routes file and controller.",
            },
            {
              label: "The Real Shape Difference Shows Up Once Both Run",
              description: "The Postgres row comes back with exactly the columns written in schema.prisma. The Mongo document comes back with those same fields, PLUS a real _id and a real __v field Mongoose adds for its own bookkeeping.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          Nothing in MongoDB forces a document to keep an exact shape — Mongoose is the only thing checking it, and
          only inside the controller. Postgres enforces its shape at the database level, every time, no matter what
          calls it.
        </Callout>
        <p>
          The demo below calls both real URL prefixes on the same real, running API, so you don&apos;t have to
          remember two separate demos — the real difference is visible in one place.
        </p>
      </>
    ),
    extra: <ShapeComparisonDiagram />,
    demo: <CrudSideBySideRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/prisma/schema.prisma", note: "Same Task shape, same real schema — but its own separate table (SideBySideTask), since running two mini-projects' demos against the literal same table is a real concurrency risk (see build-conventions.md)." },
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/controllers/postgres-tasks.controller.js", note: "The ONLY file that talks to Prisma, mounted at /postgres-tasks." },
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/controllers/mongo-tasks.controller.js", note: "The ONLY file that talks to Mongoose, mounted at /mongo-tasks." },
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/demo.js", note: "Calls both real URL prefixes over real HTTP and prints both real results together." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ConnectingRealDatabases/CrudSideBySide"
        runCommand="node server.js"
        runPort={4042}
        steps={[
          {
            method: "POST",
            path: "/postgres-tasks",
            body: JSON.stringify({ title: "Postman test" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"title":"Postman test","done":false,"createdAt":"<a real timestamp>"}',
          },
          {
            method: "POST",
            path: "/mongo-tasks",
            body: JSON.stringify({ title: "Postman test" }, null, 2),
            expectStatus: 201,
            expectBody: '{"title":"Postman test","done":false,"_id":"<a real ObjectId>","createdAt":"<a real timestamp>","__v":0}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Prisma (for Postgres) and Mongoose (for MongoDB) both let you talk to a real database with real
        JS calls, instead of writing raw queries by hand — and in a real backend, those calls live inside a
        controller, behind real routes, never inside a throwaway script. But they check your data&apos;s shape in two
        very different places. Prisma&apos;s shape is checked by the DATABASE itself — a bad value gets rejected right
        there. Mongoose&apos;s shape is checked by MONGOOSE, inside the controller&apos;s own code — the database
        underneath would happily store something that doesn&apos;t match. A real connection string always works the
        same way: it holds a host, some credentials, and its own space (a Postgres schema, or a Mongo database and
        collection). Keeping your data inside that space, apart from everyone else&apos;s, is exactly what this
        topic&apos;s demos had to do for real.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["declare the shape (schema.prisma / Mongoose Schema)", "controller calls the real ORM function", "routes/server.js just wire the request to that controller", "real CRUD calls become real SQL / real Mongo operations"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Prisma is an ORM for SQL databases. Mongoose does the same job for MongoDB. Both skip hand-written queries, but they talk to very different kinds of storage underneath.",
            "The real difference is WHERE the shape gets checked. Prisma's shape is checked by the database itself. Mongoose's shape is only checked by Mongoose, inside the controller.",
            "A real connection string always has three parts: a host, some credentials, and its own space (a Postgres schema, or a Mongo database and collection). Keeping your work inside that space on a shared server is normal, everyday practice.",
            "Never write a real connection string directly in your code. It belongs in a real .env file that git ignores, with a committed .env.example showing the shape for teammates.",
          ]}
        />
      </>
    ),
  },
];

export default function ConnectingRealDatabasesPage() {
  return (
    <StudyPage
      title="Connecting Real Databases: PostgreSQL & MongoDB"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro="Real CRUD against two real databases that are actually running right now, exposed the same way any real backend exposes them — behind real Express APIs, routes, and controllers — a remote PostgreSQL server via Prisma, and a remote MongoDB Atlas cluster via Mongoose. Both are already shared with other real projects, so every demo here also has to prove it stays in its own lane, not just that it works."
      sections={sections}
    />
  );
}
