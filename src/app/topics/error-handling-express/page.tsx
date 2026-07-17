import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import AutomaticForwardingRunner from "@/example-runners/ErrorHandlingExpress/AutomaticForwardingRunner";
import CentralizedErrorMiddlewareRunner from "@/example-runners/ErrorHandlingExpress/CentralizedErrorMiddlewareRunner";
import LegacyTryCatchRunner from "@/example-runners/ErrorHandlingExpress/LegacyTryCatchRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function AutoForwardDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "GET /risky comes in", caption: "A real request hits the async route handler." },
    { label: "the handler throws", caption: "No try/catch anywhere — this IS a rejected promise, whether you wrote \"promise\" anywhere or not." },
    { label: "Express 5 notices, on its own", caption: "No wrapper library, no try/catch in the route needed — Express 5 catches the rejection itself." },
    { label: "forwarded to error middleware", caption: "Exactly as if next(err) had been called by hand." },
    { label: "a real JSON response goes out", caption: "A clean error response — not a hang, not a crash." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What happens to a throw Express 5 never sees you catch</div>
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
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-green-500 text-xs">The route itself never mentions error handling at all — Express 5 does that part automatically.</span>
      </div>
    </div>
  );
}

function ErrorMiddlewareShapeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Express tells regular middleware and error middleware apart by ARGUMENT COUNT alone</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">(req, res, next) — 3 args</div>
          <div className="text-body text-xs leading-relaxed">Ordinary middleware. Runs on every matching request, error or not.</div>
        </div>
        <div className="rounded-card border border-purple-500 bg-purple-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-1">(err, req, res, next) — 4 args</div>
          <div className="text-body text-xs leading-relaxed">An ERROR handler. Express only calls this when something threw or forwarded an error — the 4th argument is what marks it.</div>
        </div>
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5 mt-3">
        <div className="text-sublabel text-xs uppercase tracking-wide mb-1.5">What decides the status code that comes back</div>
        <div className="flex flex-col gap-1.5">
          <div className="font-mono text-xs"><span className="text-green-500">AppError(&quot;msg&quot;, 404)</span><span className="text-body"> → real, chosen statusCode → </span><span className="text-green-500 font-semibold">404</span></div>
          <div className="font-mono text-xs"><span className="text-red-500">new Error(&quot;msg&quot;)</span><span className="text-body"> → no statusCode at all → falls back to </span><span className="text-red-500 font-semibold">500</span></div>
        </div>
      </div>
    </div>
  );
}

function FootgunDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same bug, same code shape — a genuinely different real outcome per Express version</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">Express 4, no try/catch</div>
          <div className="text-body text-xs leading-relaxed">The rejection is invisible to Express — nobody calls next(err). Modern Node.js treats an unhandled rejection as fatal: the ENTIRE server process crashes.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">Express 5, no try/catch</div>
          <div className="text-body text-xs leading-relaxed">Express itself notices the rejection and forwards it to error middleware automatically. The process stays alive.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Verified directly: a real, separately spawned Express 4 process hitting a route built this way exited with code 1 — a real observed crash, not folklore.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Express 5 Forwards a Rejected Promise Automatically",
    body: (
      <>
        <ConceptBreakdown
          items={[
            {
              label: "A Throwing Async Handler IS a Rejected Promise",
              description: "An async function that throws doesn't behave any differently than a normal function returning a promise that rejects.",
            },
            {
              label: "Express 5 Notices That Rejection Itself",
              description: "No wrapper library, no try/catch required IN THE ROUTE — Express 5 catches it and forwards it to error middleware automatically, exactly as if next(err) had been called.",
            },
            {
              label: "A Real Error Middleware Is Still Required",
              description: "Automatic forwarding means Express finds the error somewhere to go — not that you can skip building that somewhere. This example still ships a real one.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          A throwing async route handler doesn&apos;t need a try/catch on Express 5 — the rejection is real, and Express
          itself forwards it to error middleware automatically. That doesn&apos;t remove the need for a real error
          middleware, it just removes the boilerplate of wiring every route to reach it by hand.
        </Callout>
        <p>
          The demo below proves this with a route that throws, with no try/catch anywhere in the file, and shows it
          landing in a real error middleware — a clean JSON error response, not a hang. The server is still alive and
          serving other routes normally afterward too.
        </p>
      </>
    ),
    extra: <AutoForwardDiagram />,
    demo: <AutomaticForwardingRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/AutomaticForwarding/server.js",
      note: "A real, self-contained Express 5 app — a route that throws with no try/catch, a real error middleware it forwards into, and a healthy route to prove the process survived.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ErrorHandlingExpress/AutomaticForwarding"
        runCommand="node server.js"
        runPort={4021}
        steps={[
          { method: "GET", path: "/risky", expectStatus: 500, expectBody: '{"error":"Something broke inside this async handler"}' },
          { method: "GET", path: "/healthy", expectStatus: 200, expectBody: '{"status":"still running"}' },
        ]}
      />
    ),
  },
  {
    heading: "A Real Error Middleware, Custom Error Classes, Real Status Codes",
    body: (
      <>
        <p>
          Express&apos;s default error page (HTML, a raw stack trace) is fine for development but wrong for a real API. A
          real backend needs ONE centralized place that turns any error, from anywhere in the app, into a proper JSON
          response with the right status code.
        </p>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "4 Arguments Is What Makes It an Error Handler",
              description: "A function with exactly (err, req, res, next) — the argument count, not its name or file location, is what tells Express to treat it as an error handler instead of regular middleware.",
            },
            {
              label: "It Still Has to Be Registered Last",
              description: "Just like ordinary middleware, order still matters — it has to be registered AFTER the routes it's meant to protect.",
            },
            {
              label: "A Custom Error Class Carries Its Own Status Code",
              description: "AppError extends the built-in Error with an extra statusCode field, so a route can say exactly which HTTP status a specific failure deserves.",
              example: "throw new AppError(\"No user with id 999\", 404);",
            },
            {
              label: "No Custom Class, No Status Code — Falls Back to 500",
              description: "An error thrown without AppError (an ordinary, unplanned bug) has no statusCode, so the centralized handler falls back to 500.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          One centralized error middleware, identified purely by its 4-argument shape, is what turns every error in the
          app into the right HTTP status — a chosen statusCode when the app deliberately threw AppError, and a safe 500
          fallback for anything unplanned.
        </Callout>
        <p>
          The demo below proves three different real outcomes from the exact same centralized error middleware: a known
          user returns normally (200), a missing user throws AppError(&quot;...&quot;, 404) and gets back a real 404, and
          a totally unrelated, unplanned bug (a plain Error, no statusCode) falls through to a real 500.
        </p>
      </>
    ),
    extra: <ErrorMiddlewareShapeDiagram />,
    demo: <CentralizedErrorMiddlewareRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/CentralizedErrorMiddleware/server.js",
      note: "A real, self-contained Express 5 app — an AppError class, two routes that fail in different ways, one centralized 4-argument error middleware.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ErrorHandlingExpress/CentralizedErrorMiddleware"
        runCommand="node server.js"
        runPort={4022}
        steps={[
          { method: "GET", path: "/users/1", expectStatus: 200, expectBody: '{"id":"1","name":"User 1"}' },
          { method: "GET", path: "/users/999", expectStatus: 404, expectBody: '{"error":"No user with id 999"}' },
          { method: "GET", path: "/unexpected-bug", expectStatus: 500, expectBody: '{"error":"Something the developer didn\'t plan for"}' },
        ]}
      />
    ),
  },
  {
    heading: "The Legacy Pattern: Manual try/catch (Pre-Express-5)",
    body: (
      <>
        <p>
          This section deliberately installs Express 4, not Express 5 like every other example in this project — the
          whole point is proving, for real, the actual old failure mode Express 5 fixed, not just asserting it from
          memory.
        </p>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "The Old Folklore Was \"It Just Hangs\" — That's Outdated",
              description: "Verified directly against the current Node.js version: an unhandled promise rejection is treated as a FATAL error by modern Node (since Node 15).",
            },
            {
              label: "The Real Consequence: the Whole Process Crashes",
              description: "An Express 4 async handler that throws with no try/catch doesn't just hang that one request — it crashes the ENTIRE server process, taking every other in-flight request down with it.",
            },
            {
              label: "The Fix: Manual try/catch + next(err)",
              description: "The pattern every pre-Express-5 codebase relies on for EVERY single async route handler. Miss it once, on one route, and that route carries the same crash risk.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          On Express 4, a manual try/catch + next(err) isn&apos;t a nice-to-have, it&apos;s the one thing standing
          between an async route and a full process crash. Skipping it on even one route carries that same real risk.
        </Callout>
        <p>
          The demo below proves the correct Express-4-style pattern for real: /with-trycatch throws the same kind of
          error as the broken version, but the manual try/catch + next(err) gets a real, ordinary error response back.
          The broken version — an identical throw with no try/catch — isn&apos;t shipped as real code here; it&apos;s
          written out as a comment in server.js instead, along with the real, verified consequence above.
        </p>
      </>
    ),
    extra: <FootgunDiagram />,
    demo: <LegacyTryCatchRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/LegacyTryCatch/server.js",
      note: "A real, self-contained Express 4 app (its own package.json pins express@4, unlike every other example here) — the correct try/catch + next(err) pattern is the only code that actually runs; the crash-causing mistake is written out only as a comment.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ErrorHandlingExpress/LegacyTryCatch"
        runCommand="node server.js"
        runPort={4023}
        steps={[
          { method: "GET", path: "/with-trycatch", expectStatus: 500, expectBody: '{"error":"Simulated failure, handled the Express-4 way"}' },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Express 5&apos;s headline error-handling change is automatic forwarding of a rejected promise from an
        async route handler — no try/catch, no wrapper library required. Contrary to the old &quot;it just hangs&quot;
        folklore about Express 4, the real stakes are higher than that: on modern Node.js, an uncaught rejection in
        Express 4 crashes the entire process, not just one request. A centralized error-handling middleware is
        recognized purely by its 4-argument shape, (err, req, res, next), must be registered after the routes it
        covers, and a custom error class carrying its own statusCode is what lets that one centralized place send back
        the RIGHT status code per failure instead of defaulting everything to 500.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["route throws / rejects", "Express 5 forwards automatically", "error middleware (err, req, res, next)", "real status code + JSON response"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Express 5 forwards a rejected promise from an async handler to error middleware automatically — no try/catch or wrapper library needed, unlike Express 4.",
            "An error-handling middleware is identified by having exactly 4 arguments, (err, req, res, next) — not by name or file location — and must be registered after the routes it covers.",
            "A custom error class carrying a statusCode lets centralized error handling send back the right HTTP status per failure; errors with no statusCode should default to 500.",
            "On Express 4, an async handler that throws with no try/catch doesn't just hang — on modern Node.js, the unhandled rejection crashes the whole process, taking every other in-flight request down with it.",
          ]}
        />
      </>
    ),
  },
];

export default function ErrorHandlingExpressPage() {
  return (
    <StudyPage
      title="Error Handling in Express"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="What happens to an error nobody explicitly catches is one of the sharpest real differences between Express 4 and Express 5 — and it's bigger than most descriptions of it let on. This topic proves Express 5's automatic rejected-promise forwarding, builds a real centralized error middleware with custom error classes for real status codes, and verifies the actual, current-Node.js legacy failure mode directly instead of repeating outdated folklore about it."
      sections={sections}
    />
  );
}
