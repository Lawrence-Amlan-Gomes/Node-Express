import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import StatusCodesVersioningRunner from "@/example-runners/RestConventionsValidation/StatusCodesVersioningRunner";
import CursorVsOffsetPaginationRunner from "@/example-runners/RestConventionsValidation/CursorVsOffsetPaginationRunner";
import IdempotencyKeysRunner from "@/example-runners/RestConventionsValidation/IdempotencyKeysRunner";
import ZodValidationRunner from "@/example-runners/RestConventionsValidation/ZodValidationRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-18.

function StatusCodeMeaningDiagram() {
  const codes: { code: string; name: string; tone: "green" | "yellow" | "red"; caption: string; example: string }[] = [
    { code: "200", name: "OK", tone: "green", caption: "Something worked, and here is the real data you asked for.", example: "GET /todos → the real, current list" },
    { code: "201", name: "Created", tone: "green", caption: "A new real thing was really made — plus a Location header pointing right at it.", example: "POST /todos → the new todo, at its own URL" },
    { code: "204", name: "No Content", tone: "green", caption: "It worked, but there is truly nothing left to send back.", example: "DELETE /todos/2 → a real, empty body" },
    { code: "400", name: "Bad Request", tone: "yellow", caption: "The CLIENT sent something wrong — missing or broken data.", example: "POST /todos with no title → rejected" },
    { code: "404", name: "Not Found", tone: "red", caption: "This exact thing genuinely does not exist.", example: "GET /todos/999999 → nothing there" },
  ];
  const toneClasses: Record<string, string> = {
    green: "border-green-500 bg-green-500/3 text-green-500",
    yellow: "border-yellow-500 bg-yellow-500/3 text-yellow-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
  };
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Five real status codes, each meaning one specific thing a client can act on</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {codes.map((c) => (
          <div key={c.code} className={`rounded-card border px-3 py-2.5 ${toneClasses[c.tone]}`}>
            <div className="font-mono text-sm font-bold">{c.code} — {c.name}</div>
            <div className="text-body text-xs leading-relaxed mt-1">{c.caption}</div>
            <div className="text-sublabel text-xs mt-1 font-mono">{c.example}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-blue-500 bg-blue-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-blue-500 text-xs">A client can often know what happened from the number ALONE — before it even looks at the response body.</span>
      </div>
    </div>
  );
}

function PaginationCostDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-yellow-500 mb-2.5">Real, measured Postgres time — fetching the SAME 20 rows from a real 100,000-row table:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">GET /todos?offset=90000&amp;limit=20 → 19.652 ms (touches all 90,020 rows to get there, then throws 90,000 away)</div>
      <div className="pl-2 mb-1.5 text-green-500">GET /todos?cursor=90000&amp;limit=20 → 0.082 ms (jumps straight to row 90,001 using the primary key index)</div>
      <div className="mt-2 text-sublabel">
        Over 200 times apart, at just 100,000 rows, checked directly. The exact ratio shifts a little run to run (network noise to a real remote server) — but the ROW COUNT each query actually touches (90,020 vs 20) never changes, and that&apos;s the real reason for the gap.
      </div>
    </div>
  );
}

