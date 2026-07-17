import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import UnitTestingPureFunctionsRunner from "@/example-runners/TestingExpressApp/UnitTestingPureFunctionsRunner";
import IntegrationTestingWithSupertestRunner from "@/example-runners/TestingExpressApp/IntegrationTestingWithSupertestRunner";
import TestingErrorCasesRunner from "@/example-runners/TestingExpressApp/TestingErrorCasesRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function TestPyramidDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-green-500 mb-2.5">The real trade-off between the two kinds of tests on this page:</div>
      <div className="pl-2 mb-1.5 text-cyan-500">UNIT tests (section 1): test ONE plain function, alone. No server, no network, no database. Very fast. Very precise about what broke.</div>
      <div className="pl-2 mb-1.5 text-yellow-500">INTEGRATION tests (sections 2 &amp; 3): test real Express routes, real middleware, and real routing all working together. Slower than a unit test. But it catches real bugs a unit test can&apos;t see — like two middleware functions fighting over the same request.</div>
      <div className="mt-2 text-muted">
        A real backend test suite uses BOTH. Lots of small, fast unit tests for plain logic. A smaller number of integration tests for the routes and middleware that actually wire everything together.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Unit Testing Pure Functions with Jest",
    paragraphs: [
      "A unit test checks ONE small piece of code by itself. No server. No network call. No database. Just a real function, called directly, with a real check on what it gives back. This is the fastest and simplest kind of test there is.",
      "The demo below runs real Jest tests against a real discount-calculator function. It checks normal cases (a 25% discount, a 0% discount). It also checks that BAD input — a discount over 100% — really gets rejected with a real thrown error, instead of silently returning a wrong price.",
    ],
    demo: <UnitTestingPureFunctionsRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/UnitTestingPureFunctions/discountCalculator.js", note: "Two real, pure functions — no Express, no server." },
      { path: "examples/TestingExpressApp/UnitTestingPureFunctions/discountCalculator.test.js", note: "Real Jest describe/test/expect blocks, including a real toThrow() check." },
    ],
  },
  {
    heading: "Integration Testing Express Routes with Supertest",
    paragraphs: [
      "Supertest tests a REAL Express app — real routes, real middleware, real status codes — without needing a real open network port. request(app) hands Supertest the app object directly. It fakes a real HTTP request straight into Express's own request-handling code. This is faster than starting a real server and calling fetch() against a real URL, and it still exercises real Express behavior, not a fake stand-in.",
      "The demo below runs real Supertest tests against a real two-route tasks API. It checks that a real, existing task comes back with a 200 and the right real body. It also checks that asking for a task id that doesn't exist comes back with a real 404 — not a crash, not a hang, a real, predictable error response.",
    ],
    demo: <IntegrationTestingWithSupertestRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/server.js", note: "A real, small Express tasks API, exported without calling .listen()." },
      { path: "examples/TestingExpressApp/IntegrationTestingWithSupertest/server.test.js", note: "Real request(app) calls checking real status codes and real JSON bodies." },
    ],
  },
  {
    heading: "Testing Error Cases & Middleware",
    paragraphs: [
      "Testing only the happy path misses half of what a real backend job actually is. A real API also has to correctly REJECT bad input, and correctly survive a genuinely unexpected failure without crashing or leaking internal details to the client.",
      "The demo below proves two real things at once. First, a real validation middleware really blocks a request with a missing or empty title before the route handler ever runs, sending back a real 400 with a real error message. Second, a route handler that THROWS with no try/catch at all — on purpose, to simulate a real bug or a genuinely missing resource — still comes back as a safe, real 404 JSON body, not a crash. That's Express 5's real automatic promise-rejection forwarding, the same behavior from the Error Handling in Express topic, now proven by a real test instead of just described.",
    ],
    extra: <TestPyramidDiagram />,
    demo: <TestingErrorCasesRunner />,
    demoCommand: "npm test",
    filePointers: [
      { path: "examples/TestingExpressApp/TestingErrorCases/server.js", note: "Real validation middleware, a real thrown error, and a real centralized error-handling middleware." },
      { path: "examples/TestingExpressApp/TestingErrorCases/server.test.js", note: "Real tests for the 400 validation case AND the thrown-error 404 case." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Unit tests check one plain function, alone — fast, precise, no server needed. We proved this directly: the discount calculator's tests ran in a fraction of a second with zero setup. Integration tests check real Express routes and middleware working together, using Supertest's request(app) instead of a real open port. We proved both the happy path (a real 200 with the right body) and the sad path (a real 400 for bad input, a real 404 for a thrown error) really work, not just the happy path alone.",
      "A quick word on mocking, since it comes up in almost every backend testing interview: none of these tests mocked anything, because none of them touched a real external service (no real database, no real third-party API). If a route in a real job DID call out to something slow or unreliable — a payment API, an email service — you'd reach for Jest's jest.mock() to swap in a fake version just for the test, so the test stays fast and doesn't depend on that external service actually being up. That's a real, separate skill from what's proven on this page, worth knowing exists even though this page's examples didn't need it.",
    ],
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
      intro="Real Jest unit tests against plain functions, then real Supertest integration tests against a real Express app — proving both the happy path and the sad path (bad input, a thrown error) actually behave the way they're supposed to, not just describing that they should."
      sections={sections}
    />
  );
}
