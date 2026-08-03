import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import PgAdminCheck from "@/components/PgAdminCheck";
import DataTable from "@/components/DataTable";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function DataTypesDiagram() {
  const columns: { name: string; pgType: string; jsType: string; note: string; surprising?: boolean }[] = [
    { name: "id", pgType: "SERIAL (integer)", jsType: "number", note: "Small whole numbers come back as real JS numbers." },
    { name: "name", pgType: "TEXT", jsType: "string", note: "Plain text, no length limit." },
    { name: "price", pgType: "NUMERIC(10,2)", jsType: "string", note: "NOT a JS number — see below.", surprising: true },
    { name: "in_stock", pgType: "BOOLEAN", jsType: "boolean", note: "A real JS true/false." },
    { name: "created_at", pgType: "TIMESTAMP", jsType: "Date object", note: "A real JS Date, ready to format." },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real table, five real Postgres column types — what JS type each one actually comes back as</div>
      <div className="flex flex-col gap-2">
        {columns.map((col) => (
          <div
            key={col.name}
            className={`rounded-card border px-3 py-2 flex items-center gap-3 ${col.surprising ? "border-yellow-500 bg-yellow-500/5" : "border-border bg-surface-raised"}`}
          >
            <span className="font-mono text-xs font-semibold text-cyan-500 w-24 shrink-0">{col.name}</span>
            <span className="font-mono text-xs text-body w-36 shrink-0">{col.pgType}</span>
            <span className="text-body text-xs">→</span>
            <span className={`font-mono text-xs font-semibold w-24 shrink-0 ${col.surprising ? "text-yellow-500" : "text-green-500"}`}>{col.jsType}</span>
            <span className="text-body text-xs leading-relaxed">{col.note}</span>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">A NUMERIC column comes back as a STRING on purpose — a JS number can silently lose precision on some real decimal values, so the pg driver never risks it for you.</span>
      </div>
      <div className="mt-4">
        <DataTable
          accentKey="orange"
          caption='The real "products" table — one real row, exactly as the pg driver hands it back'
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
            { key: "price", label: "price" },
            { key: "in_stock", label: "in_stock" },
            { key: "created_at", label: "created_at" },
          ]}
          rows={[{ id: 1, name: "Test via Postman", price: '"12.50" (string)', in_stock: "true", created_at: "2026-07-30 10:15:00" }]}
        />
      </div>
    </div>
  );
}

function ParameterizedQueryDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two ways to put a real value into a query — only one is safe</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">✗ String-built (never do this)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`\`SELECT * FROM books WHERE title = '${"${req.query.title}"}'\``}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">A title like <span className="font-mono">x&apos; OR &apos;1&apos;=&apos;1</span> gets read as real SQL — this returns EVERY row, not zero.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">✓ Parameterized (what every route here does)</div>
          <div className="font-mono text-[11px] text-body leading-relaxed break-all">{`\`SELECT * FROM books WHERE title = $1\`, [title]`}</div>
          <div className="text-body text-xs leading-relaxed mt-1.5">pg sends the value to Postgres SEPARATELY from the query text — it can never be read as part of the SQL itself.</div>
        </div>
      </div>
      <div className="mt-4">
        <DataTable
          accentKey="blue"
          caption='The real "books" table — after a real CREATE and one real UPDATE'
          columns={[
            { key: "id", label: "id" },
            { key: "title", label: "title" },
            { key: "author", label: "author" },
            { key: "published_year", label: "published_year" },
          ]}
          rows={[{ id: 1, title: "Clean Code (2nd read)", author: "Robert C. Martin", published_year: 2008 }]}
        />
      </div>
    </div>
  );
}

