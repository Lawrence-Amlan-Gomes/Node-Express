import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import PgAdminCheck from "@/components/PgAdminCheck";
import CopyButton from "@/components/CopyButton";
import DataTable from "@/components/DataTable";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function AsyncErrorFlowDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One async route, three real real endings</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-cyan-500 shrink-0">try {"{"}</span>
          <span className="text-body text-xs">await the real Prisma lookup runs</span>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-green-500 shrink-0">found</span>
          <span className="text-body text-xs">→ res.json(customer), status 200</span>
        </div>
        <div className="rounded-card border border-yellow-500 bg-yellow-500/5 px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-yellow-500 shrink-0">missing</span>
          <span className="text-body text-xs">→ res.status(404).json(...) — a real, EXPECTED case, not an error</span>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-red-500 shrink-0">{"} catch (err) {"}</span>
          <span className="text-body text-xs">next(err) → jumps straight to the central error handler below, status 500</span>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">next(err) is what tells Express &quot;this isn&apos;t a normal next() — skip every remaining normal route/middleware and go straight to error-handling middleware instead.&quot;</span>
      </div>
      <div className="mt-4">
        <DataTable
          accentKey="red"
          caption='The real "Customer" table — exactly what GET /customers/:id is looking a row up in'
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
            { key: "email", label: "email" },
          ]}
          rows={[
            { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
            { id: 2, name: "Grace Hopper", email: "grace@example.com" },
          ]}
        />
      </div>
    </div>
  );
}

function PrismaFourOpsDiagram() {
  const ops: { name: string; call: string; sql: string }[] = [
    { name: "create", call: "prisma.lead.create({ data })", sql: "INSERT INTO \"Lead\" (...) VALUES (...) RETURNING *" },
    { name: "findMany", call: "prisma.lead.findMany({ where, include })", sql: "SELECT ... FROM \"Lead\" WHERE ... (+ a 2nd query for the related Business)" },
    { name: "update", call: "prisma.lead.update({ where, data })", sql: "UPDATE \"Lead\" SET ... WHERE id = ... RETURNING *" },
    { name: "delete", call: "prisma.lead.delete({ where })", sql: "DELETE FROM \"Lead\" WHERE id = ... RETURNING *" },
  ];
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Metaora&apos;s 4 basics — the real SQL Prisma generates underneath each one</div>
      <div className="flex flex-col gap-2">
        {ops.map((op) => (
          <div key={op.name} className="rounded-card border border-border bg-surface-raised px-3 py-2 flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold text-orange-500 w-20 shrink-0">{op.name}</span>
              <code className="font-mono text-xs text-body">{op.call}</code>
            </div>
            <div className="font-mono text-[11px] text-cyan-500 pl-[5.5rem]">→ {op.sql}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">include: {"{"} business: true {"}"} is really a SECOND real query Prisma runs for you and joins in memory — not a single SQL JOIN under the hood, by default.</span>
      </div>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <DataTable
          accentKey="orange"
          caption='The real "Business" table'
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
          ]}
          rows={[{ id: 1, name: "Acme Roofing" }]}
        />
        <DataTable
          accentKey="orange"
          caption='The real "Lead" table — businessId points at Business.id above'
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
            { key: "phone", label: "phone" },
            { key: "status", label: "status" },
            { key: "businessId", label: "businessId" },
          ]}
          rows={[{ id: 1, name: "Sam Client", phone: "555-1010", status: "recovered", businessId: 1 }]}
        />
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Lead.businessId = 1 is what makes findMany({"{"} include: {"{"} business: true {"}"} {"}"}) able to attach the whole Business row (id 1, &quot;Acme Roofing&quot;) onto this lead.</span>
      </div>
    </div>
  );
}

function InnerVsLeftJoinDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Step 1 — the two real source tables, before any JOIN at all</div>
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <DataTable
          accentKey="purple"
          caption="businesses"
          columns={[
            { key: "id", label: "id" },
            { key: "name", label: "name" },
          ]}
          rows={[
            { id: 1, name: "Acme Roofing" },
            { id: 2, name: "Bright Plumbing" },
            { id: 3, name: "NoLeadsCo" },
          ]}
        />
        <DataTable
          accentKey="purple"
          caption="leads"
          columns={[
            { key: "id", label: "id" },
            { key: "business_id", label: "business_id" },
            { key: "status", label: "status" },
          ]}
          rows={[
            { id: 1, business_id: 1, status: "recovered" },
            { id: 2, business_id: 1, status: "recovered" },
            { id: 3, business_id: 1, status: "new" },
            { id: 4, business_id: 2, status: "recovered" },
          ]}
        />
      </div>

      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Step 2 — the exact real query that turns the tables above into each result below</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <pre className="font-mono text-[11px] text-cyan-500 bg-cyan-500/10 border border-cyan-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap">
{`SELECT b.name, COUNT(l.id) AS recovered_leads
FROM businesses b
JOIN leads l ON l.business_id = b.id
WHERE l.status = 'recovered'
GROUP BY b.name`}
          </pre>
          <DataTable
            accentKey="cyan"
            caption="Real result — plain JOIN (= INNER JOIN)"
            columns={[
              { key: "name", label: "name" },
              { key: "recovered_leads", label: "recovered_leads" },
            ]}
            rows={[
              { name: "Acme Roofing", recovered_leads: 2 },
              { name: "Bright Plumbing", recovered_leads: 1 },
            ]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <pre className="font-mono text-[11px] text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-card px-3 py-2.5 whitespace-pre-wrap">
{`SELECT b.name, COUNT(l.id) AS recovered_leads
FROM businesses b
LEFT JOIN leads l
  ON l.business_id = b.id AND l.status = 'recovered'
GROUP BY b.name`}
          </pre>
          <DataTable
            accentKey="purple"
            caption="Real result — LEFT JOIN instead of plain JOIN"
            columns={[
              { key: "name", label: "name" },
              { key: "recovered_leads", label: "recovered_leads" },
            ]}
            rows={[
              { name: "Acme Roofing", recovered_leads: 2 },
              { name: "Bright Plumbing", recovered_leads: 1 },
              { name: "NoLeadsCo", recovered_leads: 0 },
            ]}
          />
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Look at WHERE the status filter moved: the INNER version filters in WHERE (runs AFTER the join, so a business with no match is gone before WHERE even sees it). The LEFT version moves the SAME filter into the ON clause (runs DURING the join, so the business row survives — only its lead-matching is filtered).</span>
      </div>
    </div>
  );
}

function GenericConstraintDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">How T narrows down to Lead&apos;s own real status type</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-cyan-500 shrink-0">{"<T extends { status: string }>"}</span>
          <span className="text-body text-xs">T can be ANY real object shape with a real &quot;status&quot; field</span>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-cyan-500 shrink-0">updateStatus(lead, ...)</span>
          <span className="text-body text-xs">TypeScript infers T = Lead, straight from this real first argument</span>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2 flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-green-500 shrink-0">T[&quot;status&quot;]</span>
          <span className="text-body text-xs">now means exactly &quot;new&quot; | &quot;contacted&quot; | &quot;recovered&quot; — Lead&apos;s own real union, not plain string</span>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">The same generic function works for a completely different real object shape too — T[&quot;status&quot;] just narrows to WHATEVER that other shape&apos;s own status type is, with zero rewriting.</span>
      </div>
    </div>
  );
}

