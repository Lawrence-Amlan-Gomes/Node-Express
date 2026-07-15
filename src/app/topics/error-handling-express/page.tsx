import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import AutomaticForwardingRunner from "@/example-runners/ErrorHandlingExpress/AutomaticForwardingRunner";
import CentralizedErrorMiddlewareRunner from "@/example-runners/ErrorHandlingExpress/CentralizedErrorMiddlewareRunner";
import LegacyTryCatchRunner from "@/example-runners/ErrorHandlingExpress/LegacyTryCatchRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function FootgunDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-purple-500 mb-2.5">An async route handler throws, with no try/catch anywhere. What happens next depends entirely on the Express version:</div>
      <div className="pl-2 mb-1.5 text-red-500">Express 4 — the rejected promise is invisible to Express. Nobody calls next(err). Modern Node.js treats this as a fatal, unhandled rejection: the ENTIRE server process crashes.</div>
      <div className="pl-2 mb-1.5 text-green-500">Express 5 — Express itself notices the rejection and forwards it to error-handling middleware automatically, exactly as if next(err) had been called. The process stays alive.</div>
      <div className="mt-2 text-muted">
        Same bug, written the same way, two completely different outcomes — purely because of which major version is running.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Express 5 Forwards a Rejected Promise Automatically",
    paragraphs: [
      "An \"error-handling\" story starts with a simple fact: an async route handler that throws is really just a function returning a promise that rejects. The question every framework has to answer is what happens to that rejection if nobody explicitly catches it. Express 5's answer, new as of version 5, is: Express itself notices, and forwards the error to error-handling middleware automatically — no try/catch, no wrapper library, nothing extra required IN THE ROUTE ITSELF. That doesn't mean error middleware is optional, though — automatic forwarding means Express finds the error somewhere to go, not that you can skip building that somewhere. This example still ships a real error middleware, exactly like a real backend would.",
      "The demo below proves this with a route that throws, with no try/catch anywhere in the file, and shows it landing in a real error middleware — a clean JSON error response, not a hang. The server is still alive and serving other routes normally afterward too. (Without a custom error middleware, Express falls back to its own default handler, which dumps a raw HTML stack trace back to the client — verified directly while building this topic, and never something a real API should ship, so it's described only in a comment in server.js rather than shown as running code here.)",
    ],
    demo: <AutomaticForwardingRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/AutomaticForwarding/server.js",
      note: "A real, self-contained Express 5 app — a route that throws with no try/catch, a real error middleware it forwards into, and a healthy route to prove the process survived.",
    },
  },
  {
    heading: "A Real Error Middleware, Custom Error Classes, Real Status Codes",
    paragraphs: [
      "Express's default error page (HTML, a raw stack trace) is fine for development but wrong for a real API — a real backend needs ONE centralized place that turns any error, from anywhere in the app, into a proper JSON response with the right status code. That's what an error-handling middleware is: a function with exactly 4 arguments, (err, req, res, next). The 4-argument shape — not its name, not where it's defined — is what tells Express to treat it as an error handler instead of regular middleware. And, just like ordinary middleware, order still matters: it has to be registered AFTER the routes it's meant to protect.",
      "A custom error class (AppError below, extending the built-in Error with an extra statusCode field) lets a route say exactly which HTTP status a specific failure deserves — 404 for \"not found,\" 400 for \"bad input,\" whatever fits. An error thrown WITHOUT that custom class (an ordinary, unplanned bug) has no statusCode, so the centralized handler falls back to 500 — a real, useful default for \"something broke that we didn't specifically plan for.\"",
      "The demo below proves three different real outcomes from the exact same centralized error middleware: a known user returns normally (200), a missing user throws AppError(\"...\", 404) and gets back a real 404, and a totally unrelated, unplanned bug (a plain Error, no statusCode) falls through to a real 500 — all handled by the one error middleware at the bottom of the file.",
    ],
    demo: <CentralizedErrorMiddlewareRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/CentralizedErrorMiddleware/server.js",
      note: "A real, self-contained Express 5 app — an AppError class, two routes that fail in different ways, one centralized 4-argument error middleware.",
    },
  },
  {
    heading: "The Legacy Pattern: Manual try/catch (Pre-Express-5)",
    paragraphs: [
      "This section deliberately installs Express 4, not Express 5 like every other example in this project — the whole point is proving, for real, the actual old failure mode Express 5 fixed, not just asserting it from memory. The common description of this Express 4 footgun is \"the request hangs forever.\" That turned out to be outdated: verified directly against the current Node.js version, an unhandled promise rejection is treated as a FATAL error by modern Node (since Node 15) — so an Express 4 async handler that throws with no try/catch doesn't just hang that one request, it crashes the ENTIRE server process, taking every other in-flight request down with it.",
      "The fix, Express-4-style, is a manual try/catch around the handler's body that calls next(err) itself on failure — the pattern every pre-Express-5 codebase relies on for EVERY single async route handler. Miss it once, on one route, and that route carries the same crash risk as the one below.",
      "The demo below proves the correct Express-4-style pattern for real: /with-trycatch throws the same kind of error as the broken version, but the manual try/catch + next(err) gets a real, ordinary error response back from the centralized error middleware. The broken version — an identical throw with no try/catch — is deliberately not shipped as real running code here (a real backend dev should never write it, so this project doesn't execute it either); it's written out as a comment in server.js instead, along with the real, verified consequence described above: a real, separately spawned Express 4 process hitting a route built that way crashed outright (a real, observed exit code of 1).",
    ],
    extra: <FootgunDiagram />,
    demo: <LegacyTryCatchRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ErrorHandlingExpress/LegacyTryCatch/server.js",
      note: "A real, self-contained Express 4 app (its own package.json pins express@4, unlike every other example here) — the correct try/catch + next(err) pattern is the only code that actually runs; the crash-causing mistake is written out only as a comment.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Express 5's headline error-handling change is automatic forwarding of a rejected promise from an async route handler — no try/catch, no wrapper library required, and (contrary to the old \"it just hangs\" folklore about Express 4) the real stakes are higher than that: on modern Node.js, an uncaught rejection in Express 4 crashes the entire process, not just one request. A centralized error-handling middleware is recognized purely by its 4-argument shape, (err, req, res, next), must be registered after the routes it covers, and a custom error class carrying its own statusCode is what lets that one centralized place send back the RIGHT status code per failure instead of defaulting everything to 500.",
    ],
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
