import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function BsonTypesDiagram() {
  const fields: { name: string; bsonType: string; jsType: string; note: string; surprising?: boolean }[] = [
    { name: "_id", bsonType: "ObjectId", jsType: "ObjectId object", note: "Mongo's own real id type, auto-generated — not a plain string." },
    { name: "name", bsonType: "String", jsType: "string", note: "Plain text, same as Postgres's TEXT." },
    { name: "price", bsonType: "Double", jsType: "number", note: "A real JS number, the whole way through.", surprising: true },
    { name: "inStock", bsonType: "Boolean", jsType: "boolean", note: "A real JS true/false." },
    { name: "tags", bsonType: "Array", jsType: "Array", note: "A real embedded list — Postgres needs a whole separate table for this." },
    { name: "createdAt", bsonType: "Date", jsType: "Date object", note: "A real JS Date, ready to format." },
  ];
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real document, six real BSON field types — what JS type each one actually comes back as</div>
      <div className="flex flex-col gap-2">
        {fields.map((f) => (
          <div
            key={f.name}
            className={`rounded-card border px-3 py-2 flex items-center gap-3 flex-wrap ${f.surprising ? "border-yellow-500 bg-yellow-500/5" : "border-border bg-surface-raised"}`}
          >
            <span className="font-mono text-xs font-semibold text-cyan-500 w-20 shrink-0">{f.name}</span>
            <span className="font-mono text-xs text-body w-24 shrink-0">{f.bsonType}</span>
            <span className="text-body text-xs">→</span>
            <span className={`font-mono text-xs font-semibold w-32 shrink-0 ${f.surprising ? "text-yellow-500" : "text-green-500"}`}>{f.jsType}</span>
            <span className="text-body text-xs leading-relaxed">{f.note}</span>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">A real, meaningful contrast with Postgres Fundamentals: a Double field comes back as a genuine JS number, not a string — MongoDB doesn&apos;t have Postgres&apos;s NUMERIC-precision reason to protect against.</span>
      </div>
    </div>
  );
}

function ObjectIdConversionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A URL param is always a plain string — Mongo&apos;s _id is never one</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">✗ Passing the raw string straight in</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`collection.findOne({ _id: req.params.id })`}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">A real document&apos;s _id is a real ObjectId instance — a plain string can never match it, so this always returns null, even for a genuinely real id.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">✓ Converting first (what every id route here does)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`collection.findOne({ _id: new ObjectId(req.params.id) })`}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">A real, matching ObjectId instance — but the conversion itself throws a real error on a badly-formatted string, so it needs a real try/catch.</div>
        </div>
      </div>
    </div>
  );
}

function NoSqlInjectionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two ways to build a real filter object — only one is safe</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">✗ Trusting req.query wholesale (never do this)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`collection.find(req.query)`}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">A real query string like <span className="font-mono">?genre[$ne]=null</span> is parsed by Express into a real <span className="font-mono">{"{ genre: { $ne: null } }"}</span> object — Mongo runs that as a real operator, not a plain value.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">✓ Building the filter field by field (what this section&apos;s API does)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`if (typeof req.query.genre === "string") filter.genre = req.query.genre;`}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">Only a genuine plain string is ever accepted as a value — an object can never sneak into the real filter this way.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">The real NoSQL sibling of SQL injection from Postgres Fundamentals — same underlying lesson (never let raw user input dictate a query&apos;s own STRUCTURE), a genuinely different real mechanism.</span>
      </div>
    </div>
  );
}

function AggregationPipelineDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">$group splits documents into buckets — each bucket collapses into ONE summary document</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="font-mono text-xs text-sublabel font-semibold mb-1.5">5 real documents, before $group</div>
          <div className="font-mono text-[11px] text-body leading-relaxed">
            Electronics — 199.99<br />
            Electronics — 49.50<br />
            Electronics — 899.00<br />
            Books — 14.99<br />
            Books — 22.50
          </div>
        </div>
        <div className="rounded-card border border-cyan-500 bg-cyan-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1.5">2 real documents, after $group by category</div>
          <div className="font-mono text-[11px] text-body leading-relaxed">
            Electronics — count 3, total 1148.49<br />
            Books — count 2, total 37.49
          </div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Unlike Postgres&apos;s COUNT(*), $sum: 1 comes back as a real, plain JS number — no BIGINT-style string-casting anywhere in this result.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Connecting to MongoDB & Real Document Shapes",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "No ODM Yet, on Purpose",
              description: "Every topic from here through \"MongoDB Advanced Patterns\" builds on real documents you shape yourself, with Node's native \"mongodb\" driver — before \"Connecting Real Databases\" introduces Mongoose on top of it.",
            },
            {
              label: "There Is No CREATE COLLECTION Step",
              description: "Unlike Postgres's CREATE TABLE, MongoDB makes a real collection by itself, automatically, the moment the first real document is inserted into it — this mini-project has no setup.js at all, on purpose.",
            },
            {
              label: "A Document's Real Shape Is Decided Per-Document, Not by a Fixed Schema",
              description: "Nothing stops one real document from having a field another one doesn't — the flexibility is real, not just marketing.",
              example: "This section's product document has a real \"tags\" array — a shape Postgres could only represent with a whole separate join table.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          MongoDB enforces nothing about a document&apos;s shape by default — every real constraint (required fields,
          value types) has to come from your own application code, unlike Postgres&apos;s column-level enforcement. In
          exchange, a real field&apos;s JS type is usually exactly what you&apos;d guess — a Double really does come back
          as a plain JS number, unlike Postgres&apos;s NUMERIC-as-string precision guard.
        </Callout>
        <p>
          The demo below inserts one real document with six different real BSON field types, then asks the document
          itself — at runtime, since there&apos;s no fixed schema to ask instead — exactly what JS type each field
          actually comes back as.
        </p>
      </>
    ),
    extra: <BsonTypesDiagram />,
    filePointers: [
      { path: "examples/MongodbFundamentals/MongoConnectionAndDocuments/db.js", note: "The real shared client connection and this mini-project's dedicated collection name." },
      { path: "examples/MongodbFundamentals/MongoConnectionAndDocuments/controllers/products.controller.js", note: "The only file that talks to the real database — including the runtime describeType() helper, since there's no fixed schema to ask instead." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MongodbFundamentals/MongoConnectionAndDocuments"
        runCommand="node server.js"
        runPort={4130}
        steps={[
          {
            method: "POST",
            path: "/products",
            body: JSON.stringify({ name: "Wireless Mouse", price: 29.99, inStock: true, tags: ["electronics", "accessories"] }, null, 2),
            expectStatus: 201,
            expectBody: '{"_id":"<a real 24-character hex ObjectId>","name":"Wireless Mouse","price":29.99,"inStock":true,"tags":["electronics","accessories"],"createdAt":"<a real ISO timestamp>"}',
            note: "Notice price comes back as a real, unquoted number — not a string.",
          },
          { method: "GET", path: "/products/types", expectStatus: 200, expectBody: '{"_id":"ObjectId","name":"string","price":"number","inStock":"boolean","tags":"Array","createdAt":"Date"}' },
          { method: "GET", path: "/products", expectStatus: 200, expectBody: "A real array containing every product currently in the collection." },
          { method: "DELETE", path: "/products", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every product, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Basic CRUD via the Native Driver",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "The Four Real Operations",
              description: "insertOne (create), findOne/find (read), findOneAndUpdate, and findOneAndDelete — written by hand this time, no ODM translating them for you.",
            },
            {
              label: "A URL Param Is Always a String — _id Never Is",
              description: "Every id-based route has to convert the real URL string into a real ObjectId instance before it can match anything, using new ObjectId(id).",
              example: "A badly-formatted string throws a real error the moment you try to convert it — this section's toObjectId() helper catches that and reports 404 instead of crashing.",
            },
            {
              label: "findOneAndUpdate/findOneAndDelete Update AND Read Back, in One Real Round Trip",
              description: "Passing { returnDocument: \"after\" } hands back the real, already-updated document directly — the same real convenience as Postgres's UPDATE...RETURNING.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          The native driver never converts a URL string into an ObjectId for you — every route that looks a document
          up by id has to do it explicitly, and has to handle the real, thrown error a malformed id string produces.
          This is the direct MongoDB equivalent of Postgres Fundamentals&apos; own parameterized-query discipline: a
          real, mechanical step standing between raw user input and a real database operation.
        </Callout>
        <p>
          The demo below runs a full CREATE → READ ONE → READ ALL → UPDATE → DELETE cycle against a real
          &quot;books&quot; collection, then proves a 404 is real too — both for an id that&apos;s gone, and for one
          that was never validly formatted in the first place.
        </p>
      </>
    ),
    extra: <ObjectIdConversionDiagram />,
    filePointers: [
      { path: "examples/MongodbFundamentals/RawMongoCrud/controllers/books.controller.js", note: "Every real insertOne/findOne/find/findOneAndUpdate/findOneAndDelete — plus the real toObjectId() conversion every id-based route needs." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MongodbFundamentals/RawMongoCrud"
        runCommand="node server.js"
        runPort={4131}
        steps={[
          {
            method: "POST",
            path: "/books",
            body: JSON.stringify({ title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008 }, null, 2),
            expectStatus: 201,
            expectBody: '{"_id":"<a real 24-character hex ObjectId>","title":"Clean Code","author":"Robert C. Martin","publishedYear":2008}',
          },
          { method: "GET", path: "/books/<id>", expectStatus: 200, expectBody: '{"_id":"<the same real id>","title":"Clean Code","author":"Robert C. Martin","publishedYear":2008}', note: "Replace <id> with the real _id the POST above actually returned — unlike Postgres's predictable SERIAL 1, an ObjectId can't be guessed ahead of time." },
          { method: "GET", path: "/books", expectStatus: 200, expectBody: "A real array containing every book currently in the collection." },
          {
            method: "PATCH",
            path: "/books/<id>",
            body: JSON.stringify({ title: "Clean Code (2nd read)", author: "Robert C. Martin", publishedYear: 2008 }, null, 2),
            expectStatus: 200,
            expectBody: '{"_id":"<the same real id>","title":"Clean Code (2nd read)","author":"Robert C. Martin","publishedYear":2008}',
            note: "Same real <id> as above.",
          },
          { method: "DELETE", path: "/books/<id>", expectStatus: 200, expectBody: '{"_id":"<the same real id>","title":"Clean Code (2nd read)","author":"Robert C. Martin","publishedYear":2008}', note: "Same real <id> as above." },
          { method: "GET", path: "/books/<id>", expectStatus: 404, expectBody: '{"error":"No book with that id."}', note: "Same real <id>, right after deleting it." },
          { method: "GET", path: "/books/not-a-real-id", expectStatus: 404, expectBody: '{"error":"No book with that id."}', note: "A string that isn't even a validly-formatted ObjectId — caught, not crashed." },
          { method: "DELETE", path: "/books", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every book, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Filtering, Sorting & Pagination Basics",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "find()'s Filter Object Plays WHERE's Role",
              description: "Only documents matching every real condition in the filter object are included — each condition is built from a real, present query-string parameter, field by field.",
            },
            {
              label: ".sort() Plays ORDER BY's Role",
              description: "Picked from a small, fixed list of allowed sort options — never straight from the raw query string, same discipline as Postgres's own sort allow-list.",
            },
            {
              label: ".limit() & .skip() Are Pagination's Two Real Numbers",
              description: "limit() caps how many documents come back. skip() skips a real number of documents before starting to collect them — the direct Mongo equivalent of LIMIT/OFFSET.",
              example: "?sort=year_asc&limit=2&offset=1 — skip the oldest, take the next 2.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          A raw req.query object handed straight to find() is a real, well-documented NoSQL injection vector — a
          query-string value can be parsed into a real Mongo operator object, not just a plain string. The fix isn&apos;t
          a special sanitizer library, it&apos;s the same discipline as everywhere else in this project: build the
          real filter explicitly, field by field, never by trusting the shape of user input.
        </Callout>
        <p>
          The demo below seeds 4 real movies, then runs the same real endpoint with different combinations of
          filters, sorting, and pagination — proving each one changes exactly the documents and order you&apos;d
          expect.
        </p>
      </>
    ),
    extra: <NoSqlInjectionDiagram />,
    filePointers: [
      { path: "examples/MongodbFundamentals/FilteringSortingBasics/controllers/movies.controller.js", note: "Builds a real filter/sort/limit/skip query from real query-string parameters, safely — never by spreading req.query directly." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MongodbFundamentals/FilteringSortingBasics"
        runCommand="node server.js"
        runPort={4132}
        steps={[
          {
            method: "POST",
            path: "/movies",
            body: JSON.stringify({ title: "The Matrix", genre: "Action", rating: 8.7, releaseYear: 1999 }, null, 2),
            expectStatus: 201,
            expectBody: '{"_id":"<a real ObjectId>","title":"The Matrix","genre":"Action","rating":8.7,"releaseYear":1999}',
            note: "Repeat with a few more movies (different genres/ratings/years) before trying the filters below.",
          },
          { method: "GET", path: "/movies?genre=Action", expectStatus: 200, expectBody: "A real array of only the movies whose genre is exactly \"Action\"." },
          { method: "GET", path: "/movies?minRating=8.8&sort=rating_desc", expectStatus: 200, expectBody: "A real array of movies rated 8.8 or higher, highest rating first." },
          { method: "GET", path: "/movies?sort=year_asc&limit=2&offset=1", expectStatus: 200, expectBody: "The 2nd and 3rd oldest real movies, oldest-first order, skipping the very oldest one." },
          { method: "DELETE", path: "/movies", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every movie, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Aggregation Basics: $group and the Pipeline",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "An Aggregation Is a Real, Ordered Pipeline of Stages",
              description: "Each stage takes the previous stage's real output and transforms it further — this section uses two: $group, then $sort.",
            },
            {
              label: "$group Runs Its Accumulators Once PER Bucket",
              description: "$sum, $avg, $min, and $max each collapse many real documents down into one real number, computed separately for every distinct _id value in the $group stage.",
              example: "_id: \"$category\" — one real summary document per category, not one for the whole collection.",
            },
            {
              label: "The Field Names in a Pipeline Stage Are Real, Not Arbitrary",
              description: "$sum: 1 counts documents; $sum: \"$amount\" adds up a real field's values — the leading $ is what tells MongoDB \"read this from the document,\" not \"this literal string.\"",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          Unlike Postgres, where COUNT(*) and SUM() on a NUMERIC column both come back as strings for precision
          safety, MongoDB&apos;s aggregation accumulators return real, plain JS numbers directly — nothing here needs
          a Number() conversion before it&apos;s safe to do real math with.
        </Callout>
        <p>
          The demo below seeds 5 real sales across 2 real categories, then asks for one real summary document per
          category — proving the real count, total, average, minimum, and maximum MongoDB itself computed.
        </p>
      </>
    ),
    extra: <AggregationPipelineDiagram />,
    filePointers: [
      { path: "examples/MongodbFundamentals/AggregationBasics/controllers/sales.controller.js", note: "The real $group pipeline — $sum/$avg/$min/$max, one document per category." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MongodbFundamentals/AggregationBasics"
        runCommand="node server.js"
        runPort={4133}
        steps={[
          {
            method: "POST",
            path: "/sales",
            body: JSON.stringify({ category: "Electronics", amount: 199.99 }, null, 2),
            expectStatus: 201,
            expectBody: '{"_id":"<a real ObjectId>","category":"Electronics","amount":199.99}',
            note: "Repeat with a couple more sales (mix of categories/amounts) before checking the summary.",
          },
          {
            method: "GET",
            path: "/sales/summary",
            expectStatus: 200,
            expectBody: 'A real array with one document per category, each shaped {"_id":"...","count":<number>,"total":<number>,"average":<number>,"min":<number>,"max":<number>} — all genuine numbers, not strings.',
          },
          { method: "DELETE", path: "/sales", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every sale, used to reset between runs' },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. The native mongodb driver is the foundation Mongoose (the next topic, &quot;Connecting Real
        Databases&quot;) is secretly generating calls to underneath — knowing it directly means you can read what an
        ODM produces, debug a slow aggregation, or work in a codebase that never adopted one. The single most
        important habit from this topic: a real filter object is built field by field from validated user input,
        never by trusting the raw shape of req.query — that&apos;s literally what prevents NoSQL injection, the same
        underlying lesson as Postgres&apos;s parameterized queries, wearing a different mechanism. And MongoDB&apos;s real
        JS types are usually exactly what you&apos;d guess — numbers stay numbers — except _id, which is always a real
        ObjectId that has to be explicitly constructed from a URL string, never assumed.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a real request arrives", "a controller builds a safe filter/document object", "the native driver sends the real operation to Atlas", "MongoDB runs it for real and returns real documents"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "MongoDB enforces nothing about a document's shape by default — validation (required fields, types) is either application-level code or an explicit $jsonSchema validator, not automatic like a SQL column type.",
            "A real filter object built from raw user input (find(req.query)) is a genuine NoSQL injection vector — a query-string value can be parsed into a real Mongo operator, not just a plain string.",
            "Every id-based route must construct a real ObjectId from a URL string before querying by _id — the conversion itself throws on a malformed string, so it needs a real try/catch.",
            "$group's accumulators ($sum/$avg/$min/$max) return real, plain JS numbers directly — unlike Postgres's NUMERIC/BIGINT columns, which come back as strings specifically to avoid precision loss.",
          ]}
        />
      </>
    ),
  },
];

export default function MongodbFundamentalsPage() {
  return (
    <StudyPage
      title="MongoDB Fundamentals"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro={"Real document-database basics against the actual MongoDB Atlas cluster this project already uses — no ODM yet. Real BSON field types and what JS type each one actually comes back as, real CRUD with the native driver (including the real ObjectId conversion every id-based route needs), real filtering/sorting/pagination built safely from query-string parameters, and a real $group aggregation pipeline. This is the ground floor \"Connecting Real Databases\" (the next Mongo-touching topic) builds Mongoose on top of."}
      sections={sections}
    />
  );
}