function FilterSortPaginateDiagram() {
  const pieces: { param: string; sql: string; note: string }[] = [
    { param: "?genre=Action", sql: "WHERE genre = $1", note: "A real value → a real placeholder." },
    { param: "?minRating=8.8", sql: "AND rating >= $2", note: "Each present filter adds one more condition." },
    { param: "?sort=rating_desc", sql: "ORDER BY rating DESC", note: "Looked up from a fixed, trusted list — never the raw query string." },
    { param: "?limit=2&offset=1", sql: "LIMIT $3 OFFSET $4", note: "Skips the first result, then takes the next 2." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">How one real query string builds one real SQL query, piece by piece</div>
      <div className="flex flex-col gap-2">
        {pieces.map((p) => (
          <div key={p.param} className="rounded-card border border-border bg-surface-raised px-3 py-2 flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs font-semibold text-purple-400 shrink-0">{p.param}</span>
            <span className="text-body text-xs">→</span>
            <span className="font-mono text-xs text-cyan-500 shrink-0">{p.sql}</span>
            <span className="text-body text-xs leading-relaxed">{p.note}</span>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">A column name or ASC/DESC can&apos;t be a $1 placeholder — only real VALUES can. That&apos;s why sort picks from a fixed list instead of using req.query.sort directly.</span>
      </div>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="purple"
          caption='The real "movies" table — every row currently seeded'
          columns={[
            { key: "id", label: "id" },
            { key: "title", label: "title" },
            { key: "genre", label: "genre" },
            { key: "rating", label: "rating" },
            { key: "release_year", label: "release_year" },
          ]}
          rows={[
            { id: 1, title: "The Matrix", genre: "Action", rating: "8.7", release_year: 1999 },
            { id: 2, title: "Inception", genre: "Action", rating: "8.8", release_year: 2010 },
            { id: 3, title: "The Notebook", genre: "Romance", rating: "7.8", release_year: 2004 },
          ]}
        />
      </div>
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT * FROM movies
WHERE genre = $1
ORDER BY rating DESC
-- $1 = 'Action', built from ?genre=Action&sort=rating_desc`}
      </pre>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="cyan"
          caption="?genre=Action&sort=rating_desc — the real filtered + sorted result"
          columns={[
            { key: "title", label: "title" },
            { key: "genre", label: "genre" },
            { key: "rating", label: "rating" },
          ]}
          rows={[
            { title: "Inception", genre: "Action", rating: "8.8" },
            { title: "The Matrix", genre: "Action", rating: "8.7" },
          ]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">The Notebook is filtered out entirely (wrong genre) — the two Action movies that remain come back highest-rating-first, exactly matching ORDER BY rating DESC.</span>
      </div>
    </div>
  );
}

function AggregateFunctionsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">GROUP BY splits rows into buckets — each bucket collapses into ONE summary row</div>
      <DataTable
        accentKey="cyan"
        caption="5 real rows, before GROUP BY"
        columns={[
          { key: "category", label: "category" },
          { key: "amount", label: "amount" },
        ]}
        rows={[
          { category: "Electronics", amount: "199.99" },
          { category: "Electronics", amount: "49.50" },
          { category: "Electronics", amount: "899.00" },
          { category: "Books", amount: "14.99" },
          { category: "Books", amount: "22.50" },
        ]}
      />
      <pre className="font-mono text-[11px] text-green-500 bg-green-500/10 border border-green-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT category,
       COUNT(*) AS count,
       SUM(amount) AS total
FROM sales
GROUP BY category`}
      </pre>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="green"
          caption="2 real rows, after GROUP BY category"
          columns={[
            { key: "category", label: "category" },
            { key: "count", label: "count" },
            { key: "total", label: "total" },
          ]}
          rows={[
            { category: "Electronics", count: 3, total: "1148.49" },
            { category: "Books", count: 2, total: "37.49" },
          ]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">COUNT(*) is a BIGINT under the hood — it comes back as a STRING too, for the exact same precision reason as a NUMERIC column.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Connecting to Postgres & Real Data Types",
    body: (
      <>
        <p>
          Normally, a list of products would just be a JS array of objects — real while the process is running, gone
          the moment it restarts. A <strong>database</strong> is simply a place that stores that same data
          permanently, on a real server, even after every process using it stops and starts again. Inside a
          database, data lives in <strong>tables</strong>, and a table looks exactly like a spreadsheet: real rows
          (one per product) and real columns (<span className="font-mono text-xs">name</span>,{" "}
          <span className="font-mono text-xs">price</span>, <span className="font-mono text-xs">in_stock</span>...).
          <strong>SQL</strong> (Structured Query Language) is the language you use to talk to that table — plain
          enough to read almost like English: &quot;give me every product,&quot; &quot;give me only the ones in
          stock.&quot; Everything below is that same idea made real: a genuine table, on the genuine Coolify server
          this whole project already uses, reached through genuine SQL you write yourself.
        </p>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "No ORM Yet, on Purpose",
              description: "Every topic from here through \"PostgreSQL Advanced Querying\" builds on real SQL you write yourself, with Node's raw \"pg\" driver — before \"Connecting Real Databases\" introduces Prisma on top of it.",
            },
            {
              label: "A Schema Is Just a Namespace",
              description: "This mini-project's own dedicated schema, \"node_express_learning_pg_fund_types\", is a fresh folder-like space for its one table — kept apart from every other mini-project sharing this same real server.",
              example: "CREATE SCHEMA IF NOT EXISTS node_express_learning_pg_fund_types;",
            },
            {
              label: "A Table Declares Real Column Types",
              description: "Postgres enforces these for real — a TEXT column rejects a number, a BOOLEAN rejects anything that isn't true/false.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Postgres enforces a real column type on every single write — but the JS type you get back isn&apos;t always
          what you&apos;d guess. A NUMERIC column comes back as a STRING from the raw pg driver, specifically so a
          real decimal value never silently loses precision by being forced through a JS floating-point number.
        </Callout>
        <p>
          The demo below creates a real table with five different real column types, asks Postgres&apos;s own system
          catalog what those types actually are, then inserts and reads back a real row — proving exactly what JS
          type each column comes back as, not just describing it.
        </p>
      </>
    ),
    extra: <DataTypesDiagram />,
    filePointers: [
      { path: "examples/PostgresqlFundamentals/PostgresConnectionAndTypes/setup.js", note: "Run once (npm run setup) — creates the real schema and the real \"products\" table." },
      { path: "examples/PostgresqlFundamentals/PostgresConnectionAndTypes/db.js", note: "The real connection pool and this mini-project's dedicated schema name." },
      { path: "examples/PostgresqlFundamentals/PostgresConnectionAndTypes/controllers/products.controller.js", note: "The only file that runs real SQL — routes never touch the database directly." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlFundamentals/PostgresConnectionAndTypes"
        runCommand="node server.js"
        runPort={4126}
        steps={[
          { method: "GET", path: "/products/columns", expectStatus: 200, expectBody: '[{"column_name":"id","data_type":"integer"},{"column_name":"name","data_type":"text"},{"column_name":"price","data_type":"numeric"},{"column_name":"in_stock","data_type":"boolean"},{"column_name":"created_at","data_type":"timestamp without time zone"}]' },
          {
            method: "POST",
            path: "/products",
            body: JSON.stringify({ name: "Test via Postman", price: 12.5, inStock: true }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"name":"Test via Postman","price":"12.50","in_stock":true,"created_at":"<a real timestamp>"}',
            note: "Notice price comes back quoted — a real string, not a number.",
          },
          { method: "GET", path: "/products", expectStatus: 200, expectBody: "A real array containing every product currently in the table." },
          { method: "DELETE", path: "/products", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every product, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_fund_types"
        table="products"
        queries={[
          {
            label: "Insert a real row yourself",
            sql: "INSERT INTO node_express_learning_pg_fund_types.products (name, price, in_stock)\nVALUES ('pgAdmin4 Test', 24.99, true)\nRETURNING *;",
            expect: "One real row back, with a real auto-generated id and created_at — Postgres itself just ran this, not the Express API.",
          },
          {
            label: "See every real row in the table",
            sql: "SELECT * FROM node_express_learning_pg_fund_types.products ORDER BY id;",
            expect: "Every row currently in the real table, including the one you just inserted above.",
          },
          {
            label: "See the real column types, straight from Postgres",
            sql: "SELECT column_name, data_type\nFROM information_schema.columns\nWHERE table_schema = 'node_express_learning_pg_fund_types' AND table_name = 'products'\nORDER BY ordinal_position;",
            expect: "The same 5 real types the live demo above already proved: integer, text, numeric, boolean, timestamp without time zone.",
          },
          {
            label: "Clean up your test row",
            sql: "DELETE FROM node_express_learning_pg_fund_types.products WHERE name = 'pgAdmin4 Test';",
            note: "Optional — the automated demo above cleans up its own rows on its own next run either way.",
            expect: "The row you inserted is gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Basic CRUD via Raw SQL",
    body: (
      <>
        <p>
          In plain English: <strong>SELECT</strong> means &quot;show me.&quot; <strong>INSERT</strong> means
          &quot;add a new row.&quot; <strong>UPDATE</strong> means &quot;change an existing row.&quot;{" "}
          <strong>DELETE</strong> means &quot;remove a row.&quot; Right after SELECT, you name exactly which real
          columns you want back — <span className="font-mono text-xs">*</span> means &quot;every column,&quot; or you
          can name one (or several, comma-separated) and only those come back. It is still the exact same rows either
          way — nothing about which books exist changes, only how many columns come back per row.
        </p>
        <p>
          Since JS is already familiar ground: <span className="font-mono text-xs">SELECT title FROM books</span> is
          the same idea as{" "}
          <span className="font-mono text-xs">books.map(b =&gt; ({"{"} title: b.title {"}"}))</span> — loop over
          every row, and from each one, keep only the <span className="font-mono text-xs">title</span> property.
        </p>
        <div className="flex flex-wrap items-start gap-4 my-3">
          <DataTable
            accentKey="blue"
            caption="The real table — 4 columns, 3 rows"
            columns={[
              { key: "id", label: "id" },
              { key: "title", label: "title" },
              { key: "author", label: "author" },
              { key: "published_year", label: "published_year" },
            ]}
            rows={[
              { id: 33, title: "Atomic Habits", author: "James Clear", published_year: 2018 },
              { id: 34, title: "Deep Work", author: "Cal Newport", published_year: 2016 },
              { id: 35, title: "Clean Code", author: "Robert C. Martin", published_year: 2008 },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div>
            <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap mb-2">
{`SELECT * FROM books -- keep all 4 columns`}
            </pre>
            <DataTable
              accentKey="blue"
              caption="Same 3 rows — every column kept"
              columns={[
                { key: "id", label: "id" },
                { key: "title", label: "title" },
                { key: "author", label: "author" },
                { key: "published_year", label: "published_year" },
              ]}
              rows={[
                { id: 33, title: "Atomic Habits", author: "James Clear", published_year: 2018 },
                { id: 34, title: "Deep Work", author: "Cal Newport", published_year: 2016 },
                { id: 35, title: "Clean Code", author: "Robert C. Martin", published_year: 2008 },
              ]}
            />
          </div>
          <div>
            <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap mb-2">
{`SELECT title FROM books -- keep ONLY title, drop id/author/published_year`}
            </pre>
            <DataTable
              accentKey="blue"
              caption="Same 3 rows — only title kept"
              columns={[{ key: "title", label: "title" }]}
              rows={[{ title: "Atomic Habits" }, { title: "Deep Work" }, { title: "Clean Code" }]}
            />
          </div>
        </div>
        <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-1 mb-3 text-center">
          <span className="text-yellow-500 text-xs">Both queries return the same 3 real books — Atomic Habits, Deep Work, Clean Code. Only the number of columns per row changed, because that is the only thing that changed between the two queries.</span>
        </div>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "The Four Real Operations",
              description: "INSERT (create), SELECT (read), UPDATE, and DELETE — written by hand this time, no ORM translating them for you.",
            },
            {
              label: "$1, $2, $3 Are Placeholders, Not Text",
              description: "Every real value from a request goes in through a numbered placeholder. pg sends it to Postgres separately from the query text itself.",
              example: "pool.query('INSERT INTO books (title) VALUES ($1)', [title])",
            },
            {
              label: "Why This Matters: SQL Injection",
              description: "Gluing a request value straight into a query string lets an attacker's text get read as real SQL. Placeholders make that impossible, by construction.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          A parameterized query isn&apos;t just tidier — it&apos;s the actual mechanism that keeps a request value from
          ever being interpreted as part of the SQL itself. Every real backend route that touches a database uses
          this pattern by default, not just when a topic happens to be about security.
        </Callout>
        <p>
          The demo below runs a full CREATE → READ ONE → READ ALL → UPDATE → DELETE cycle against a real
          &quot;books&quot; table, then proves a 404 is real too by reading the same id again after it&apos;s gone.
        </p>
      </>
    ),
    extra: <ParameterizedQueryDiagram />,
    filePointers: [
      { path: "examples/PostgresqlFundamentals/RawSqlCrud/setup.js", note: "Run once (npm run setup) — creates the real schema and the real \"books\" table." },
      { path: "examples/PostgresqlFundamentals/RawSqlCrud/controllers/books.controller.js", note: "Every real INSERT/SELECT/UPDATE/DELETE, all parameterized — plus the one mistake this whole section warns about, kept ONLY as a comment, never actually run." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlFundamentals/RawSqlCrud"
        runCommand="node server.js"
        runPort={4127}
        steps={[
          {
            method: "POST",
            path: "/books",
            body: JSON.stringify({ title: "Clean Code", author: "Robert C. Martin", publishedYear: 2008 }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"title":"Clean Code","author":"Robert C. Martin","published_year":2008}',
          },
          { method: "GET", path: "/books/1", expectStatus: 200, expectBody: '{"id":1,"title":"Clean Code","author":"Robert C. Martin","published_year":2008}', note: "Use whatever real id the POST above actually returned." },
          { method: "GET", path: "/books", expectStatus: 200, expectBody: "A real array containing every book currently in the table." },
          {
            method: "PATCH",
            path: "/books/1",
            body: JSON.stringify({ title: "Clean Code (2nd read)", author: "Robert C. Martin", publishedYear: 2008 }, null, 2),
            expectStatus: 200,
            expectBody: '{"id":1,"title":"Clean Code (2nd read)","author":"Robert C. Martin","published_year":2008}',
            note: "Use the same real id.",
          },
          { method: "DELETE", path: "/books/1", expectStatus: 200, expectBody: '{"id":1,"title":"Clean Code (2nd read)","author":"Robert C. Martin","published_year":2008}', note: "Use the same real id." },
          { method: "GET", path: "/books/1", expectStatus: 404, expectBody: '{"error":"No book with that id."}', note: "Same id, right after deleting it." },
          { method: "DELETE", path: "/books", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every book, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_fund_crud"
        table="books"
        queries={[
          {
            label: "Insert a real row yourself",
            sql: "INSERT INTO node_express_learning_pg_fund_crud.books (title, author, published_year)\nVALUES ('pgAdmin4 Test Book', 'Your Name', 2026)\nRETURNING *;",
            expect: "One real row back, with a real auto-generated id.",
          },
          {
            label: "See every real row in the table",
            sql: "SELECT * FROM node_express_learning_pg_fund_crud.books ORDER BY id;",
            expect: "Every book currently in the real table.",
          },
          {
            label: "Update it directly",
            sql: "UPDATE node_express_learning_pg_fund_crud.books\nSET title = 'Updated via pgAdmin4'\nWHERE title = 'pgAdmin4 Test Book'\nRETURNING *;",
            expect: "The same row, with its title changed — the exact same real UPDATE the API's PATCH route runs underneath.",
          },
          {
            label: "Clean up your test row",
            sql: "DELETE FROM node_express_learning_pg_fund_crud.books WHERE title = 'Updated via pgAdmin4';",
            expect: "The row you inserted is gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Filtering, Sorting & Pagination Basics",
    body: (
      <>
        <p>
          Now imagine this table has 50,000 movies in it, not 3. You almost never want all 50,000 back — you want
          only the ones that match something specific: only Action movies, only movies rated 8.8 or higher. That is
          exactly what <strong>WHERE</strong> does. In plain English, WHERE means &quot;only show rows that satisfy
          this condition&quot; — it filters, it never adds or changes anything.
        </p>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "WHERE Filters Which Rows Come Back",
              description: "Only rows matching every real condition are included — each condition is built from a real, present query-string parameter.",
            },
            {
              label: "ORDER BY Controls the Order",
              description: "Picked from a small, fixed list of allowed sort options — never straight from the raw query string.",
            },
            {
              label: "LIMIT & OFFSET Are Pagination's Two Real Numbers",
              description: "LIMIT caps how many rows come back. OFFSET skips a real number of rows before starting to collect them.",
              example: "?sort=year_asc&limit=2&offset=1 — skip the oldest, take the next 2.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          A real filter/sort/paginate endpoint is built by turning present query-string parameters into real SQL
          pieces one at a time — values become $N placeholders, but a column name or sort direction has to come from
          a fixed, trusted list instead, since it can&apos;t be parameterized the same way.
        </Callout>
        <p>
          The demo below seeds 5 real movies, then runs the same real endpoint with different combinations of
          filters, sorting, and pagination — proving each one changes exactly the rows and order you&apos;d expect.
        </p>
      </>
    ),
    extra: <FilterSortPaginateDiagram />,
    filePointers: [
      { path: "examples/PostgresqlFundamentals/FilteringSortingBasics/controllers/movies.controller.js", note: "Builds a real WHERE/ORDER BY/LIMIT/OFFSET query from real query-string parameters, safely." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlFundamentals/FilteringSortingBasics"
        runCommand="node server.js"
        runPort={4128}
        steps={[
          {
            method: "POST",
            path: "/movies",
            body: JSON.stringify({ title: "The Matrix", genre: "Action", rating: 8.7, releaseYear: 1999 }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"title":"The Matrix","genre":"Action","rating":"8.7","release_year":1999}',
            note: "Repeat with a few more movies (different genres/ratings/years) before trying the filters below.",
          },
          { method: "GET", path: "/movies?genre=Action", expectStatus: 200, expectBody: "A real array of only the movies whose genre is exactly \"Action\"." },
          { method: "GET", path: "/movies?minRating=8.8&sort=rating_desc", expectStatus: 200, expectBody: "A real array of movies rated 8.8 or higher, highest rating first." },
          { method: "GET", path: "/movies?sort=year_asc&limit=2&offset=1", expectStatus: 200, expectBody: "The 2nd and 3rd oldest real movies, oldest-first order, skipping the very oldest one." },
          { method: "DELETE", path: "/movies", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every movie, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_fund_filter"
        table="movies"
        queries={[
          {
            label: "Insert a real row yourself",
            sql: "INSERT INTO node_express_learning_pg_fund_filter.movies (title, genre, rating, release_year)\nVALUES ('pgAdmin4 Test Movie', 'Action', 9.0, 2020)\nRETURNING *;",
            expect: "One real row back, with a real auto-generated id.",
          },
          {
            label: "Run the exact same real filter the API's ?genre= does",
            sql: "SELECT * FROM node_express_learning_pg_fund_filter.movies\nWHERE genre = 'Action'\nORDER BY rating DESC;",
            expect: "Every Action movie currently in the table, including the one you just inserted, highest rating first.",
          },
          {
            label: "Clean up your test row",
            sql: "DELETE FROM node_express_learning_pg_fund_filter.movies WHERE title = 'pgAdmin4 Test Movie';",
            expect: "The row you inserted is gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Aggregate Functions & GROUP BY Basics",
    body: (
      <>
        <p>
          Suppose your boss asks: &quot;how much did we sell, per category?&quot; Not every individual sale one at a
          time — grouped by category. In plain English, <strong>GROUP BY</strong> means &quot;put similar rows into
          buckets, then run one summary per bucket&quot; — every row with the same category value lands in the same
          bucket, and everything after GROUP BY (COUNT, SUM, AVG...) runs once per bucket instead of once overall.
        </p>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Five Real Aggregate Functions",
              description: "COUNT, SUM, AVG, MIN, and MAX each collapse many real rows down into one real number.",
            },
            {
              label: "GROUP BY Runs Them Once PER Bucket",
              description: "Without GROUP BY, an aggregate collapses the WHOLE table into one row. With it, rows are split into buckets by a real column first, and each bucket gets its own real summary row.",
              example: "GROUP BY category — one real summary row per category, not one for the whole table.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          COUNT(*) is a BIGINT under the hood in Postgres, so — like a NUMERIC column — it comes back as a real
          STRING from the pg driver too, for the exact same reason: a count that gets genuinely huge could otherwise
          silently lose precision as a plain JS number.
        </Callout>
        <p>
          The demo below seeds 5 real sales across 2 real categories, then asks for one real summary row per
          category — proving the real count, total, average, minimum, and maximum Postgres itself computed.
        </p>
      </>
    ),
    extra: <AggregateFunctionsDiagram />,
    filePointers: [
      { path: "examples/PostgresqlFundamentals/AggregateFunctionsBasics/controllers/sales.controller.js", note: "The real GROUP BY query — COUNT/SUM/AVG/MIN/MAX, one row per category." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlFundamentals/AggregateFunctionsBasics"
        runCommand="node server.js"
        runPort={4129}
        steps={[
          {
            method: "POST",
            path: "/sales",
            body: JSON.stringify({ category: "Electronics", amount: 199.99 }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"category":"Electronics","amount":"199.99"}',
            note: "Repeat with a couple more sales (mix of categories/amounts) before checking the summary.",
          },
          {
            method: "GET",
            path: "/sales/summary",
            expectStatus: 200,
            expectBody: 'A real array with one row per category, each shaped {"category":"...","count":"<string>","total":"<string>","average":"<string>","min":"<string>","max":"<string>"}.',
          },
          { method: "DELETE", path: "/sales", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every sale, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_fund_aggregate"
        table="sales"
        queries={[
          {
            label: "Insert 2 real rows in the same category",
            sql: "INSERT INTO node_express_learning_pg_fund_aggregate.sales (category, amount) VALUES\n  ('pgAdmin4Test', 10.00),\n  ('pgAdmin4Test', 20.00);",
            note: "Run this once — it inserts both rows in a single statement.",
            expect: "2 real rows inserted, both in the same category.",
          },
          {
            label: "Run the exact same real GROUP BY the API's /sales/summary uses",
            sql: "SELECT category, COUNT(*) AS count, SUM(amount) AS total, AVG(amount) AS average, MIN(amount) AS min, MAX(amount) AS max\nFROM node_express_learning_pg_fund_aggregate.sales\nGROUP BY category\nORDER BY category;",
            expect: "One real summary row for \"pgAdmin4Test\": count 2, total 30.00, average 15.00, min 10.00, max 20.00.",
          },
          {
            label: "Clean up your test rows",
            sql: "DELETE FROM node_express_learning_pg_fund_aggregate.sales WHERE category = 'pgAdmin4Test';",
            expect: "Both rows you inserted are gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Real SQL, written by hand, is the foundation every ORM in this project (Prisma included) is
        secretly generating underneath — knowing it directly means you can read what an ORM produces, debug a slow
        query, or work in a codebase that never adopted an ORM at all. The single most important habit from this
        topic: every real VALUE from a request goes in through a $1/$2 placeholder, never glued into the query
        string — that&apos;s literally what prevents SQL injection, not just a style preference. And the pg driver&apos;s
        JS types aren&apos;t always what you&apos;d guess: NUMERIC and COUNT(*) both come back as strings, on purpose, to
        protect against precision loss a plain JS number can&apos;t always avoid.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a real request arrives", "a controller builds a parameterized SQL string", "pg sends the query text and the real values separately", "Postgres runs it for real and returns real rows"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "A parameterized query ($1/$2 placeholders) is what actually prevents SQL injection — the database never treats a request value as part of the query's own structure.",
            "A column name, table name, or sort direction can't be parameterized the same way values can — the safe pattern is picking from a small, fixed, trusted list, never interpolating raw user input.",
            "node-postgres returns NUMERIC and BIGINT/COUNT(*) columns as strings, not JS numbers, specifically to avoid silent precision loss on values a JS float can't represent exactly.",
            "GROUP BY splits rows into buckets by a column's value, then runs an aggregate (COUNT/SUM/AVG/MIN/MAX) once per bucket — without it, an aggregate collapses the whole table into a single row.",
          ]}
        />
      </>
    ),
  },
];

export default function PostgresqlFundamentalsPage() {
  return (
    <StudyPage
      title="PostgreSQL Fundamentals"
      stageLabel="Stage C — Data Layer"
      stageColor="orange"
      intro={'Real SQL, written by hand, against the actual Coolify Postgres server this project already uses — no ORM yet. Real data types and what JS type each one actually comes back as, real parameterized CRUD, real filtering/sorting/pagination from query-string parameters, and real GROUP BY aggregates. This is the ground floor "Connecting Real Databases" (the next topic) builds Prisma on top of.'}
      sections={sections}
    />
  );
}
