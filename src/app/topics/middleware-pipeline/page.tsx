import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import OrderTestDemoRunner from "@/example-runners/MiddlewarePipeline/OrderTestDemoRunner";
import AuthOrderDemoRunner from "@/example-runners/MiddlewarePipeline/AuthOrderDemoRunner";
import HangsDemoRunner from "@/example-runners/MiddlewarePipeline/HangsDemoRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function PipelineDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-purple-500 mb-2.5">A request travels through middleware top-to-bottom, in registration order:</div>
      <div className="pl-2 mb-1.5 text-body">request comes in</div>
      <div className="pl-2 mb-1.5 text-cyan-500">→ middleware 1 — does its thing, calls next()</div>
      <div className="pl-2 mb-1.5 text-cyan-500">→ middleware 2 — does its thing, calls next()</div>
      <div className="pl-2 mb-1.5 text-green-500">→ route handler — sends the actual response</div>
      <div className="mt-2 text-muted">
        If ANY middleware never calls next() (and never sends a response itself), the chain just stops there — nothing below it ever runs, and the request hangs.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Middleware Runs in the Exact Order You Register It",
    paragraphs: [
      "A \"middleware\" is a function that runs on a request BEFORE your route handler does — every one gets (req, res, next). Calling next() is how a middleware says \"I'm done, let whatever comes next in this file run.\" Express runs them in the literal order app.use()/app.get() was called in server.js, top to bottom — not alphabetically, not by specificity, just registration order.",
      "The demo below proves this directly: two separate middlewares each stamp their own name onto req.orderLog before calling next(), and the real route handler adds its own name last. The response shows the exact real order they ran in — not a description of the rule, the rule actually happening.",
    ],
    extra: <PipelineDiagram />,
    demo: <OrderTestDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/OrderOfExecution/server.js",
      note: "A real, self-contained Express app just for this — two middlewares and one route, nothing else.",
    },
  },
  {
    heading: "Order Changes Real Behavior, Not Just Sequence",
    paragraphs: [
      "This is the actual interview-relevant point, not just \"middleware runs in order\" as trivia: WHERE you register a middleware determines whether it does anything at all. A fake auth check (requireAuth) registered BEFORE a route genuinely protects it — no valid header, no access. The exact same requireAuth function registered AFTER an identical route does nothing whatsoever for that route, because Express already matched and ran the earlier-registered route handler, sent its response, and moved on. The \"guard\" never gets a turn.",
      "The demo below proves both real outcomes side by side: /protected-correct actually blocks an unauthenticated request (401) and actually allows an authenticated one (200); /protected-wrong lets an unauthenticated request straight through (200) — same requireAuth function, same header check, only the registration order differs.",
    ],
    demo: <AuthOrderDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/AuthOrderMatters/server.js",
      note: "A real, self-contained Express app just for this — requireAuth and the two /protected-* routes, nothing else.",
    },
  },
  {
    heading: "Forgetting next() Really Does Hang a Request Forever",
    paragraphs: [
      "If a middleware doesn't call next() and doesn't send a response either, the request doesn't error out — it just sits there, open, forever, waiting for a response that's never coming. This is a real, common backend bug (usually an accidentally-forgotten next() inside an if-branch, not written on purpose like it is here).",
      "Proving \"forever\" for real without actually waiting forever: the demo below fires a real request at /hangs (whose middleware deliberately never calls next()) and races it against a real timeout using AbortController. It measures how long the request actually stayed open before being cancelled — proof the server genuinely never responded, not just a slow response.",
    ],
    demo: <HangsDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/ForgottenNext/server.js",
      note: "A real, self-contained Express app just for this — one deliberately-empty middleware, nothing else.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Middleware runs in registration order, always — that's not a detail, it's the mechanism the whole pipeline is built on. The same middleware can genuinely protect a route or do nothing at all, purely depending on whether it's registered before or after that route — a real, common source of security bugs, not just an ordering quirk. And forgetting next() (with no response sent) doesn't crash anything — it silently hangs that one request forever, which is exactly the kind of bug that's hard to spot in code review but obvious once you know to look for a missing next().",
    ],
    extra: (
      <>
        <FlowChain steps={["request in", "middleware 1", "middleware 2", "route handler", "response out"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Middleware order is registration order, full stop — Express doesn't reorder or prioritize by path specificity.",
            "An auth/validation middleware only protects routes registered AFTER it — the same middleware registered later does nothing for routes that already matched and responded.",
            "A middleware that never calls next() (and never sends a response) silently hangs that request forever — it doesn't throw or time out on its own.",
            "app.use() without a path runs on every request; app.use(path, ...) or a route-specific middleware argument scopes it to just that path.",
          ]}
        />
      </>
    ),
  },
];

export default function MiddlewarePipelinePage() {
  return (
    <StudyPage
      title="The Middleware Pipeline"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="Middleware order isn't a style preference — it's the literal mechanism that determines what actually runs, in what sequence, and whether a route is protected at all. This topic proves all three with real, measured behavior: registration order, a real auth check that only works in the right position, and a real request that hangs forever when next() is forgotten."
      sections={sections}
    />
  );
}
