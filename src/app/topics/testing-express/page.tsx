import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import UnitTestingPureFunctionsRunner from "@/example-runners/TestingExpressApp/UnitTestingPureFunctionsRunner";
import IntegrationTestingWithSupertestRunner from "@/example-runners/TestingExpressApp/IntegrationTestingWithSupertestRunner";
import TestingErrorCasesRunner from "@/example-runners/TestingExpressApp/TestingErrorCasesRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-18.

function UnitTestCasesDiagram() {
  const rows: { call: string; result: string; tone: "green" | "red" }[] = [
    { call: "calculateDiscountedPrice(2000, 25)", result: "→ 1500 (a normal 25% discount)", tone: "green" },
    { call: "calculateDiscountedPrice(2000, 0)", result: "→ 2000 (no discount, unchanged)", tone: "green" },
    { call: "calculateDiscountedPrice(2000, 100)", result: "→ 0 (a full discount)", tone: "green" },
    { call: "calculateDiscountedPrice(2000, 150)", result: "→ throws (150% makes no real sense)", tone: "red" },
    { call: "calculateDiscountedPrice(2000, -10)", result: "→ throws (a negative percent makes no real sense either)", tone: "red" },
  ];
  const toneClasses: Record<string, string> = {
    green: "border-green-500 bg-green-500/3 text-green-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
  };
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Five real calls to ONE plain function — no server, no network, checked directly</div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.call} className={`rounded-card border px-3 py-2 ${toneClasses[row.tone]}`}>
            <div className="font-mono text-xs font-semibold break-all">{row.call}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{row.result}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">No app.listen(), no fetch(), no database — just calling the real function directly and checking its real return value (or its real thrown error).</span>
      </div>
    </div>
  );
}

function SupertestFlowDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real ways to test the SAME Express route</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">A real fetch() against a real port</div>
          <div className="text-body text-xs leading-relaxed">app.listen() really opens a real network port. The test sends a real HTTP request over it, then has to remember to close it. Real network overhead on every single test.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">request(app) — no port at all</div>
          <div className="text-body text-xs leading-relaxed">Supertest hands requests straight into Express&apos;s own real request-handling code, in memory. Same real routing, same real middleware, same real status codes — no network, no listen(), no close().</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">This is genuinely an INTEGRATION test, not a unit test — it exercises the real route handler AND Express&apos;s real routing/middleware together, checked here across both a real 200 (task exists) and a real 404 (task doesn&apos;t).</span>
      </div>
    </div>
  );
}

function TestPyramidDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The real trade-off between the two kinds of tests on this page</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">UNIT tests (section 1)</div>
          <div className="text-body text-xs leading-relaxed">Test ONE plain function, alone. No server, no network, no database. Very fast. Very precise about what broke.</div>
        </div>
        <div className="rounded-card border border-orange-500 bg-orange-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-orange-500 font-semibold mb-1">INTEGRATION tests (sections 2 &amp; 3)</div>
          <div className="text-body text-xs leading-relaxed">Test real Express routes, real middleware, and real routing all working together. Slower than a unit test, but catches real bugs a unit test can&apos;t see — like two middleware functions fighting over the same request.</div>
        </div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-green-500 text-xs">A real backend test suite uses BOTH — lots of small, fast unit tests for plain logic, and a smaller number of integration tests for the routes and middleware that actually wire everything together.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Unit Testing Pure Functions with Jest",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "A Unit Test Checks ONE Small Piece of Code, Alone",
              description: "No server. No network call. No database. Just a real function, called directly, with a real check on what it gives back. This is the fastest and simplest kind of test there is.",
            },
            {
              label: "Testing BAD Input Matters Just as Much as the Happy Path",
              description: "A real function that silently accepts nonsense input is a real production bug waiting to happen. toThrow() checks that calling the function really does throw a real Error.",
            },
            {
              label: "Jest's Three Building Blocks",
              description: "describe() groups related tests for readable output. test() (or its alias it()) is one real test case. expect(value).toBe(x) is the real assertion — if it doesn't match, Jest shows exactly what it got instead of what was expected.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A unit test needs nothing but the real function itself — no Express, no server, no setup — which is
          exactly what makes it the fastest, cheapest test to write and run.
        </Callout>
        <p>
          The demo below runs real Jest tests against a real discount-calculator function. It checks normal cases (a
          25% discount, a 0% discount, a 100% discount). It also checks that BAD input — a discount over 100%, or a
          negative one — really gets rejected with a real thrown error, instead of silently returning a wrong price.
        </p>
      </>
    ),
    extra: <UnitTestCasesDiagram />,
    demo: <UnitTestingPureFunctionsRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/UnitTestingPureFunctions/discountCalculator.js", note: "Two real, pure functions — no Express, no server. Deliberately NOT a real API, since this section is about testing plain logic in isolation." },
      { path: "examples/TestingExpressApp/UnitTestingPureFunctions/discountCalculator.test.js", note: "Real Jest describe/test/expect blocks, including a real toThrow() check." },
    ],
  },
  {
    heading: "Integration Testing Express Routes with Supertest",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "Supertest Tests a REAL Express App",
              description: "Real routes, real middleware, real status codes — without needing a real open network port.",
            },
            {
              label: "request(app) Hands Supertest the App Object Directly",
              description: "It fakes a real HTTP request straight into Express's own request-handling code — faster than starting a real server and calling fetch() against a real URL, and it still exercises real Express behavior, not a fake stand-in.",
              example: "const res = await request(app).get(\"/tasks/2\"); expect(res.status).toBe(200);",
            },
            {
              label: "Same Real Layering as Every Other Topic",
              description: "server.js wires the app together, routes/tasks.routes.js declares the two endpoints, and controllers/tasks.controller.js holds the real handler logic — the test file imports the same app export either way.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          An integration test exercises the real route handler AND Express&apos;s real routing/middleware together —
          request(app) gets you that without ever opening a real network port.
        </Callout>
        <p>
          The demo below runs real Supertest tests against a real two-route tasks API. It checks that a real,
          existing task comes back with a 200 and the right real body. It also checks that asking for a task id that
          doesn&apos;t exist comes back with a real 404 — not a crash, not a hang, a real, predictable error
          response.
        </p>
      </>
    ),
    extra: <SupertestFlowDiagram />,
    demo: <IntegrationTestingWithSupertestRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/routes/tasks.routes.js", note: "Declares which path/method maps to which controller function — no response logic here at all." },
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/controllers/tasks.controller.js", note: "The real handler logic Supertest actually exercises." },
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/server.js", note: "A real, small Express tasks API, exported without calling .listen() during a test." },
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/server.test.js", note: "Real request(app) calls checking real status codes and real JSON bodies." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/TestingExpressApp/IntegrationTestingWithSupertest"
        runCommand="node server.js"
        runPort={4060}
        steps={[
          { method: "GET", path: "/tasks", note: "The real, full seeded list.", expectStatus: 200, expectBody: '[{"id":1,"title":"Write tests","done":false},{"id":2,"title":"Ship the feature","done":false}]' },
          { method: "GET", path: "/tasks/2", note: "An id that genuinely exists.", expectStatus: 200, expectBody: '{"id":2,"title":"Ship the feature","done":false}' },
          { method: "GET", path: "/tasks/999", note: "An id that was never seeded.", expectStatus: 404, expectBody: '{"error":"task not found"}' },
        ]}
      />
    ),
  },
  {
    heading: "Testing Error Cases & Middleware",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "Testing Only the Happy Path Misses Half the Job",
              description: "A real API also has to correctly REJECT bad input, and correctly survive a genuinely unexpected failure without crashing or leaking internal details to the client.",
            },
            {
              label: "Validation Middleware Runs BEFORE the Real Route Handler",
              description: "A missing or empty title gets blocked with a real 400, before the route handler that creates a task ever runs at all.",
            },
            {
              label: "A Thrown Error Doesn't Crash Express 5 — It Gets Forwarded Automatically",
              description: "A route handler that THROWS with no try/catch — on purpose, to simulate a real bug or a genuinely missing resource — still comes back as a safe, real 404 JSON body, not a crash. The same real Express 5 behavior from the Error Handling in Express topic, now proven by a real test.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          Testing the SAD path — bad input, a thrown error — is just as real a job as testing the happy path, and
          it&apos;s exactly as testable with the same request(app) pattern.
        </Callout>
        <p>
          The demo below proves two real things at once. First, a real validation middleware really blocks a request
          with a missing or empty title before the route handler ever runs, sending back a real 400 with a real
          error message. Second, a route handler that THROWS with no try/catch at all still comes back as a safe,
          real 404 JSON body, not a crash — Express 5&apos;s real automatic promise-rejection forwarding, proven by a
          real test instead of just described.
        </p>
      </>
    ),
    extra: <TestPyramidDiagram />,
    demo: <TestingErrorCasesRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/TestingErrorCases/routes/tasks.routes.js", note: "Declares the two endpoints AND which real middleware (validateNewTask) runs in front of one of them." },
      { path: "examples/TestingExpressApp/TestingErrorCases/controllers/tasks.controller.js", note: "The real validation middleware, the real custom Error classes, and the real handler that throws on purpose." },
      { path: "examples/TestingExpressApp/TestingErrorCases/server.js", note: "The real centralized error-handling middleware — app-level, so it lives here, not in a controller." },
      { path: "examples/TestingExpressApp/TestingErrorCases/server.test.js", note: "Real tests for the 400 validation case AND the thrown-error 404 case." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/TestingExpressApp/TestingErrorCases"
        runCommand="node server.js"
        runPort={4077}
        steps={[
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({ title: "Ship the feature" }, null, 2),
            note: "A genuinely valid title.",
            expectStatus: 201,
            expectBody: '{"id":2,"title":"Ship the feature","done":false}',
          },
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({}, null, 2),
            note: "No title field at all.",
            expectStatus: 400,
            expectBody: '{"error":"title is required and must be a non-empty string"}',
          },
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({ title: "   " }, null, 2),
            note: "A title that's only whitespace.",
            expectStatus: 400,
            expectBody: '{"error":"title is required and must be a non-empty string"}',
          },
          { method: "PATCH", path: "/tasks/1/complete", note: "An id that genuinely exists.", expectStatus: 200, expectBody: '{"id":1,"title":"Write tests","done":true}' },
          { method: "PATCH", path: "/tasks/999/complete", note: "An id that was never seeded — makes the handler throw.", expectStatus: 404, expectBody: '{"error":"no task with id 999"}' },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Unit tests check one plain function, alone — fast, precise, no server needed. We proved this
        directly: the discount calculator&apos;s tests ran in a fraction of a second with zero setup. Integration
        tests check real Express routes and middleware working together, using Supertest&apos;s request(app) instead
        of a real open port. We proved both the happy path (a real 200 with the right body) and the sad path (a real
        400 for bad input, a real 404 for a thrown error) really work, not just the happy path alone. A quick word on
        mocking, since it comes up in almost every backend testing interview: none of these tests mocked anything,
        because none of them touched a real external service (no real database, no real third-party API). If a route
        in a real job DID call out to something slow or unreliable — a payment API, an email service — you&apos;d
        reach for Jest&apos;s jest.mock() to swap in a fake version just for the test, so the test stays fast and
        doesn&apos;t depend on that external service actually being up. That&apos;s a real, separate skill from
        what&apos;s proven on this page, worth knowing exists even though this page&apos;s examples didn&apos;t need
        it.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["write the real code", "write a real test that calls it directly (unit) or through request(app) (integration)", "run npm test", "a red failure means real, actionable info about what broke — not a guess"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Unit tests check one function in isolation; integration tests check real routes and middleware working together — a real test suite needs both, not just one.",
            "Supertest's request(app) tests the real Express app object directly, with no real network port needed — checked here across three real mini-projects, all passing.",
            "Testing the SAD path (bad input, a thrown error, a missing resource) is just as real a job as testing the happy path — checked here with a real 400 from validation middleware and a real 404 from a thrown, uncaught error.",
            "Express 5's automatic promise-rejection forwarding (from the Error Handling in Express topic) isn't just a nice runtime behavior — it's directly testable, and this page proved it with a real Supertest assertion, not just a description.",
            "jest.mock() exists for when a real test would otherwise depend on a slow or unreliable external service (a payment API, a real email provider) — swap in a fake just for the test, so the test stays fast and repeatable.",
          ]}
        />
      </>
    ),
  },
];

export default function TestingExpressPage() {
  return (
    <StudyPage
      title="Testing an Express App"
      stageLabel="Stage E — Testing, Tooling & Production Readiness"
      stageColor="green"
      intro="Real Jest unit tests against plain functions, then real Supertest integration tests against a real, layered Express app — proving both the happy path and the sad path (bad input, a thrown error) actually behave the way they're supposed to, not just describing that they should."
      sections={sections}
    />
  );
}