function TryTypeScriptYourself() {
  const cdCmd = 'cd "/Users/lawrencealangomes/Documents/Node Express/examples/Metaora/TypeScriptInterviewFluency"';
  const runCmd = "node correct-usage.ts";
  const checkBrokenCmd = "npm run check-broken-usage";
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Your Own Terminal</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-2">
        This section has no server to hit in Postman — it&apos;s a real, pure TypeScript type-checking proof instead.
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 mb-3 flex flex-col gap-2">
        <div className="text-body text-xs leading-relaxed">
          <span className="font-semibold">1. Open a terminal and go to that folder:</span>
          <div className="mt-1 flex items-start gap-2">
            <pre className="flex-1 font-mono text-xs text-orange-500 bg-orange-500/10 rounded px-2 py-1.5 whitespace-pre-wrap break-all">{cdCmd}</pre>
            <CopyButton text={cdCmd} label="Copy cd command" className="text-orange-500 mt-1.5" />
          </div>
        </div>
        <div className="text-body text-xs leading-relaxed flex items-center gap-2 flex-wrap">
          <span className="font-semibold">2. Run the real, correct usage:</span>
          <code className="text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono text-xs">{runCmd}</code>
          <CopyButton text={runCmd} label="Copy run command" className="text-orange-500" />
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/5 px-3 py-2 text-xs font-mono text-green-500 whitespace-pre-wrap">
{`Real result: {"id":"lead_1","status":"recovered"}
The original object was NOT mutated: {"id":"lead_1","status":"new"}`}
        </div>
        <div className="text-body text-xs leading-relaxed flex items-center gap-2 flex-wrap mt-1">
          <span className="font-semibold">3. Now check the deliberately WRONG usage:</span>
          <code className="text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded font-mono text-xs">{checkBrokenCmd}</code>
          <CopyButton text={checkBrokenCmd} label="Copy check command" className="text-orange-500" />
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/5 px-3 py-2 text-xs font-mono text-red-500 whitespace-pre-wrap break-all">
          broken-usage.ts(16,36): error TS2345: Argument of type &apos;&quot;archived&quot;&apos; is not assignable to parameter of type &apos;&quot;new&quot; | &quot;contacted&quot; | &quot;recovered&quot;&apos;.
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Express — Async Routes & Central Error Handling",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "Every await Goes Inside a try",
              description: "An async route handler can throw at any real await — a bad database call, a missing field, anything. Wrapping the whole handler in try/catch is how you catch it before it escapes.",
            },
            {
              label: "A Real Miss Is Not an Error",
              description: "When the lookup genuinely finds nothing, that's an expected, normal case — a plain 404 response, returned directly, never thrown or passed to next().",
            },
            {
              label: "next(err) Hands the Error to Express Itself",
              description: "Calling next(err) — with a real argument — tells Express \"skip every normal route/middleware from here, and go straight to error-handling middleware instead.\"",
              example: "catch (err) { next(err); }",
            },
            {
              label: "One Real Central Handler, Registered Last",
              description: "A middleware with exactly 4 parameters — (err, req, res, next) — is how Express tells an error handler apart from a normal one. It must be the LAST app.use(), so every earlier next(err) has somewhere real to land.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          try/catch + next(err) is the explicit version of a pattern Express 5 now does automatically for a plain
          thrown/rejected async route — but Metaora&apos;s own interview snippet writes it by hand, and a real
          production codebase (especially one not yet fully on Express 5) still expects you to know why: without it,
          a thrown error inside an async handler has nowhere safe to go, and either hangs the request or crashes the
          whole process.
        </Callout>
        <p>
          The demo below proves all three real endings: a real found customer, a real 404 on a genuine miss, and a
          real thrown Prisma error (an id that isn&apos;t even a number) actually reaching the central handler and
          coming back as a clean, generic 500 — never leaking the raw internal error to the client.
        </p>
      </>
    ),
    extra: <AsyncErrorFlowDiagram />,
    filePointers: [
      { path: "examples/Metaora/AsyncRouteErrorHandling/server.js", note: "The real central error-handling middleware — 4 real parameters, registered last." },
      { path: "examples/Metaora/AsyncRouteErrorHandling/controllers/customers.controller.js", note: "Metaora's own snippet, almost verbatim — the real try/catch + next(err)." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/Metaora/AsyncRouteErrorHandling"
        runCommand="node server.js"
        runPort={4140}
        steps={[
          {
            method: "POST",
            path: "/customers",
            body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"name":"Ada Lovelace","email":"ada@example.com"}',
          },
          { method: "GET", path: "/customers/1", expectStatus: 200, expectBody: '{"id":1,"name":"Ada Lovelace","email":"ada@example.com"}', note: "Use whatever real id the POST above actually returned." },
          { method: "GET", path: "/customers/999", expectStatus: 404, expectBody: '{"error":"Not found"}', note: "A real, valid number — just no row with that id. A genuine miss, not an error." },
          {
            method: "GET",
            path: "/customers/abc",
            expectStatus: 500,
            expectBody: '{"error":"Internal server error"}',
            note: "A non-numeric id. Number(\"abc\") becomes NaN, Prisma genuinely REJECTS it and throws — watch the server's own terminal: it logs the real Prisma error, while the client only ever sees this one safe, generic message.",
          },
          { method: "DELETE", path: "/customers", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every customer, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_metaora_async"
        table="Customer"
        queries={[
          {
            label: "Insert a real row yourself",
            sql: 'INSERT INTO node_express_learning_metaora_async."Customer" (name, email)\nVALUES (\'pgAdmin4 Test\', \'test@example.com\')\nRETURNING *;',
            note: 'The table name needs double quotes ("Customer") because Prisma created it with a real capital letter.',
            expect: "One real row back, with a real auto-generated id.",
          },
          {
            label: "See every real row in the table",
            sql: 'SELECT * FROM node_express_learning_metaora_async."Customer" ORDER BY id;',
            expect: "Every customer currently in the real table.",
          },
          {
            label: "Clean up your test row",
            sql: 'DELETE FROM node_express_learning_metaora_async."Customer" WHERE name = \'pgAdmin4 Test\';',
            expect: "The row you inserted is gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "Prisma — The 4 Basic Operations",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "create — One Real INSERT",
              description: "Takes a data object matching the model's real shape and inserts one real row, returning it.",
              example: 'prisma.lead.create({ data: { name, phone, businessId, status: "new" } })',
            },
            {
              label: "findMany — A Real Filter, Plus a Real Relation",
              description: "where narrows down which real rows come back. include loads a real related row (here, each lead's own business) alongside it.",
              example: 'prisma.lead.findMany({ where: { status: "missed_call" }, include: { business: true } })',
            },
            {
              label: "update — One Real UPDATE, by Primary Key",
              description: "where picks the exact real row; data is what actually changes on it.",
              example: 'prisma.lead.update({ where: { id }, data: { status: "recovered" } })',
            },
            {
              label: "delete — One Real DELETE, by Primary Key",
              description: "Removes exactly the one real row matching where, and returns what was just deleted.",
              example: "prisma.lead.delete({ where: { id } })",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          These 4 calls are Prisma&apos;s entire day-to-day vocabulary for a real resource — where filters, include
          joins in a related row, data is what changes. Reading a schema.prisma model block (see the FilePointer
          below) tells you exactly what real fields each of those objects can contain.
        </Callout>
        <p>
          The demo below seeds a real business and a real lead, moves that lead through real status changes
          (&quot;new&quot; → &quot;missed_call&quot; → &quot;recovered&quot;), and proves the findMany filter plus the
          real, joined-in business object all actually work.
        </p>
      </>
    ),
    extra: <PrismaFourOpsDiagram />,
    filePointers: [
      { path: "examples/Metaora/PrismaCrudBasics/prisma/schema.prisma", note: "The real Business/Lead model shapes — read where/include/select against this." },
      { path: "examples/Metaora/PrismaCrudBasics/controllers/leads.controller.js", note: "Metaora's own 4 operations, each as one real Express handler." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/Metaora/PrismaCrudBasics"
        runCommand="node server.js"
        runPort={4141}
        steps={[
          {
            method: "POST",
            path: "/businesses",
            body: JSON.stringify({ name: "Acme Roofing" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"name":"Acme Roofing"}',
            note: "Seed a real business first — every lead below needs a real businessId.",
          },
          {
            method: "POST",
            path: "/leads",
            body: JSON.stringify({ name: "Sam Client", phone: "555-1010", businessId: 1 }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":<a real integer>,"name":"Sam Client","phone":"555-1010","status":"new","businessId":1}',
            note: "Use the real businessId the POST above returned. Every new lead starts as \"new\".",
          },
          {
            method: "PATCH",
            path: "/leads/1",
            body: JSON.stringify({ status: "missed_call" }, null, 2),
            expectStatus: 200,
            expectBody: '{"id":1,"name":"Sam Client","phone":"555-1010","status":"missed_call","businessId":1}',
            note: "Use the real lead id from above.",
          },
          {
            method: "GET",
            path: "/leads?status=missed_call",
            expectStatus: 200,
            expectBody: '[{"id":1,"name":"Sam Client","phone":"555-1010","status":"missed_call","businessId":1,"business":{"id":1,"name":"Acme Roofing"}}]',
            note: "The real findMany + include result — notice the whole business object is joined in.",
          },
          {
            method: "PATCH",
            path: "/leads/1",
            body: JSON.stringify({ status: "recovered" }, null, 2),
            expectStatus: 200,
            expectBody: '{"id":1,"name":"Sam Client","phone":"555-1010","status":"recovered","businessId":1}',
          },
          { method: "DELETE", path: "/leads/1", expectStatus: 200, expectBody: '{"id":1,"name":"Sam Client","phone":"555-1010","status":"recovered","businessId":1}', note: "Use the same real lead id." },
          { method: "DELETE", path: "/leads", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every lead, used to reset between runs' },
          { method: "DELETE", path: "/businesses", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every business, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_metaora_leads"
        table="Lead"
        queries={[
          {
            label: "Insert a real business, then a real lead pointing at it",
            sql: 'INSERT INTO node_express_learning_metaora_leads."Business" (name) VALUES (\'pgAdmin4 Biz\') RETURNING *;\n-- Use the real id this returns as businessId below\nINSERT INTO node_express_learning_metaora_leads."Lead" (name, phone, status, "businessId")\nVALUES (\'pgAdmin4 Test\', \'555-0000\', \'new\', 1)\nRETURNING *;',
            note: "Run the first INSERT, note its real id, then paste that id into the second INSERT's businessId before running it.",
            expect: "Two real rows — a business and a lead pointing at it by a real foreign key.",
          },
          {
            label: "See the real JOIN — a lead with its real business name",
            sql: 'SELECT l.*, b.name AS business_name\nFROM node_express_learning_metaora_leads."Lead" l\nJOIN node_express_learning_metaora_leads."Business" b ON b.id = l."businessId"\nWHERE l.name = \'pgAdmin4 Test\';',
            expect: "The exact same real relation Prisma's own include: { business: true } proves through the API, run directly in SQL.",
          },
          {
            label: "Clean up your test rows",
            sql: 'DELETE FROM node_express_learning_metaora_leads."Lead" WHERE name = \'pgAdmin4 Test\';\nDELETE FROM node_express_learning_metaora_leads."Business" WHERE name = \'pgAdmin4 Biz\';',
            expect: "Both rows you inserted are gone.",
          },
        ]}
      />
    ),
  },
  {
    heading: "PostgreSQL — JOIN + GROUP BY",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: 'A Table Alias (b, l) Is Just a Nickname You Invent, Right In the Query',
              description:
                'Writing "FROM businesses b" means "for the rest of THIS query, call the businesses table b instead." No special keyword is required — Postgres reads whatever word comes right after the table name as its nickname. It only exists for that one query; it changes nothing in the real table itself.',
              example: 'FROM businesses b   -- "b" now means "the businesses table", below',
            },
            {
              label: "Why Bother — b.id vs l.business_id Removes Ambiguity",
              description:
                'Once you JOIN two tables, they might both have a column with the same name (e.g. both could have their own "id"). Writing b.id ("the id column, FROM the businesses table") vs l.business_id ("the business_id column, FROM the leads table") tells Postgres exactly which table each column belongs to — that\'s the real reason for the dot notation, not just shorthand.',
            },
            {
              label: "JOIN Combines Rows From Two Real Tables",
              description: "ON says which columns must match. Plain JOIN means INNER JOIN — a row only survives if both sides have a real match.",
              example: "JOIN leads l ON l.business_id = b.id   -- \"l\" and \"b\" are the same nicknames from above",
            },
            {
              label: "LEFT JOIN Keeps Every Row From the Left Table",
              description: "Even ones with zero matches on the right — those columns come back as NULL (or 0, once GROUP BY's COUNT runs on them) instead of the whole row vanishing.",
            },
            {
              label: "GROUP BY Collapses Matching Rows Into One Summary Row",
              description: "Every business's own matching leads collapse into a single real row, with COUNT(l.id) as the real per-business total.",
            },
            {
              label: "An Index on leads.business_id Speeds Up the JOIN's Match",
              description: "Without it, matching every lead to its business means scanning the whole leads table per business. With it, Postgres can look matches up directly — but only when the table is big enough that a scan is genuinely expensive.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          INNER vs LEFT is a real, concrete difference in which rows even show up — not just a performance detail.
          And an index existing doesn&apos;t guarantee Postgres uses it: the real query planner decides based on real
          table size and statistics, which is exactly what the real EXPLAIN plan below proves.
        </Callout>
        <p>
          The demo below seeds 3 real businesses (one with zero recovered leads on purpose), runs Metaora&apos;s exact
          INNER JOIN report, then the LEFT JOIN version side by side — proving the one real business with no matches
          disappears from the first and shows a real 0 in the second.
        </p>
      </>
    ),
    extra: <InnerVsLeftJoinDiagram />,
    filePointers: [
      { path: "examples/Metaora/PostgresJoinGroupBy/setup.js", note: "Creates the real businesses/leads tables, the real foreign key, and the real index on leads.business_id." },
      { path: "examples/Metaora/PostgresJoinGroupBy/controllers/reports.controller.js", note: "Metaora's own exact JOIN + GROUP BY query, its LEFT JOIN twin, and the real EXPLAIN endpoint." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/Metaora/PostgresJoinGroupBy"
        runCommand="node server.js"
        runPort={4142}
        steps={[
          { method: "POST", path: "/businesses", body: JSON.stringify({ name: "Acme Roofing" }, null, 2), expectStatus: 201, expectBody: '{"id":1,"name":"Acme Roofing"}' },
          { method: "POST", path: "/businesses", body: JSON.stringify({ name: "Bright Plumbing" }, null, 2), expectStatus: 201, expectBody: '{"id":2,"name":"Bright Plumbing"}' },
          { method: "POST", path: "/businesses", body: JSON.stringify({ name: "NoLeadsCo" }, null, 2), expectStatus: 201, expectBody: '{"id":3,"name":"NoLeadsCo"}', note: "Deliberately never given a recovered lead below — proves the INNER vs LEFT difference." },
          { method: "POST", path: "/leads", body: JSON.stringify({ businessId: 1, status: "recovered" }, null, 2), expectStatus: 201, expectBody: '{"id":<a real integer>,"status":"recovered","businessId":1}' },
          { method: "POST", path: "/leads", body: JSON.stringify({ businessId: 1, status: "recovered" }, null, 2), expectStatus: 201, expectBody: '{"id":<a real integer>,"status":"recovered","businessId":1}' },
          { method: "POST", path: "/leads", body: JSON.stringify({ businessId: 1, status: "new" }, null, 2), expectStatus: 201, expectBody: '{"id":<a real integer>,"status":"new","businessId":1}', note: "A non-recovered lead, kept only to prove WHERE status = 'recovered' really filters." },
          { method: "POST", path: "/leads", body: JSON.stringify({ businessId: 2, status: "recovered" }, null, 2), expectStatus: 201, expectBody: '{"id":<a real integer>,"status":"recovered","businessId":2}' },
          {
            method: "GET",
            path: "/reports/recovered-leads-by-business",
            expectStatus: 200,
            expectBody: '[{"name":"Acme Roofing","recovered_leads":"2"},{"name":"Bright Plumbing","recovered_leads":"1"}]',
            note: "The real INNER JOIN report — NoLeadsCo has zero matching leads, so it never appears at all.",
          },
          {
            method: "GET",
            path: "/reports/all-businesses-lead-counts",
            expectStatus: 200,
            expectBody: '[{"name":"Acme Roofing","recovered_leads":"2"},{"name":"Bright Plumbing","recovered_leads":"1"},{"name":"NoLeadsCo","recovered_leads":"0"}]',
            note: "The LEFT JOIN twin — same query, NoLeadsCo now shows up with a real 0 instead of vanishing.",
          },
          {
            method: "GET",
            path: "/reports/explain-join",
            expectStatus: 200,
            expectBody:
              '["Sort  (cost=...)","  Sort Key: (count(l.id)) DESC","  ->  GroupAggregate  (cost=...)","        Group Key: b.name","        ->  Sort  (cost=...)","              Sort Key: b.name","              ->  Hash Join  (cost=...)","                    Hash Cond: (b.id = l.business_id)","                    ->  Seq Scan on businesses b  (cost=...)","                    ->  Hash  (cost=...)","                          ->  Seq Scan on leads l  (cost=...)","                                Filter: (status = \'recovered\'::text)"]',
            note: "Real, exact cost numbers vary run to run — the SHAPE of the real plan is what matters here.",
          },
          { method: "DELETE", path: "/leads", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every lead, used to reset between runs' },
          { method: "DELETE", path: "/businesses", expectStatus: 200, expectBody: '{"deletedCount":<a real number>} — clears every business, used to reset between runs' },
        ]}
      />
    ),
    pgAdminCheck: (
      <PgAdminCheck
        schema="node_express_learning_metaora_join"
        table="leads"
        queries={[
          {
            label: "Run Metaora's exact INNER JOIN report yourself",
            sql: "SELECT b.name, COUNT(l.id) AS recovered_leads\nFROM node_express_learning_metaora_join.businesses b\nJOIN node_express_learning_metaora_join.leads l ON l.business_id = b.id\nWHERE l.status = 'recovered'\nGROUP BY b.name\nORDER BY recovered_leads DESC;",
            expect: "One real summary row per business that has at least one recovered lead — the exact same report the API's /reports/recovered-leads-by-business returns.",
          },
          {
            label: "See the real index that exists on leads.business_id",
            sql: "SELECT indexname, indexdef\nFROM pg_indexes\nWHERE schemaname = 'node_express_learning_metaora_join' AND tablename = 'leads';",
            expect: "A real row named \"idx_leads_business_id\" — the exact index setup.js created, targeting the exact column the JOIN above matches on.",
          },
        ]}
      />
    ),
  },
  {
    heading: "TypeScript — Generics Fluency for the Interview",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "A Union Type Is a Real, Closed Set of Allowed Values",
              description: '"new" | "contacted" | "recovered" means status can ONLY ever be one of those 3 exact strings — anything else is a real compile-time error, not a runtime surprise.',
            },
            {
              label: "<T extends { status: string }> Is a Real Constraint, Not a Full Type",
              description: "T can be Lead, or any other real object shape with its own status field — the function works for all of them without being rewritten.",
            },
            {
              label: 'T["status"] Reads "Whatever Type T\'s OWN status Field Really Is"',
              description: "When T is inferred as Lead, T[\"status\"] becomes Lead's exact 3-value union — not a plain string — so a typo like \"archived\" is caught before the code ever runs.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          This exact pattern — a union type plus a generic function that stays constrained to it — is what lets a
          real interviewer hand you an unfamiliar type and expect you to reason about what a generic function
          actually returns, not just recognize the syntax.
        </Callout>
        <p>
          Verified for real below: the correct call actually runs and returns a genuinely new object (the original is
          untouched), and the deliberately wrong call — passing a status outside the union — is really rejected by
          tsc, with the exact real error message captured.
        </p>
      </>
    ),
    extra: <GenericConstraintDiagram />,
    filePointers: [
      { path: "examples/Metaora/TypeScriptInterviewFluency/lead.ts", note: "The real Lead interface and its real 3-value status union." },
      { path: "examples/Metaora/TypeScriptInterviewFluency/update-status.ts", note: "Metaora's own generic function snippet, kept exactly as given." },
      { path: "examples/Metaora/TypeScriptInterviewFluency/broken-usage.ts", note: "The deliberate mistake — kept isolated via its own tsconfig, never part of the real typecheck." },
    ],
    postmanCheck: <TryTypeScriptYourself />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Metaora&apos;s snippets read as a single, coherent backend: an Express route that never lets an async error
        escape uncaught, Prisma calls that map directly onto real SQL you could also write by hand, a real
        multi-table report built from a JOIN and a GROUP BY, and TypeScript generics precise enough to keep a status
        field honest at compile time. The four sections above aren&apos;t separate topics to Metaora — they&apos;re
        one real request (&quot;show me a recovered-lead report for this business&quot;) sliced by layer: the type
        that describes a Lead, the query that reads it, the ORM call that wraps that query, and the route that
        serves it safely.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a real request arrives", "an async route awaits a real Prisma/SQL call", "a genuine miss returns 404, a genuine throw calls next(err)", "one central error handler is the only place a real 500 gets built"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "next(err) — with a real argument — is what routes a thrown/rejected error to Express's own error-handling middleware, identified by its real 4-parameter signature (err, req, res, next).",
            "A plain JOIN defaults to INNER — a row only survives if both sides match. LEFT JOIN keeps every row from the left table regardless, which is exactly why a \"count per business, including zero\" report needs it instead.",
            "Prisma's include: { relation: true } is a second real query joined in application code, by default — not automatically one SQL JOIN, which matters when reasoning about real query counts.",
            "A generic constrained with T[\"keyof\"] (here T[\"status\"]) narrows to the CALLING type's own real field type — that's what makes one function type-safe across many different real shapes, without duplicating it per shape.",
          ]}
        />
      </>
    ),
  },
];

export default function MetaoraPage() {
  return (
    <StudyPage
      title="Metaora"
      stageLabel="Stage G — Company-Specific Interview Prep"
      stageColor="red"
      intro="Built directly from Metaora's own real job description, not a generic backend review. Four real mini-projects, one per snippet: an async Express route with a real central error handler, Prisma's 4 basic operations against a real relation, a real Postgres JOIN + GROUP BY report (INNER vs LEFT, plus a real EXPLAIN plan), and the TypeScript generics fluency their interview expects."
      sections={sections}
    />
  );
}
