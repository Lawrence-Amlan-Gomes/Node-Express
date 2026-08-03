import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import PgAdminCheck from "@/components/PgAdminCheck";
import DataTable from "@/components/DataTable";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md. Every source table
// is shown BEFORE the result table(s), with the real SQL query in between,
// per the DataTable standing rule for JOINs.

function PrimaryForeignKeysDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real, related tables — orders.customer_id points at customers.id</div>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="orange"
          caption="customers — id is the PRIMARY KEY"
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
          ]}
          rows={[{ id: 1, name: "Lawrence" }]}
        />
        <DataTable
          accentKey="orange"
          caption="orders — customer_id is the FOREIGN KEY"
          columns={[
            { key: "id", label: "id" },
            { key: "customer_id", label: "customer_id" },
            { key: "product", label: "product" },
          ]}
          rows={[{ id: 1, customer_id: 1, product: "Laptop" }]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">orders.customer_id = 1 points at customers.id = 1 — the same real customer id CAN appear on many orders, but customers.id itself can never repeat.</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">✓ POST /orders {"{"}customerId: 1{"}"}</div>
          <div className="text-body text-xs leading-relaxed">customer 1 is real — Postgres accepts the new order.</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">✗ POST /orders {"{"}customerId: 999{"}"}</div>
          <div className="text-body text-xs leading-relaxed">no customer 999 exists — Postgres itself refuses the row, real error code 23503.</div>
        </div>
      </div>
    </div>
  );
}

function InnerLeftJoinDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same 2 real tables, 2 real queries — a JOIN keeps only matches, a LEFT JOIN keeps everything on the left</div>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="blue"
          caption="customers"
          columns={[{ key: "id", label: "id" }, { key: "name", label: "name" }]}
          rows={[{ id: 1, name: "Ava" }, { id: 2, name: "Bo" }, { id: 3, name: "Cleo" }]}
        />
        <DataTable
          accentKey="blue"
          caption="orders"
          columns={[{ key: "id", label: "id" }, { key: "customer_id", label: "customer_id" }, { key: "product", label: "product" }]}
          rows={[
            { id: 1, customer_id: 1, product: "Laptop" },
            { id: 2, customer_id: 1, product: "Mouse" },
            { id: 3, customer_id: 2, product: "Phone" },
          ]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Cleo has zero real orders — watch what each query below does with her.</span>
      </div>
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT customers.name, orders.product
FROM customers
JOIN orders ON customers.id = orders.customer_id -- INNER JOIN: only rows with a real match on BOTH sides`}
      </pre>
      <DataTable
        accentKey="green"
        caption="INNER JOIN result — Cleo is gone entirely"
        columns={[{ key: "name", label: "name" }, { key: "product", label: "product" }]}
        rows={[{ name: "Ava", product: "Laptop" }, { name: "Ava", product: "Mouse" }, { name: "Bo", product: "Phone" }]}
      />
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT customers.name, orders.product
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id -- LEFT JOIN: keep EVERY row from customers, matched or not`}
      </pre>
      <DataTable
        accentKey="cyan"
        caption="LEFT JOIN result — Cleo stays, product is null"
        columns={[{ key: "name", label: "name" }, { key: "product", label: "product" }]}
        rows={[{ name: "Ava", product: "Laptop" }, { name: "Ava", product: "Mouse" }, { name: "Bo", product: "Phone" }, { name: "Cleo", product: "null" }]}
      />
    </div>
  );
}

function RightFullOuterJoinDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same idea, flipped and doubled — RIGHT JOIN mirrors LEFT, FULL OUTER JOIN loses nothing from either side</div>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="purple"
          caption="orders — one is a real guest order, customer_id is null"
          columns={[{ key: "id", label: "id" }, { key: "customer_id", label: "customer_id" }, { key: "product", label: "product" }]}
          rows={[
            { id: 1, customer_id: 1, product: "Headphones" },
            { id: 2, customer_id: 2, product: "Monitor" },
            { id: 3, customer_id: "null", product: "Gift Card" },
          ]}
        />
        <DataTable
          accentKey="purple"
          caption="customers — Fiona has zero real orders"
          columns={[{ key: "id", label: "id" }, { key: "name", label: "name" }]}
          rows={[{ id: 1, name: "Diana" }, { id: 2, name: "Ethan" }, { id: 3, name: "Fiona" }]}
        />
      </div>
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT orders.product, customers.name
FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.id -- keep EVERY row from customers (the table on the right)`}
      </pre>
      <DataTable
        accentKey="green"
        caption="RIGHT JOIN result — the Gift Card guest order is gone, Fiona stays"
        columns={[{ key: "product", label: "product" }, { key: "name", label: "name" }]}
        rows={[{ product: "Headphones", name: "Diana" }, { product: "Monitor", name: "Ethan" }, { product: "null", name: "Fiona" }]}
      />
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT orders.product, customers.name
FROM orders
FULL OUTER JOIN customers ON orders.customer_id = customers.id -- keep EVERY row from BOTH tables`}
      </pre>
      <DataTable
        accentKey="cyan"
        caption="FULL OUTER JOIN result — the Gift Card order is back, name is null"
        columns={[{ key: "product", label: "product" }, { key: "name", label: "name" }]}
        rows={[
          { product: "Headphones", name: "Diana" },
          { product: "Monitor", name: "Ethan" },
          { product: "null", name: "Fiona" },
          { product: "Gift Card", name: "null" },
        ]}
      />
    </div>
  );
}

function SubqueriesDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real inner query, run first by Postgres itself — then the outer query uses its answer</div>
      <div className="flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="cyan"
          caption="customers"
          columns={[{ key: "id", label: "id" }, { key: "name", label: "name" }]}
          rows={[{ id: 1, name: "Grace" }, { id: 2, name: "Henry" }, { id: 3, name: "Ivy" }]}
        />
        <DataTable
          accentKey="cyan"
          caption="orders"
          columns={[{ key: "id", label: "id" }, { key: "customer_id", label: "customer_id" }, { key: "amount", label: "amount" }]}
          rows={[
            { id: 1, customer_id: 1, amount: "50.00" },
            { id: 2, customer_id: 1, amount: "200.00" },
            { id: 3, customer_id: 2, amount: "30.00" },
            { id: 4, customer_id: 3, amount: "150.00" },
          ]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">The average of 50, 200, 30, 150 is 107.50 — that real number is what the scalar subquery below computes, entirely inside Postgres.</span>
      </div>
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders) -- a SCALAR subquery: the inner query returns exactly ONE number`}
      </pre>
      <DataTable
        accentKey="green"
        caption="Result — only the 2 real orders above 107.50"
        columns={[{ key: "id", label: "id" }, { key: "customer_id", label: "customer_id" }, { key: "amount", label: "amount" }]}
        rows={[{ id: 2, customer_id: 1, amount: "200.00" }, { id: 4, customer_id: 3, amount: "150.00" }]}
      />
      <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap my-3">
{`SELECT * FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE amount > 100) -- a LIST subquery: the inner query returns many real rows`}
      </pre>
      <DataTable
        accentKey="green"
        caption="Result — Grace and Ivy each placed a real order over $100, Henry never did"
        columns={[{ key: "id", label: "id" }, { key: "name", label: "name" }]}
        rows={[{ id: 1, name: "Grace" }, { id: 3, name: "Ivy" }]}
      />
    </div>
  );
}

function ConstraintsDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">4 real constraints, 4 real Postgres rejections — none of this is application code checking anything</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">ON DELETE RESTRICT</div>
          <div className="text-body text-xs leading-relaxed mb-1.5">DELETE a customer who still has a real order pointing at them:</div>
          <div className="font-mono text-[11px] text-red-500">409 — &quot;a real order still points at it (ON DELETE RESTRICT)&quot;</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">ON DELETE CASCADE</div>
          <div className="text-body text-xs leading-relaxed mb-1.5">DELETE a customer on the OTHER table pair, set up with CASCADE instead:</div>
          <div className="font-mono text-[11px] text-green-500">200 — customer deleted, AND their order is auto-deleted too</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">CHECK (price &gt; 0)</div>
          <div className="text-body text-xs leading-relaxed mb-1.5">POST a product with price: -5:</div>
          <div className="font-mono text-[11px] text-red-500">400 — &quot;price must be greater than 0&quot;</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">UNIQUE (name)</div>
          <div className="text-body text-xs leading-relaxed mb-1.5">POST a second product named &quot;Desk Lamp&quot;:</div>
          <div className="font-mono text-[11px] text-red-500">409 — &quot;already exists&quot;</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Every one of these 4 rejections came from Postgres itself (real error codes 23503/23514/23505) — the Express code below only catches and re-labels them, it never re-implements the rule.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Primary Keys & Foreign Keys: Why Data Lives in Multiple Tables",
    body: (
      <>
        <p>
          Imagine storing &quot;Lawrence bought a Laptop&quot; as one row that repeats the customer&apos;s full name
          on every single order. If Lawrence ever changes his name, every one of those rows now needs updating —
          miss even one, and the data disagrees with itself. That is exactly why real databases split related data
          into separate tables instead, and two special kinds of column are what make splitting the data possible
          without losing the connection between the pieces.
        </p>
        <p>
          In plain English: a <strong>PRIMARY KEY</strong> is a column that uniquely identifies each row — no two
          rows can ever share one, the same way no two people share a passport number. A{" "}
          <strong>FOREIGN KEY</strong> is a column that points at another table&apos;s primary key — unlike a
          primary key, it CAN repeat, since one real customer can place many real orders.
        </p>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Primary Key — Uniquely Identifies a Row",
              description: "customers.id, made with SERIAL PRIMARY KEY — it counts up by itself, and Postgres guarantees no two rows can ever share one.",
            },
            {
              label: "Foreign Key — Points at Another Table's Primary Key",
              description: "orders.customer_id must match a real id already in customers — declared with REFERENCES.",
              example: "customer_id INTEGER NOT NULL REFERENCES customers(id)",
            },
            {
              label: "Postgres Enforces It For Real",
              description: "An INSERT with a customer_id that doesn't exist is genuinely rejected by the database itself — not just checked by application code that could be skipped or buggy.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          A foreign key is what keeps two related tables honest — Postgres itself refuses to let a child row point
          at a parent that doesn&apos;t exist, so &quot;orphaned&quot; data is structurally impossible here, not just
          discouraged by convention.
        </Callout>
        <p>
          The demo below creates a real customer, attaches a real order to them, then tries the same thing with a
          customer id that was never created — proving the second attempt is genuinely rejected by Postgres, not
          silently allowed through.
        </p>
      </>
    ),
    extra: <PrimaryForeignKeysDiagram />,
    filePointers: [
      { path: "examples/PostgresqlRelationalQuerying/PrimaryKeysForeignKeys/setup.js", note: "Run once (npm run setup) — creates the real schema and the real customers/orders tables, with the real REFERENCES foreign key." },
      { path: "examples/PostgresqlRelationalQuerying/PrimaryKeysForeignKeys/controllers/orders.controller.js", note: "Catches Postgres's own real error code 23503 (foreign_key_violation) and turns it into a clean 400." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlRelationalQuerying/PrimaryKeysForeignKeys"
        runCommand="node server.js"
        runPort={4143}
        steps={[
          {
            method: "POST",
            path: "/customers",
            body: JSON.stringify({ name: "Lawrence", email: "lawrence@example.com" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":1,"name":"Lawrence","email":"lawrence@example.com"}',
          },
          {
            method: "POST",
            path: "/orders",
            body: JSON.stringify({ customerId: 1, product: "Laptop" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":1,"customer_id":1,"product":"Laptop"}',
            note: "A real customer id — Postgres accepts it.",
          },
          {
            method: "POST",
            path: "/orders",
            body: JSON.stringify({ customerId: 999, product: "Ghost Order" }, null, 2),
            expectStatus: 400,
            expectBody: '{"error":"No customer with id 999 exists — an order must point at a real customer."}',
            note: "No customer 999 was ever created — Postgres itself refuses this row.",
          },
          { method: "GET", path: "/orders", expectStatus: 200, expectBody: "A real array containing only the one order that actually succeeded." },
          { method: "DELETE", path: "/orders", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every order, used to reset between runs' },
          { method: "DELETE", path: "/customers", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every customer, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_rel_keys"
        table="orders"
        queries={[
          {
            label: "See the real foreign key constraint Postgres itself is enforcing",
            sql: "SELECT conname, pg_get_constraintdef(oid)\nFROM pg_constraint\nWHERE conrelid = 'node_express_learning_pg_rel_keys.orders'::regclass\n  AND contype = 'f';",
            expect: "One real row showing the exact FOREIGN KEY (customer_id) REFERENCES customers(id) constraint definition.",
          },
          {
            label: "Try the same rejected insert directly in SQL",
            sql: "INSERT INTO node_express_learning_pg_rel_keys.orders (customer_id, product)\nVALUES (999, 'pgAdmin4 Ghost Order');",
            note: "customer 999 does not exist.",
            expect: "A real error: insert or update on table \"orders\" violates foreign key constraint — the exact same rejection the API's 400 above is built on.",
          },
        ]}
      />
    ),
  },
  {
    heading: "INNER JOIN & LEFT JOIN: Combining Two Tables",
    body: (
      <>
        <p>
          The data now genuinely lives in two separate tables — a real customer&apos;s name is never repeated on
          every order row. But that means answering &quot;what did each customer buy?&quot; needs a way to combine
          the two tables back together for a single query. That combining step is called a <strong>JOIN</strong>.
        </p>
        <p>
          In plain English, <strong>JOIN</strong> (also written <strong>INNER JOIN</strong>) means &quot;only keep
          a combined row when both sides genuinely match.&quot; <strong>LEFT JOIN</strong> means &quot;keep every
          row from the left table no matter what, even when nothing on the right matches — fill the missing side
          with NULL.&quot; Every query below writes the real, full table name every time — <span className="font-mono text-xs">customers.name</span>,{" "}
          <span className="font-mono text-xs">orders.product</span> — instead of a short stand-in alias, so it is
          always obvious which table each column actually comes from.
        </p>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "ON Names the Real Matching Rule",
              description: "customers.id = orders.customer_id tells Postgres exactly which column on each side has to be equal for two rows to be considered a match.",
            },
            {
              label: "INNER JOIN Drops Unmatched Rows",
              description: "A customer with zero real orders never appears in an INNER JOIN's result at all — not even once.",
            },
            {
              label: "LEFT JOIN Keeps Every Row From the Left Table",
              description: "The same customer with zero orders still appears — every column that would have come from orders shows up as a real NULL instead.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          The choice between JOIN and LEFT JOIN is really a choice about what to do with rows that have no match —
          silently drop them (INNER), or keep them with NULLs filled in (LEFT). Getting this wrong is one of the
          most common real bugs in a reporting query: an INNER JOIN can make a customer with zero orders vanish
          from a report entirely, when the real requirement was to show them with a zero.
        </Callout>
        <p>
          The demo below seeds 3 real customers (one with zero orders) and 3 real orders, then runs both queries
          against the exact same data — proving INNER JOIN drops the customer with no orders, while LEFT JOIN keeps
          her with a real null.
        </p>
      </>
    ),
    extra: <InnerLeftJoinDiagram />,
    filePointers: [
      { path: "examples/PostgresqlRelationalQuerying/InnerLeftJoin/controllers/joins.controller.js", note: "The 2 real queries this section is about — same 2 tables, JOIN vs LEFT JOIN." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlRelationalQuerying/InnerLeftJoin"
        runCommand="node server.js"
        runPort={4144}
        steps={[
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Ava" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Ava"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Bo" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"name":"Bo"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Cleo" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"name":"Cleo"}', note: "Cleo never gets an order below, on purpose." },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 1, product: "Laptop" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"customer_id":1,"product":"Laptop"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 1, product: "Mouse" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"customer_id":1,"product":"Mouse"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 2, product: "Phone" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"customer_id":2,"product":"Phone"}' },
          { method: "GET", path: "/customers/inner-join-orders", expectStatus: 200, expectBody: '[{"name":"Ava","product":"Laptop"},{"name":"Ava","product":"Mouse"},{"name":"Bo","product":"Phone"}] — Cleo is not in this array at all' },
          { method: "GET", path: "/customers/left-join-orders", expectStatus: 200, expectBody: '[{"name":"Ava","product":"Laptop"},{"name":"Ava","product":"Mouse"},{"name":"Bo","product":"Phone"},{"name":"Cleo","product":null}] — Cleo is here, with product: null' },
          { method: "DELETE", path: "/orders", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every order, used to reset between runs' },
          { method: "DELETE", path: "/customers", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every customer, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_rel_join"
        table="customers"
        queries={[
          {
            label: "Run the exact same real INNER JOIN the API's /customers/inner-join-orders uses",
            sql: "SELECT customers.name, orders.product\nFROM node_express_learning_pg_rel_join.customers\nJOIN node_express_learning_pg_rel_join.orders ON customers.id = orders.customer_id\nORDER BY customers.id;",
            expect: "Only customers with at least one real order — Cleo is absent.",
          },
          {
            label: "Run the exact same real LEFT JOIN the API's /customers/left-join-orders uses",
            sql: "SELECT customers.name, orders.product\nFROM node_express_learning_pg_rel_join.customers\nLEFT JOIN node_express_learning_pg_rel_join.orders ON customers.id = orders.customer_id\nORDER BY customers.id;",
            expect: "Every customer, including Cleo — her product column comes back as a real NULL.",
          },
        ]}
      />
    ),
  },
  {
    heading: "RIGHT JOIN & FULL OUTER JOIN: The Other Two",
    body: (
      <>
        <p>
          LEFT JOIN keeps every row from the table on the left. <strong>RIGHT JOIN</strong> is its exact mirror —
          it keeps every row from the table on the right instead, no matter what the left side has. In plain
          English: RIGHT JOIN means &quot;keep everything on the right, fill in NULL for anything unmatched on the
          left.&quot; <strong>FULL OUTER JOIN</strong> combines both ideas at once — it means &quot;keep everything
          from BOTH tables, matched or not,&quot; so nothing from either side is ever silently dropped.
        </p>
        <p>
          This section adds one new real wrinkle: a <strong>guest order</strong>, with no customer at all —{" "}
          <span className="font-mono text-xs">customer_id</span> is a genuine database NULL, not a made-up example.
          That single real row is what makes RIGHT JOIN and FULL OUTER JOIN actually behave differently from each
          other, instead of just being LEFT JOIN with the table names swapped.
        </p>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "RIGHT JOIN Is LEFT JOIN, Mirrored",
              description: "orders RIGHT JOIN customers keeps every customer, matched or not — the exact same shape as customers LEFT JOIN orders, just written from the other table's side.",
            },
            {
              label: "A Guest Order Has No Customer to Attach To",
              description: "customer_id can be NULL here (no NOT NULL, unlike the previous section) — a real order that was never tied to any customer at all.",
            },
            {
              label: "FULL OUTER JOIN Drops Nothing From Either Side",
              description: "The unmatched customer (no orders) AND the unmatched order (no customer) both appear in the same result — the NULL just moves to whichever side is actually missing.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          RIGHT JOIN is rarely used on its own in real code — most teams standardize on LEFT JOIN and just swap
          table order instead, purely for readability. FULL OUTER JOIN is the genuinely distinct one: it is the
          only join type that guarantees you see every row from both tables in a single query, which matters for
          real reconciliation reports (e.g. &quot;which orders have no customer, and which customers have no
          orders&quot;, in one pass).
        </Callout>
        <p>
          The demo below seeds 3 real customers (one with zero orders) and 3 real orders (one a real guest order,
          customer_id null), then runs both queries — proving RIGHT JOIN drops the guest order entirely, while FULL
          OUTER JOIN brings it back.
        </p>
      </>
    ),
    extra: <RightFullOuterJoinDiagram />,
    filePointers: [
      { path: "examples/PostgresqlRelationalQuerying/RightFullOuterJoin/setup.js", note: "customer_id has no NOT NULL this time — a real guest order can leave it empty." },
      { path: "examples/PostgresqlRelationalQuerying/RightFullOuterJoin/controllers/joins.controller.js", note: "The 2 real queries this section is about — RIGHT JOIN vs FULL OUTER JOIN, run FROM orders." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlRelationalQuerying/RightFullOuterJoin"
        runCommand="node server.js"
        runPort={4145}
        steps={[
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Diana" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Diana"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Ethan" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"name":"Ethan"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Fiona" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"name":"Fiona"}', note: "Fiona never gets an order below, on purpose." },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 1, product: "Headphones" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"customer_id":1,"product":"Headphones"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 2, product: "Monitor" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"customer_id":2,"product":"Monitor"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ product: "Gift Card" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"customer_id":null,"product":"Gift Card"}', note: "No customerId at all — a real guest order." },
          { method: "GET", path: "/orders/right-join-customers", expectStatus: 200, expectBody: '[{"product":"Headphones","name":"Diana"},{"product":"Monitor","name":"Ethan"},{"product":null,"name":"Fiona"}] — the Gift Card guest order is not here' },
          { method: "GET", path: "/orders/full-outer-join-customers", expectStatus: 200, expectBody: '[{"product":"Headphones","name":"Diana"},{"product":"Monitor","name":"Ethan"},{"product":null,"name":"Fiona"},{"product":"Gift Card","name":null}] — the guest order is back, with name: null' },
          { method: "DELETE", path: "/orders", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every order, used to reset between runs' },
          { method: "DELETE", path: "/customers", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every customer, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_rel_outer"
        table="orders"
        queries={[
          {
            label: "Run the exact same real RIGHT JOIN the API's /orders/right-join-customers uses",
            sql: "SELECT orders.product, customers.name\nFROM node_express_learning_pg_rel_outer.orders\nRIGHT JOIN node_express_learning_pg_rel_outer.customers ON orders.customer_id = customers.id\nORDER BY customers.id;",
            expect: "Every real customer, including Fiona — the Gift Card guest order is absent, since it has no customer to attach to.",
          },
          {
            label: "Run the exact same real FULL OUTER JOIN the API's /orders/full-outer-join-customers uses",
            sql: "SELECT orders.product, customers.name\nFROM node_express_learning_pg_rel_outer.orders\nFULL OUTER JOIN node_express_learning_pg_rel_outer.customers ON orders.customer_id = customers.id\nORDER BY customers.id;",
            expect: "Every real customer AND the Gift Card guest order — nothing from either table is missing.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Subqueries: A Query Inside a Query",
    body: (
      <>
        <p>
          Some real questions can&apos;t be answered by filtering against a fixed value you already know — &quot;which
          orders cost more than average&quot; needs the average itself computed from the same table first. A{" "}
          <strong>subquery</strong> is exactly that: a real SELECT nested inside another real SELECT&apos;s WHERE
          clause. Postgres runs the inner query first, gets a real answer, then uses that answer to filter the
          outer query — all as one single round trip from Node, never two separate queries.
        </p>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "A Scalar Subquery Returns Exactly One Value",
              description: "(SELECT AVG(amount) FROM orders) returns one real number — usable anywhere a single value is expected, like the right side of a > comparison.",
              example: "WHERE amount > (SELECT AVG(amount) FROM orders)",
            },
            {
              label: "A List Subquery Returns Many Values",
              description: "(SELECT customer_id FROM orders WHERE amount > 100) returns a real list of ids — paired with IN, which checks whether a row's value shows up anywhere in that list.",
              example: "WHERE id IN (SELECT customer_id FROM orders WHERE amount > 100)",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A subquery is still just SQL running inside Postgres — it does not become a separate network round trip
          the way running two queries from Node one after another would. The whole point of writing it as one
          nested query is letting the database compute the intermediate value itself, instead of fetching every row
          into Node and filtering there.
        </Callout>
        <p>
          The demo below seeds 3 real customers and 4 real orders with different amounts, then runs both subquery
          shapes — proving the scalar subquery correctly finds only the above-average orders, and the list subquery
          correctly finds only the customers who placed at least one order over $100.
        </p>
      </>
    ),
    extra: <SubqueriesDiagram />,
    filePointers: [
      { path: "examples/PostgresqlRelationalQuerying/Subqueries/controllers/orders.controller.js", note: "The real scalar subquery — WHERE amount > (SELECT AVG(amount) ...)." },
      { path: "examples/PostgresqlRelationalQuerying/Subqueries/controllers/customers.controller.js", note: "The real list subquery — WHERE id IN (SELECT customer_id ...)." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlRelationalQuerying/Subqueries"
        runCommand="node server.js"
        runPort={4146}
        steps={[
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Grace" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Grace"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Henry" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"name":"Henry"}' },
          { method: "POST", path: "/customers", body: JSON.stringify({ name: "Ivy" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"name":"Ivy"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 1, amount: 50 }, null, 2), expectStatus: 201, expectBody: '{"id":1,"customer_id":1,"amount":"50.00"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 1, amount: 200 }, null, 2), expectStatus: 201, expectBody: '{"id":2,"customer_id":1,"amount":"200.00"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 2, amount: 30 }, null, 2), expectStatus: 201, expectBody: '{"id":3,"customer_id":2,"amount":"30.00"}' },
          { method: "POST", path: "/orders", body: JSON.stringify({ customerId: 3, amount: 150 }, null, 2), expectStatus: 201, expectBody: '{"id":4,"customer_id":3,"amount":"150.00"}' },
          { method: "GET", path: "/orders/above-average", expectStatus: 200, expectBody: '[{"id":2,"customer_id":1,"amount":"200.00"},{"id":4,"customer_id":3,"amount":"150.00"}] — average is 107.50, only these 2 clear it' },
          { method: "GET", path: "/customers/big-spenders", expectStatus: 200, expectBody: '[{"id":1,"name":"Grace"},{"id":3,"name":"Ivy"}] — Henry never placed an order over $100' },
          { method: "DELETE", path: "/orders", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every order, used to reset between runs' },
          { method: "DELETE", path: "/customers", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every customer, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_rel_subquery"
        table="orders"
        queries={[
          {
            label: "Run the exact same real scalar subquery the API's /orders/above-average uses",
            sql: "SELECT * FROM node_express_learning_pg_rel_subquery.orders\nWHERE amount > (SELECT AVG(amount) FROM node_express_learning_pg_rel_subquery.orders)\nORDER BY amount DESC;",
            expect: "Only the real orders above the real average of 107.50.",
          },
          {
            label: "Run the exact same real list subquery the API's /customers/big-spenders uses",
            sql: "SELECT * FROM node_express_learning_pg_rel_subquery.customers\nWHERE id IN (\n  SELECT customer_id FROM node_express_learning_pg_rel_subquery.orders WHERE amount > 100\n)\nORDER BY id;",
            expect: "Only Grace and Ivy — Henry's only order was $30.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Constraints & Data Integrity: RESTRICT, CASCADE, CHECK & UNIQUE",
    body: (
      <>
        <p>
          A foreign key already refuses a child row that points at nothing — but it does not, by itself, say what
          should happen when someone tries to delete the PARENT row a child still points at. Postgres lets you
          choose, per foreign key, and the two most common real choices are opposites of each other.
        </p>
        <p>
          In plain English: <strong>ON DELETE RESTRICT</strong> means &quot;refuse to delete the parent while any
          real child still points at it.&quot; <strong>ON DELETE CASCADE</strong> means &quot;delete the parent, and
          automatically delete every real child that pointed at it too.&quot; Separately, <strong>CHECK</strong>{" "}
          means &quot;reject any row where this condition is false,&quot; and <strong>UNIQUE</strong> means
          &quot;reject any row that would duplicate an existing value in this column.&quot;
        </p>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "RESTRICT Protects Against Accidental Data Loss",
              description: "Deleting a customer who still has real orders fails outright — you have to deal with the orders first, on purpose.",
              example: "customer_id INTEGER REFERENCES customers(id) ON DELETE RESTRICT",
            },
            {
              label: "CASCADE Accepts the Data Loss, Automatically",
              description: "Deleting a customer deletes their orders too, in the same real operation — useful when the child data genuinely has no meaning without its parent.",
              example: "customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE",
            },
            {
              label: "CHECK Enforces a Real Business Rule at the Database Level",
              description: "price > 0 is checked on every single INSERT and UPDATE — a bug in application code can never sneak a negative price past it.",
              example: "price NUMERIC(10,2) NOT NULL CHECK (price > 0)",
            },
            {
              label: "UNIQUE Enforces No Duplicates, Also at the Database Level",
              description: "Two real rows can never share the same name — even under concurrent requests racing each other, which app-level \"check first, then insert\" code can't fully protect against.",
              example: "name TEXT NOT NULL UNIQUE",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Every one of these 4 rules is enforced by Postgres itself, not by Express or Node code — the controller
          below only catches the real error code Postgres already sends back (23503 for RESTRICT, 23514 for CHECK,
          23505 for UNIQUE) and turns it into a clean, real HTTP response. If the constraint lived only in
          application code, a second server, a raw SQL script, or a bug could all bypass it — a real database
          constraint cannot be bypassed that way.
        </Callout>
        <p>
          The demo below proves all 4 for real: a blocked delete (RESTRICT), a successful cascading delete
          (CASCADE), a rejected negative price (CHECK), and a rejected duplicate product name (UNIQUE).
        </p>
      </>
    ),
    extra: <ConstraintsDiagram />,
    filePointers: [
      { path: "examples/PostgresqlRelationalQuerying/ConstraintsDataIntegrity/setup.js", note: "The 5 real tables — 2 pairs for RESTRICT/CASCADE, plus one products table carrying both CHECK and UNIQUE." },
      { path: "examples/PostgresqlRelationalQuerying/ConstraintsDataIntegrity/controllers/restrict.controller.js", note: "Catches real error code 23503 (foreign_key_violation) from the RESTRICT-guarded delete." },
      { path: "examples/PostgresqlRelationalQuerying/ConstraintsDataIntegrity/controllers/products.controller.js", note: "Catches real error codes 23514 (check_violation) and 23505 (unique_violation) on the same table." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/PostgresqlRelationalQuerying/ConstraintsDataIntegrity"
        runCommand="node server.js"
        runPort={4147}
        steps={[
          { method: "POST", path: "/restrict/customers", body: JSON.stringify({ name: "Jack" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Jack"}' },
          { method: "POST", path: "/restrict/orders", body: JSON.stringify({ customerId: 1, product: "Tablet" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"customer_id":1,"product":"Tablet"}' },
          { method: "DELETE", path: "/restrict/customers/1", expectStatus: 409, expectBody: '{"error":"Cannot delete customer 1: a real order still points at it (ON DELETE RESTRICT)."}', note: "Jack still has a real order pointing at him." },
          { method: "POST", path: "/cascade/customers", body: JSON.stringify({ name: "Kira" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Kira"}' },
          { method: "POST", path: "/cascade/orders", body: JSON.stringify({ customerId: 1, product: "Speaker" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"customer_id":1,"product":"Speaker"}' },
          { method: "DELETE", path: "/cascade/customers/1", expectStatus: 200, expectBody: '{"id":1,"name":"Kira"}', note: "This time the delete succeeds — CASCADE is set up on this table pair instead." },
          { method: "GET", path: "/cascade/orders", expectStatus: 200, expectBody: "[] — Kira's order was auto-deleted along with her, proving the cascade genuinely ran." },
          { method: "POST", path: "/products", body: JSON.stringify({ name: "Desk Lamp", price: -5 }, null, 2), expectStatus: 400, expectBody: '{"error":"price must be greater than 0 — Postgres\'s own CHECK constraint rejected -5."}' },
          { method: "POST", path: "/products", body: JSON.stringify({ name: "Desk Lamp", price: 25 }, null, 2), expectStatus: 201, expectBody: '{"id":<a real integer>,"name":"Desk Lamp","price":"25.00"}' },
          { method: "POST", path: "/products", body: JSON.stringify({ name: "Desk Lamp", price: 30 }, null, 2), expectStatus: 409, expectBody: '{"error":"A product named \\"Desk Lamp\\" already exists — Postgres\'s own UNIQUE constraint rejected the duplicate."}' },
          { method: "DELETE", path: "/restrict/reset", expectStatus: 200, expectBody: '{"reset":true} — clears both RESTRICT-demo tables' },
          { method: "DELETE", path: "/cascade/reset", expectStatus: 200, expectBody: '{"reset":true} — clears both CASCADE-demo tables' },
          { method: "DELETE", path: "/products", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every product, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_pg_rel_constraints"
        table="products"
        queries={[
          {
            label: "See the real CHECK and UNIQUE constraints Postgres itself is enforcing",
            sql: "SELECT conname, pg_get_constraintdef(oid)\nFROM pg_constraint\nWHERE conrelid = 'node_express_learning_pg_rel_constraints.products'::regclass;",
            expect: "Two real rows: the CHECK ((price > 0)) constraint, and the UNIQUE (name) constraint.",
          },
          {
            label: "Trigger the real CHECK violation directly in SQL",
            sql: "INSERT INTO node_express_learning_pg_rel_constraints.products (name, price)\nVALUES ('pgAdmin4 Test', -1);",
            expect: "A real error: new row for relation \"products\" violates check constraint — the exact same rejection the API's 400 above is built on.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Primary keys and foreign keys are what let real data live in separate tables without losing the
        connection between them — and Postgres enforces that connection itself, not application code. JOIN,
        LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN are all the same core idea (combine two tables on a matching
        column) with 4 different answers to &quot;what happens to a row with no match?&quot; A subquery lets
        Postgres compute an intermediate value (an average, a list of ids) and use it in the same real query, with
        no extra round trip from Node. And RESTRICT/CASCADE/CHECK/UNIQUE are 4 real, database-level rules that stay
        true no matter which application, script, or bug tries to write bad data — the single biggest reason to
        push integrity rules into the database instead of trusting application code alone.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["two related tables", "a real foreign key ties them together", "a JOIN combines them for one query", "a subquery lets one query use another's answer", "constraints keep every write honest"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "INNER JOIN drops unmatched rows; LEFT/RIGHT JOIN keep every row from one side, filling NULL for the missing side; FULL OUTER JOIN keeps every row from both sides.",
            "A foreign key without an ON DELETE choice defaults to RESTRICT (technically NO ACTION) in Postgres — CASCADE has to be opted into explicitly, since it silently deletes real data.",
            "A scalar subquery returns exactly one value and can be used anywhere a single value is expected; a list subquery returns many values and pairs with IN.",
            "CHECK and UNIQUE constraints matter even with careful application code, because they hold under concurrent requests and bugs in a way an app-level 'validate then insert' check cannot fully guarantee.",
          ]}
        />
      </>
    ),
  },
];

export default function PostgresqlRelationalQueryingPage() {
  return (
    <StudyPage
      title="PostgreSQL Relational Querying"
      stageLabel="Stage C — Data Layer"
      stageColor="red"
      intro="Real multi-table SQL against the actual Coolify Postgres server: why data lives in more than one table at all (primary keys, foreign keys), all 4 real JOIN types (INNER/LEFT/RIGHT/FULL OUTER), subqueries, and the real database-level constraints (RESTRICT, CASCADE, CHECK, UNIQUE) that keep it all honest — every one of them proven by a real rejection or a real cascading delete, not just described."
      sections={sections}
    />
  );
}
