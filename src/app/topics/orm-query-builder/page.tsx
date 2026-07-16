import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostgresWithPrismaRunner from "@/example-runners/ConnectingRealDatabases/PostgresWithPrismaRunner";
import MongoWithMongooseRunner from "@/example-runners/ConnectingRealDatabases/MongoWithMongooseRunner";
import CrudSideBySideRunner from "@/example-runners/ConnectingRealDatabases/CrudSideBySideRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function IsolationDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-orange-500 mb-2.5">One real, shared Postgres server. One real, shared MongoDB Atlas cluster. Both already used by other real projects:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">Postgres: this server already had a &ldquo;public&rdquo; space with real tables (clicks, links, users) from another app. Every demo on this page uses a brand-new &ldquo;node_express_learning&rdquo; space instead. It never touches &ldquo;public.&rdquo;</div>
      <div className="pl-2 mb-1.5 text-green-500">MongoDB: this cluster already had other real databases on it. Every demo on this page uses an &ldquo;express&rdquo; database, with its own &ldquo;learning_tasks&rdquo; collection, kept apart from everything else already there.</div>
      <div className="mt-2 text-muted">
        This is a real habit backend devs use every day at a real job. Sharing a server is normal. What matters is keeping your own work in its own space, so it never bumps into someone else&apos;s.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Connecting to Real PostgreSQL with Prisma",
    paragraphs: [
      "Prisma is a tool called an ORM. It helps you talk to a SQL database. You write down your data's shape once, in a file called schema.prisma. Prisma then builds a real JS helper for you. A call like prisma.task.create() turns into real SQL behind the scenes. The connection string tells Prisma where the real database lives. It is read from a real .env file. It is never written directly in the code, and never saved to git.",
      "The demo below runs real CREATE, READ, UPDATE, and DELETE actions. It runs them against a real PostgreSQL server that is actually running right now. This is not a small, throwaway database. It's a real remote Postgres server. Everything this demo touches lives inside a brand-new space called \"node_express_learning.\" That space was made just for this project. It never touches that server's other real tables.",
    ],
    extra: <IsolationDiagram />,
    demo: <PostgresWithPrismaRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/prisma/schema.prisma", note: "The real Prisma schema — declares the Task model and which schema/database to target." },
      { path: "examples/ConnectingRealDatabases/PostgresWithPrisma/demo.js", note: "Real CRUD via the generated Prisma client, run for real against the remote Postgres server." },
    ],
  },
  {
    heading: "Connecting to Real MongoDB with Mongoose",
    paragraphs: [
      "Mongoose does the same job, but for MongoDB. Here's the big difference from Prisma. Mongoose only checks your data's shape on the JS side, inside your own code. MongoDB itself does not check that a document matches any shape at all. This is a real trade-off between flexibility and safety. It comes up again and again in this topic.",
      "The demo below runs the exact same four actions — CREATE, READ, UPDATE, DELETE. It runs them against a real MongoDB Atlas cluster that is actually running. Everything lives inside one collection, called \"learning_tasks,\" inside a database called \"express.\" This keeps it fully separate from anything else already stored there.",
    ],
    demo: <MongoWithMongooseRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/task-model.js", note: "The real Mongoose schema/model, pinned to the \"learning_tasks\" collection." },
      { path: "examples/ConnectingRealDatabases/MongoWithMongoose/demo.js", note: "Real CRUD via Mongoose, run for real against the remote MongoDB Atlas cluster." },
    ],
  },
  {
    heading: "The Same CRUD, Side by Side",
    paragraphs: [
      "Now for the direct comparison. The exact same job runs for real against BOTH databases, in one single script: make one record, read all records, update it, delete it. This way, the real results sit right next to each other. You don't have to remember two separate demos.",
      "Here's the real difference that shows up once both are run. The Postgres row comes back with exactly the columns you wrote in schema.prisma. Nothing more. The Mongo document comes back with those same fields, PLUS a real _id (MongoDB's own id format) and a real __v field that Mongoose adds for its own bookkeeping. Nothing in MongoDB forces a document to keep that exact shape. Mongoose is the only thing checking it, and only inside your own app.",
    ],
    demo: <CrudSideBySideRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/prisma/schema.prisma", note: "Same Task shape, same real schema — but its own separate table (SideBySideTask), since running two mini-projects' demos against the literal same table is a real concurrency risk (see build-conventions.md)." },
      { path: "examples/ConnectingRealDatabases/CrudSideBySide/demo.js", note: "Runs the identical CRUD sequence against both real databases and prints both real results together." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Prisma (for Postgres) and Mongoose (for MongoDB) both let you talk to a real database with real JS calls, instead of writing raw queries by hand. But they check your data's shape in two very different places. Prisma's shape is checked by the DATABASE itself — a bad value gets rejected right there. Mongoose's shape is checked by MONGOOSE, inside your own code — the database underneath would happily store something that doesn't match. A real connection string always works the same way: it holds a host, some credentials, and its own space (a Postgres schema, or a Mongo database and collection). Keeping your data inside that space, apart from everyone else's, is exactly what this topic's demos had to do for real.",
    ],
    extra: (
      <>
        <FlowChain steps={["declare the shape (schema.prisma / Mongoose Schema)", "generate/build a real client", "connect via a real .env connection string", "real CRUD calls become real SQL / real Mongo operations"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Prisma is an ORM for SQL databases. Mongoose does the same job for MongoDB. Both skip hand-written queries, but they talk to very different kinds of storage underneath.",
            "The real difference is WHERE the shape gets checked. Prisma's shape is checked by the database itself. Mongoose's shape is only checked by Mongoose, inside your own app.",
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
      intro="Real CRUD against two real databases that are actually running right now — a remote PostgreSQL server via Prisma, and a remote MongoDB Atlas cluster via Mongoose. Both are already shared with other real projects. So every demo here also has to prove it stays in its own lane, not just that it works."
      sections={sections}
    />
  );
}
