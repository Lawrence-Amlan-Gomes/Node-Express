import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import OrderTestDemoRunner from "@/example-runners/MiddlewarePipeline/OrderTestDemoRunner";
import AuthOrderDemoRunner from "@/example-runners/MiddlewarePipeline/AuthOrderDemoRunner";
import NextCalledDemoRunner from "@/example-runners/MiddlewarePipeline/NextCalledDemoRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (every section needs its
// OWN diagram; a live demo doesn't substitute for one). Rewritten 2026-07-17.

function RegistrationOrderDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "request comes in", caption: "A real request hits the server — nothing has run yet." },
    { label: "middleware-1 (registered 1st)", caption: "Runs FIRST, purely because it was app.use()'d first in server.js." },
    { label: "middleware-2 (registered 2nd)", caption: "Runs SECOND — not because of what it does, only because of where it sits in the file." },
    { label: "route handler (registered last)", caption: "Runs LAST — this is the only thing that actually sends the response." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Registration order IS execution order — nothing else decides it</div>
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
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Not alphabetical, not by path specificity — just the literal top-to-bottom order these lines appear in server.js.</span>
      </div>
    </div>
  );
}

function AuthPositionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The SAME requireAuth function, in two different positions</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">app.get(&quot;/x&quot;, requireAuth, handler)</div>
          <div className="text-body text-xs leading-relaxed">requireAuth runs BEFORE the route. No valid header → 401, handler never runs. This is the only pattern this project actually ships as real code.</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">app.get(&quot;/x&quot;, handler); app.use(&quot;/x&quot;, requireAuth)</div>
          <div className="text-body text-xs leading-relaxed">requireAuth registered AFTER the route. Express already matched and answered with the route above — requireAuth never gets a turn. Shown only as a comment in server.js, never run for real here.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Same function, same route path — completely different real behavior, purely from registration position.</span>
      </div>
    </div>
  );
}

function NextContractDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A middleware&apos;s whole contract: call next(), or send a response — always do ONE of the two</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">next() gets called</div>
          <div className="text-body text-xs leading-relaxed">The request continues on to whatever&apos;s registered next. The route handler below runs, and a real response goes out. This is the only version shipped as real code here — the /works route.</div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">next() never gets called</div>
          <div className="text-body text-xs leading-relaxed">Nothing after it ever runs. No error, no crash, no timeout on its own — the request just sits open forever. Shown only as a comment in server.js, never run for real here.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Verified directly while building this topic: a real timeout race (AbortController) against a forgotten-next() route never completed, even after an 800ms wait.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Middleware Runs in the Exact Order You Register It",
    body: (
      <>
        <ConceptBreakdown
          items={[
            {
              label: "A Middleware Is Just a Function That Runs First",
              description: "Every middleware gets three arguments: (req, res, next). It runs BEFORE your route handler — think of it as a checkpoint on the way to the destination.",
              example: "app.use((req, res, next) => { /* do something */ next(); });",
            },
            {
              label: "next() Hands the Request On",
              description: "Calling next() is how a middleware says \"I'm done here, let whatever comes after me in the file run now.\"",
            },
            {
              label: "Express Runs Them in Registration Order — Nothing Else",
              description: "Top to bottom, in the exact order app.use()/app.get() was called in server.js. Not alphabetically, not by how specific the path is.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          There&apos;s no reordering, no priority system, no smart scheduling — Express just runs your app.use()/app.get()
          calls top to bottom, in the exact order they appear in the file. That simple fact is the whole mechanism the
          rest of this topic builds on.
        </Callout>
        <p>
          The demo below proves this directly, not just describes it: two separate middlewares each stamp their own name
          onto req.orderLog before calling next(), and the real route handler adds its own name last. The response shows
          the exact real order they ran in.
        </p>
      </>
    ),
    extra: <RegistrationOrderDiagram />,
    demo: <OrderTestDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/OrderOfExecution/server.js",
      note: "A real, self-contained Express app just for this — two middlewares and one route, nothing else.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MiddlewarePipeline/OrderOfExecution"
        runCommand="node server.js"
        runPort={4003}
        steps={[
          {
            method: "GET",
            path: "/order-test",
            expectStatus: 200,
            expectBody: '{"order":["middleware-1","middleware-2","route-handler"]}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Order Changes Real Behavior, Not Just Sequence",
    body: (
      <>
        <p>
          This is the actual interview-relevant point, not just &quot;middleware runs in order&quot; trivia: WHERE you
          register a middleware decides whether it does anything at all.
        </p>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "Registered Before the Route: It Genuinely Protects It",
              description: "A fake auth check (requireAuth) registered BEFORE a route can actually block a request — no valid header, no access.",
            },
            {
              label: "Registered After the Route: It Does Nothing",
              description: "The exact SAME requireAuth function, registered AFTER an identical route, does nothing whatsoever for that route — Express already matched, ran the earlier route, and sent its response. The \"guard\" never gets a turn.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          A middleware only protects the routes registered AFTER it — registering the exact same guard too late
          doesn&apos;t error, doesn&apos;t warn, it just silently does nothing. This is a real, common source of
          security bugs, not just an ordering quirk.
        </Callout>
        <p>
          The demo below proves the correct pattern for real: /protected-correct actually blocks an unauthenticated
          request (401) and actually allows an authenticated one through (200). The broken version isn&apos;t shipped as
          real code — a real backend dev should never write it, so this project doesn&apos;t execute it either. It&apos;s
          written out as a comment in server.js instead, along with the real, verified consequence: hitting a route built
          that way returns 200 even with no auth header at all.
        </p>
      </>
    ),
    extra: <AuthPositionDiagram />,
    demo: <AuthOrderDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/AuthOrderMatters/server.js",
      note: "A real, self-contained Express app just for this — the correct requireAuth-before-route pattern is the only code that actually runs; the broken order is written out only as a comment.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MiddlewarePipeline/AuthOrderMatters"
        runCommand="node server.js"
        runPort={4004}
        steps={[
          {
            method: "GET",
            path: "/protected-correct",
            expectStatus: 401,
            expectBody: '{"error":"unauthorized"} — sent with NO x-auth-token header',
          },
          {
            method: "GET",
            path: "/protected-correct",
            expectStatus: 200,
            expectBody: '{"message":"you got in — correct order, real auth check ran first"} — sent WITH header x-auth-token: secret',
          },
        ]}
      />
    ),
  },
  {
    heading: "Calling next() Is What Lets a Request Continue",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "A Middleware's Whole Contract: next() or a Response",
              description: "Do your work, then call next() to hand the request on — or send a response yourself. There's no third option.",
            },
            {
              label: "Forgetting Both Isn't a Crash — It's Silence",
              description: "The request just sits there, open, forever, waiting for a response that's never coming. This is a real, common backend bug, usually an accidentally-forgotten next() inside an if-branch.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          Calling next() isn&apos;t a formality — it&apos;s the one thing that hands a request off to whatever comes
          next. Skip it (and send no response either) and nothing errors or times out on its own — the request just
          sits there, open, forever.
        </Callout>
        <p>
          The demo below proves the correct half of the contract for real: a middleware that calls next() genuinely lets
          the route handler after it run. The broken version — a middleware that does neither next() nor a response — is
          deliberately not shipped as real running code here; it&apos;s written out as a comment in server.js instead,
          along with the real, verified consequence: a real timeout race (AbortController) against a route built that way
          found it never responded, even after an 800ms wait.
        </p>
      </>
    ),
    extra: <NextContractDiagram />,
    demo: <NextCalledDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/MiddlewarePipeline/ForgottenNext/server.js",
      note: "A real, self-contained Express app just for this — the correct next()-calling middleware is the only code that actually runs; the forgotten-next() mistake is written out only as a comment.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MiddlewarePipeline/ForgottenNext"
        runCommand="node server.js"
        runPort={4005}
        steps={[
          {
            method: "GET",
            path: "/works",
            expectStatus: 200,
            expectBody: '{"message":"the middleware above called next(), so this route actually ran","checkedAt":<a real millisecond timestamp>}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Middleware runs in registration order, always — that&apos;s not a detail, it&apos;s the mechanism the
        whole pipeline is built on. The same middleware can genuinely protect a route or do nothing at all, purely
        depending on whether it&apos;s registered before or after that route — a real, common source of security bugs,
        not just an ordering quirk. And forgetting next() (with no response sent) doesn&apos;t crash anything — it
        silently hangs that one request forever, which is exactly the kind of bug that&apos;s hard to spot in code review
        but obvious once you know to look for a missing next().
      </p>
    ),
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