function IdempotencyKeyFlowDiagram() {
  const steps: { label: string; caption: string; tone: "orange" | "green" | "cyan" }[] = [
    { label: "1. POST /charges, key=\"abc123\"", caption: "A genuinely NEW key — the server really processes it. charge #1 is created for real.", tone: "orange" },
    { label: "2. Response gets lost on the way back", caption: "The charge already happened. The CLIENT just doesn't know that yet.", tone: "orange" },
    { label: "3. POST /charges again, SAME key=\"abc123\"", caption: "The server recognizes this exact key was already used — it does NOT charge again.", tone: "green" },
    { label: "4. Server replies with the ORIGINAL charge #1", caption: "Same chargeId as step 1, marked replayed: true. Still only ONE real charge exists.", tone: "green" },
    { label: "5. POST /charges, a truly DIFFERENT key", caption: "A new key means a new logical request — this one really does create charge #2.", tone: "cyan" },
  ];
  const toneClasses: Record<string, string> = {
    orange: "border-orange-500 bg-orange-500/3 text-orange-500",
    green: "border-green-500 bg-green-500/3 text-green-500",
    cyan: "border-cyan-500 bg-cyan-500/3 text-cyan-500",
  };
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A real retried request, step by step — checked directly against the running server</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => (
          <div key={step.label} className={`rounded-card border px-3 py-2 ${toneClasses[step.tone]}`}>
            <div className="font-mono text-xs font-semibold">{step.label}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{step.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-purple-500 bg-purple-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-purple-500 text-xs">The server never trusts &quot;did the client mean to retry?&quot; — it trusts the KEY. Same key, same logical request, no matter how many times it arrives.</span>
      </div>
    </div>
  );
}

function CompileTimeVsRuntimeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real, different moments a type gets checked</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">TypeScript&apos;s types — COMPILE TIME</div>
          <div className="text-body text-xs leading-relaxed">Checked once, before the app even runs. The instant a real request arrives over the network, those types are already gone — erased from the compiled JavaScript.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">zod&apos;s schema — RUNTIME</div>
          <div className="text-body text-xs leading-relaxed">Checked on every single real request, while the app is live. It looks at the ACTUAL bytes a client sent, not what a type promised they&apos;d look like.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">A malicious or buggy client can send anything at all, regardless of what TypeScript &quot;promised.&quot; Only a real runtime check like zod can catch that.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Status Codes & URL-Path Versioning",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "A Status Code Is Part of the Answer, Not Decoration",
              description: "A client can often know what really happened from that one number alone — no need to parse the response body first.",
              example: "201 means something was really just created. 404 means this exact thing does not exist.",
            },
            {
              label: "400 vs 500 — Whose Fault Was It, Really",
              description: "400 means the CLIENT sent something wrong. 500 means the SERVER itself broke. Mixing these up hides real bugs from whoever is debugging later.",
            },
            {
              label: "The Version Lives Right in the URL Path",
              description: "/api/v1/... stays the real 2026 gold standard — it's easy to see, and it works well with caching. A CDN can key on the URL alone, no special header needed.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          A REST API&apos;s status code is a real, meaningful signal — not just decoration on top of a 200. Use
          201/204/400/404 on purpose, and put the version in the URL path, because that stays easy to read and
          cache-friendly.
        </Callout>
        <p>
          The demo below runs a real /api/v1 Express API. It prints the REAL status code sent back for every real
          outcome: a working list (200), a working create (201, with a real Location header), a rejected create with
          missing data (400), finding something (200) versus not finding it (404), and a working delete with a real,
          truly empty body (204).
        </p>
      </>
    ),
    extra: <StatusCodeMeaningDiagram />,
    demo: <StatusCodesVersioningRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/StatusCodesVersioning/routes/todos.routes.js", note: "Declares which path/method maps to which controller function — no status-code logic here at all." },
      { path: "examples/RestConventionsValidation/StatusCodesVersioning/controllers/todos.controller.js", note: "The ONLY file that decides which real status code each outcome gets." },
      { path: "examples/RestConventionsValidation/StatusCodesVersioning/demo.js", note: "Calls the real, running API over real HTTP and prints every real status code returned." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/RestConventionsValidation/StatusCodesVersioning"
        runCommand="node server.js"
        runPort={4070}
        steps={[
          { method: "GET", path: "/api/v1/todos", expectStatus: 200, expectBody: '[{"id":1,"title":"Learn REST status codes","done":false}]' },
          {
            method: "POST",
            path: "/api/v1/todos",
            body: JSON.stringify({ title: "Try it in Postman" }, null, 2),
            expectStatus: 201,
            expectBody: 'The new real todo, plus a Location: /api/v1/todos/2 response header.',
          },
          { method: "POST", path: "/api/v1/todos", body: JSON.stringify({}, null, 2), expectStatus: 400, expectBody: '{"error":"title is required"}' },
          { method: "GET", path: "/api/v1/todos/1", expectStatus: 200, expectBody: '{"id":1,"title":"Learn REST status codes","done":false}' },
          { method: "GET", path: "/api/v1/todos/999999", expectStatus: 404, expectBody: '{"error":"todo not found"}' },
          { method: "DELETE", path: "/api/v1/todos/1", expectStatus: 204, expectBody: "A real, truly empty body — no JSON at all." },
        ]}
      />
    ),
  },
  {
    heading: "Cursor vs Offset Pagination",
    body: (
      <>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "Offset Says \"Skip N Rows\" — Every Single Time",
              description: "\"Skip the first 90,000 rows, give me the next 20\" is easy to write, but the database really has to walk through and throw away every skipped row, every time it runs.",
              example: "GET /todos?offset=90000&limit=20",
            },
            {
              label: "Cursor Says \"Give Me Rows AFTER the Last One I Saw\"",
              description: "It uses the table's own index to jump straight to the right spot, no matter how deep into the list you are — no counting required.",
              example: "GET /todos?cursor=90000&limit=20",
            },
            {
              label: "This Is a Real, Layered Express API, Same as Every Other Section",
              description: "server.js wires things together, routes/todos.routes.js declares the endpoints, and controllers/todos.controller.js is the ONLY file that actually talks to Prisma and runs EXPLAIN ANALYZE.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          Offset pagination gets slower the deeper you page, because it must scan and discard every row it skips.
          Cursor pagination stays fast no matter how deep you go, because it jumps straight there using the
          table&apos;s own primary-key index.
        </Callout>
        <p>
          The demo below doesn&apos;t just say this is true — it measures it, over real HTTP, against a real remote
          Postgres table filled with 100,000 real rows. It uses a real Postgres tool called EXPLAIN ANALYZE, which
          reports the real time a query actually took. The query plan shows exactly why: the OFFSET version touches
          90,020 rows just to get there; the cursor version only ever touches the 20 rows it actually returns.
        </p>
      </>
    ),
    extra: <PaginationCostDiagram />,
    demo: <CursorVsOffsetPaginationRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/CursorVsOffsetPagination/routes/todos.routes.js", note: "Declares which path/method maps to which controller function — no Prisma code here at all." },
      { path: "examples/RestConventionsValidation/CursorVsOffsetPagination/controllers/todos.controller.js", note: "The ONLY file that talks to Prisma — runs EXPLAIN ANALYZE for both the offset and the cursor query." },
      { path: "examples/RestConventionsValidation/CursorVsOffsetPagination/demo.js", note: "Calls the real, running API over real HTTP — this file never imports Prisma at all." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/RestConventionsValidation/CursorVsOffsetPagination"
        runCommand="node server.js"
        runPort={4071}
        steps={[
          { method: "POST", path: "/todos/seed", expectStatus: 201, expectBody: '{"seeded":100000}' },
          { method: "GET", path: "/todos?offset=90000&limit=20", expectStatus: 200, expectBody: 'The real query plan — Execution Time around 15-60 ms, touching all 90,020 rows.' },
          { method: "GET", path: "/todos?cursor=90000&limit=20", expectStatus: 200, expectBody: 'The real query plan — Execution Time well under 1 ms, touching only 20 rows.' },
          { method: "DELETE", path: "/todos", expectStatus: 200, expectBody: '{"cleared":true}' },
        ]}
      />
    ),
  },
  {
    heading: "Idempotency Keys",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "The Real Problem: a Response Can Get Lost",
              description: "A charge request really works on the server. But the reply never makes it back — a slow network, a dropped connection. The client doesn't know it already worked, so it safely retries.",
            },
            {
              label: "Without Protection, a Retry Means a SECOND Real Charge",
              description: "The server has no way to tell \"this is a brand-new request\" apart from \"this is the same request, arriving twice.\"",
            },
            {
              label: "An Idempotency Key Is the Fix",
              description: "One random value the client makes up once, and sends again, unchanged, if it ever retries. This is the real pattern Stripe and PayPal actually use.",
              example: "Idempotency-Key: abc123 — sent on both the original request AND the retry",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          The server keys on the Idempotency-Key header, not on how many times a request arrives. The exact same key,
          sent twice, produces exactly ONE real charge — the server just replays the first result on the second try.
        </Callout>
        <p>
          The demo below proves the real result. The exact same idempotency key, sent twice, only makes ONE real
          charge — the server sees the repeated key and just sends back the FIRST result again. A genuinely different
          key, with the same amount, does make a new charge. This proves the server is really checking that key.
        </p>
      </>
    ),
    extra: <IdempotencyKeyFlowDiagram />,
    demo: <IdempotencyKeysRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/IdempotencyKeys/routes/charges.routes.js", note: "Declares which path/method maps to which controller function — no idempotency logic here at all." },
      { path: "examples/RestConventionsValidation/IdempotencyKeys/controllers/charges.controller.js", note: "The ONLY file that checks the Idempotency-Key map — real charge-or-replay logic lives here." },
      { path: "examples/RestConventionsValidation/IdempotencyKeys/demo.js", note: "Calls the real, running API over real HTTP and proves a retried request returns the cached result instead of double-charging." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/RestConventionsValidation/IdempotencyKeys"
        runCommand="node server.js"
        runPort={4072}
        steps={[
          {
            method: "POST",
            path: "/charges",
            body: JSON.stringify({ amount: 50 }, null, 2),
            expectStatus: 201,
            expectBody: '{"chargeId":1,"amount":50,"replayed":false} (also send header Idempotency-Key: postman-test-key-1)',
          },
          {
            method: "POST",
            path: "/charges",
            body: JSON.stringify({ amount: 50 }, null, 2),
            expectStatus: 200,
            expectBody: '{"chargeId":1,"amount":50,"replayed":true} (SAME Idempotency-Key header as above — the retry)',
          },
          { method: "GET", path: "/charges/count", expectStatus: 200, expectBody: '{"totalChargesProcessed":1}' },
        ]}
      />
    ),
  },
  {
    heading: "Real Input Validation with Zod",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "TypeScript's Types Disappear the Moment Code Actually Runs",
              description: "They cannot stop a real network request from sending junk — a missing field, a string where a number should be, a broken email address.",
            },
            {
              label: "zod Checks the ACTUAL Shape of a Request, Live",
              description: "You write down the shape once, and zod checks every real request against it while the app is running — not just while you're typing the code.",
              example: "z.object({ name: z.string().min(1), email: z.email(), age: z.number().int().positive() })",
            },
            {
              label: "safeParse Gives Back a Clear List of What's Wrong",
              description: "Instead of a vague \"invalid input\" message, z.flattenError returns one message PER field — genuinely useful for a frontend to show next to the right form field.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          TypeScript and zod solve two different problems — one checks your OWN code while you write it, the other
          checks REAL, live data while the app runs. A real backend needs both; neither one replaces the other.
        </Callout>
        <p>
          The demo below sends a truly broken body — an empty name, a broken email, a negative age — to a real
          Express route. It gets back a real 400, with a real error message for each field. Then it sends a truly
          good body, and gets back a real 201 with the checked, clean data.
        </p>
      </>
    ),
    extra: <CompileTimeVsRuntimeDiagram />,
    demo: <ZodValidationRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/RestConventionsValidation/ZodValidation/routes/users.routes.js", note: "Declares which path/method maps to which controller function — no zod logic here at all." },
      { path: "examples/RestConventionsValidation/ZodValidation/controllers/users.controller.js", note: "The ONLY file that imports zod — the real schema and safeParse validation live here." },
      { path: "examples/RestConventionsValidation/ZodValidation/demo.js", note: "Calls the real, running API over real HTTP, proving the real 400/201 responses." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/RestConventionsValidation/ZodValidation"
        runCommand="node server.js"
        runPort={4073}
        steps={[
          {
            method: "POST",
            path: "/users",
            body: JSON.stringify({ name: "", email: "not-an-email", age: -5 }, null, 2),
            expectStatus: 400,
            expectBody: '{"errors":{"name":["name is required"],"email":["must be a valid email address"],"age":["age must be a positive whole number"]}}',
          },
          {
            method: "POST",
            path: "/users",
            body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com", age: 28 }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":1,"name":"Ada Lovelace","email":"ada@example.com","age":28}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A status code is a real part of the answer, not just decoration. 201, 204, 400, and 404 each
        mean one specific thing a client can act on. Putting the version in the URL path stays the standard, because
        it&apos;s clear and works well with caching. Offset pagination is a real, measured slowdown once a table gets
        big — it has to scan and throw away every skipped row, checked here directly against a real 100,000-row
        table. Cursor pagination fixes it by using the table&apos;s own index instead of counting rows. Idempotency
        keys are the real pattern Stripe and PayPal use to make a retried charge safe — the server keys on the
        header, not on how many times the request shows up. Real input validation with zod checks the data
        TypeScript&apos;s types can&apos;t check once the app is actually running.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["a client sends a request", "validate the body for real (zod) before touching it", "does it CREATE something? → 201, not 200", "does it need to be retry-safe? → check the Idempotency-Key first", "paginating deep? → cursor, not OFFSET"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Status codes are a real, meaningful part of an API — use 201/204/400/404 on purpose, instead of just sending 200 for everything.",
            "Offset pagination gets slower the deeper you page, because it has to scan and throw away every skipped row — reach for cursor pagination once a table gets any real size.",
            "Idempotency keys are how Stripe and PayPal make a retried charge (or any request with a real side effect) safe — the server spots a repeated key and sends back the first result again, instead of doing the action twice.",
            "zod checks real, live data while the app runs — something TypeScript's types cannot do on their own. The two work together, they don't replace each other.",
          ]}
        />
      </>
    ),
  },
];

export default function RestConventionsValidationPage() {
  return (
    <StudyPage
      title="REST Conventions & Validation"
      stageLabel="Stage D — API Design & Real-World Concerns"
      stageColor="yellow"
      intro="Four real, separate ideas about building a good API, each one proven rather than just talked about: the real status code sent back for every outcome on a real /api/v1 Express API, a measured, roughly 200x-plus real speed gap between offset and cursor pagination on a real 100,000-row Postgres table, a real idempotency-key setup that stops a retried charge from double-billing, and real, live input checking with zod."
      sections={sections}
    />
  );
}
