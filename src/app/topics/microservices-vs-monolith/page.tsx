import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import TheMonolithRunner from "@/example-runners/MicroservicesVsMonolith/TheMonolithRunner";
import SplitIntoServicesRunner from "@/example-runners/MicroservicesVsMonolith/SplitIntoServicesRunner";
import IndependentFailureRunner from "@/example-runners/MicroservicesVsMonolith/IndependentFailureRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function MonolithDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real process, every real concern living inside it</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-cyan-500/40 bg-cyan-500/3 px-3 py-2">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-0.5">users and orders share the SAME real process</div>
          <div className="text-body text-xs leading-relaxed">&quot;Looking up a user&quot; from order-handling code is just a real, plain JS function call — no network, no serialization, no chance of a timeout.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">One real deployment</div>
          <div className="text-body text-xs leading-relaxed">One real <code>npm start</code>, one real process to monitor, one real place logs end up.</div>
        </div>
        <div className="rounded-card border border-yellow-500/40 bg-yellow-500/3 px-3 py-2">
          <div className="font-mono text-xs text-yellow-500 font-semibold mb-0.5">But also one real blast radius</div>
          <div className="text-body text-xs leading-relaxed">If this one real process crashes, EVERY concern inside it — users, orders, anything else — goes down together, at the same real moment.</div>
        </div>
      </div>
    </div>
  );
}

function SplitServicesDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real, separate processes — the ONLY connection between them is the network</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">users-service — its own real Express app, its own real port</div>
          <div className="text-body text-xs leading-relaxed">Has no idea &quot;orders&quot; even exist. Could be deployed, scaled, or rewritten entirely on its own.</div>
        </div>
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">orders-service — a real, separate Express app, calling users-service over real HTTP</div>
          <div className="text-body text-xs leading-relaxed">The exact same &quot;enrich this order with its user&quot; logic as the monolith — but now a real network round trip instead of a function call.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">This section&apos;s demo measures the real cost directly: ~26ms over the network vs ~0.01ms in-process — roughly 2000x, for the identical &quot;join.&quot;</span>
      </div>
    </div>
  );
}

function FaultIsolationDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A real crash in ONE service, and what actually happens to the other</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">users-service really crashes (SIGKILL — no graceful shutdown)</div>
          <div className="text-body text-xs leading-relaxed">Gone. Any real request that needs it will fail from now on.</div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">orders-service&apos;s OWN endpoints still answer</div>
          <div className="text-body text-xs leading-relaxed">GET /orders/:id/basic needs nothing from users-service — this section&apos;s demo proves it still returns a real 200, even after the crash.</div>
        </div>
        <div className="rounded-card border border-yellow-500/40 bg-yellow-500/3 px-3 py-2">
          <div className="font-mono text-xs text-yellow-500 font-semibold mb-0.5">Only the ONE dependent endpoint degrades — on purpose, not by accident</div>
          <div className="text-body text-xs leading-relaxed">A real try/catch around the cross-service call returns a real, deliberate 503 — never an uncaught exception that could take orders-service itself down too.</div>
        </div>
      </div>
    </div>
  );
}

function DistributedComplexityDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What microservices buy you also has to be paid for, somewhere</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Every in-process function call becomes a real network call</div>
          <div className="text-body text-xs leading-relaxed">Real latency, and a real NEW failure mode (the network itself) that a monolith&apos;s function calls never had to consider.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Data consistency across services gets genuinely harder</div>
          <div className="text-body text-xs leading-relaxed">A monolith can wrap a change in one real database transaction. Two separate services updating two separate databases can&apos;t — that&apos;s a real, harder problem (sagas, eventual consistency), not just more code.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Debugging one real request now spans multiple real processes</div>
          <div className="text-body text-xs leading-relaxed">A single slow response could be any one of several real services — real production systems need distributed tracing to even see where time went.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "The Monolith: One App, One Deployment",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Every Real App Starts Somewhere — Usually Here",
              description: "One real Express app, one real process, handling every concern the product needs. Not a mistake or a shortcut — it's the right default for most real projects, especially early ones.",
            },
            {
              label: "\"Joining\" Data Across Concerns Is Just a Function Call",
              description: "This section's app has users AND orders in the same process. Enriching an order with its real user's data is two in-memory lookups — nothing crosses a network at all.",
              example: "This section's demo measures the real time for that in-process lookup directly: a fraction of a millisecond.",
            },
            {
              label: "The Real Tradeoff: Simplicity Now, One Shared Blast Radius Later",
              description: "Easy to build, test, and deploy — genuinely the right call for a small team or an early-stage product. But every concern inside it lives and dies together, as one real process.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          A monolith isn&apos;t a lesser architecture — it&apos;s the real, correct starting point for most projects. The
          question is what happens once one concern needs to scale, deploy, or fail independently of the others.
        </Callout>
        <p>
          The demo below hits a real endpoint that enriches an order with its user&apos;s data, entirely in-process, and
          measures the real time that &quot;join&quot; actually takes.
        </p>
      </>
    ),
    extra: <MonolithDiagram />,
    demo: <TheMonolithRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MicroservicesVsMonolith/TheMonolith/controllers/data.js", note: "Users AND orders share the exact same in-memory store, inside the same real process." },
      { path: "examples/MicroservicesVsMonolith/TheMonolith/controllers/order.controller.js", note: "The real \"join\": a plain, in-process function call to look up the user — no network involved." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/MicroservicesVsMonolith/TheMonolith"
        runCommand="node server.js"
        runPort={4110}
        steps={[
          {
            method: "GET",
            path: "/orders/1",
            expectStatus: 200,
            expectBody: 'A real JSON object: {"id":"1","userId":"1","item":"Mechanical Keyboard","user":{"id":"1","name":"Lawrence"},"tookMs":<a real number, well under 1>}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Splitting Into Microservices: Real Services, Real Network Calls",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "Same Real Behavior, Genuinely Different Real Architecture",
              description: "This section's demo answers the exact same question as the last one — \"give me this order, with its user\" — but users and orders are now two completely separate real Express apps, on two real ports.",
            },
            {
              label: "The Only Connection Between Them Is the Network",
              description: "orders-service has zero direct access to users-service's data — the ONLY way to get it is a real HTTP request, exactly like a client calling your API.",
            },
            {
              label: "This Is What \"a Service\" Actually Means",
              description: "Independently deployable, independently scalable, independently owned by a different real team if needed — real properties a monolith's internal modules never had, no matter how cleanly organized.",
              example: "This section's demo spawns both as genuinely separate real OS processes and measures the real network round trip between them.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          Splitting into services doesn&apos;t change WHAT the app does — it changes HOW its parts talk to each other,
          from a free in-process function call to a real network request with real cost and real new failure modes.
        </Callout>
        <p>
          The demo below starts both real services as separate processes, then hits the real enriched-order endpoint
          and measures the real network-call time — compare it directly to the monolith section&apos;s in-process number.
        </p>
      </>
    ),
    extra: <SplitServicesDiagram />,
    demo: <SplitIntoServicesRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MicroservicesVsMonolith/SplitIntoServices/users-service/server.js", note: "A real, complete, standalone Express app — genuinely knows nothing about orders." },
      { path: "examples/MicroservicesVsMonolith/SplitIntoServices/orders-service/controllers/order.controller.js", note: "The real \"join\" is now a real fetch() call to a different real service, on a real network." },
    ],
    postmanCheck: (
      <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
          <span className="text-title text-sm font-semibold">Try It Yourself in Postman — Needs TWO Real Terminals</span>
        </div>
        <div className="text-body text-xs leading-relaxed mb-3">
          Two genuinely separate real services means two real processes to start — one <code>runCommand</code> isn&apos;t
          enough here.
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal A — users-service</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/MicroservicesVsMonolith/SplitIntoServices/users-service&quot; &amp;&amp; node server.js
            </code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Listens on a real, fixed port: 4111.</div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Terminal B — orders-service</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/MicroservicesVsMonolith/SplitIntoServices/orders-service&quot; &amp;&amp; node server.js
            </code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Listens on a real, fixed port: 4112. Leave both terminals running.</div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. In Postman: GET http://localhost:4112/orders/1</div>
            <div className="text-xs text-body leading-relaxed">
              Sent to orders-service — it makes a real internal call to users-service (port 4111) before responding.
              Expect: <span className="text-green-500 font-mono">200</span>{" "}
              <span className="font-mono">{'{"id":"1","userId":"1","item":"Mechanical Keyboard","user":{"id":"1","name":"Lawrence"},"tookMs":<a real number, several milliseconds — genuinely slower than the monolith\'s>}'}</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    heading: "The Real Payoff: Independent Failure",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "This Is the Real Reason Teams Reach for Microservices",
              description: "Not \"it's more modern\" — it's that one service crashing doesn't have to take every OTHER service down with it, the way it would inside a monolith's single shared process.",
            },
            {
              label: "But Only If YOUR Code Handles the Failure on Purpose",
              description: "A real network call CAN fail — the other service might be down, slow, or unreachable. Wrapping it in a real try/catch and returning a deliberate error is what turns \"one service is down\" into \"one FEATURE is degraded,\" not \"everything is down.\"",
              example: "This section's demo really kills the users-service process (SIGKILL, no graceful shutdown) and proves orders-service survives it.",
            },
            {
              label: "Partial Degradation Beats Total Outage",
              description: "A real user who can still see their order (just without the enriched name) had a much better real experience than a user staring at a blank error page.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          Fault isolation isn&apos;t automatic just because you split into services — it&apos;s earned by catching the real
          failure at the boundary. Skip the try/catch, and a network error can crash a service just as hard as a bug.
        </Callout>
        <p>
          The demo below starts both services, confirms they work, really kills users-service, then proves orders-service&apos;s
          own endpoint keeps working while only the ONE genuinely dependent endpoint degrades — and orders-service itself
          never goes down.
        </p>
      </>
    ),
    extra: <FaultIsolationDiagram />,
    demo: <IndependentFailureRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/MicroservicesVsMonolith/IndependentFailure/orders-service/controllers/order.controller.js", note: "getOrderBasic needs nothing from users-service; getOrderEnriched wraps the real cross-service call in try/catch, returning a real 503 instead of crashing." },
    ],
    postmanCheck: (
      <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
          <span className="text-title text-sm font-semibold">Try It Yourself — Needs TWO Real Terminals (and a real crash)</span>
        </div>
        <div className="text-body text-xs leading-relaxed mb-3">
          This section can&apos;t be a normal PostmanCheck — the whole point is watching what happens when you kill a real
          process mid-flight.
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal A — users-service</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/MicroservicesVsMonolith/IndependentFailure/users-service&quot; &amp;&amp; node server.js
            </code>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Terminal B — orders-service</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/MicroservicesVsMonolith/IndependentFailure/orders-service&quot; &amp;&amp; node server.js
            </code>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. In Postman: GET http://localhost:4114/orders/1</div>
            <div className="text-xs text-body leading-relaxed">
              Expect: <span className="text-green-500 font-mono">200</span>{" "}
              <span className="font-mono">{'{"id":"1","userId":"1","item":"Mechanical Keyboard","user":{"id":"1","name":"Lawrence"}}'}</span>
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">4. Kill Terminal A (Ctrl+C, or close it) — users-service is now really gone</div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">5. GET http://localhost:4114/orders/1/basic</div>
            <div className="text-xs text-body leading-relaxed">
              Expect: <span className="text-green-500 font-mono">200</span>{" "}
              <span className="font-mono">{'{"id":"1","userId":"1","item":"Mechanical Keyboard"}'}</span> — still works, needs nothing from users-service.
            </div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">6. GET http://localhost:4114/orders/1 again</div>
            <div className="text-xs text-body leading-relaxed">
              Expect: <span className="text-yellow-500 font-mono">503</span>{" "}
              <span className="font-mono">{'{"error":"users-service is unreachable — try again later","orderId":"1"}'}</span> — a
              real, deliberate failure. Terminal B is still running the whole time.
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    heading: "The Real Cost: Distributed Complexity",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "This Section Stays Conceptual — Deliberately",
              description: "Real distributed tracing (Jaeger, OpenTelemetry collectors) and real multi-service transaction patterns (sagas) are genuine infra-team territory — bigger than this project's own scope to install for a comparison.",
            },
            {
              label: "Network Calls Can Fail in Ways Function Calls Never Do",
              description: "Timeouts, partial failures, a service that's up but slow — the previous section's try/catch handled ONE call. A real app with a dozen services has to handle this everywhere, consistently.",
            },
            {
              label: "Data Consistency Gets Genuinely Harder, Not Just More Verbose",
              description: "One real database transaction can't span two separate services' two separate databases. Real systems reach for sagas or eventual consistency — a real, different KIND of problem, not extra code around the same one.",
            },
            {
              label: "Someone Has to Be Able to See Across All of It",
              description: "One slow user-facing request might touch 4 real services. Real production systems need distributed tracing just to answer \"which one was actually slow?\" — a monolith never needed this at all.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Every real benefit measured on this page — independent deploys, independent failure — has a real cost
          attached. Microservices aren&apos;t free complexity reduction; they trade one set of problems for another.
        </Callout>
      </>
    ),
    extra: <DistributedComplexityDiagram />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. A monolith keeps every concern in one real process — &quot;joining&quot; data across concerns is just a
        plain function call, measured here at a fraction of a millisecond, and the whole app deploys as one real unit.
        Splitting into microservices replaces those function calls with real network requests — measured here at
        roughly 2000x slower for the identical operation — in exchange for real independent deployability and real
        fault isolation, PROVEN here by actually killing a real service process and watching the other one keep
        answering its own requests. That isolation isn&apos;t automatic, though — it only holds if every cross-service
        call is wrapped in real error handling that fails deliberately (a 503) instead of crashing. And the real bill
        for all of this: network failures as a new normal failure mode, data consistency across separate databases
        becoming a genuinely harder problem, and needing distributed tracing just to debug one slow request. The real
        interview-ready framing: start with a monolith, split out a service only when a REAL, specific pressure
        demands it (independent scaling, independent deploys, a different team owning it) — not by default.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["one process, one deploy (monolith)", "split by real, specific need", "function call → real network call", "independent failure, if you catch it", "real cost: network, consistency, tracing"]} />
        <ComparisonCard
          tone="good"
          title="Which one, when — the real decision"
          points={[
            "Small team, early product, unclear boundaries yet? Monolith — it's genuinely the right default, not a placeholder.",
            "One part of the system needs to scale or deploy independently of the rest, with real evidence, not a guess? That's a real signal to split it out.",
            "A different real team needs to own and ship a part of the system on its own schedule? Also a real signal.",
            "Splitting \"because microservices are more modern\" with no specific pressure driving it is how teams end up with all of microservices' real cost and none of the real payoff.",
          ]}
        />
      </>
    ),
  },
];

export default function MicroservicesVsMonolithPage() {
  return (
    <StudyPage
      title="Microservices vs Monolith"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="The real tradeoff, measured directly: the same 'give me this order, with its user' operation as an in-process function call vs a real network request across two separate services — plus what real fault isolation actually costs to earn."
      sections={sections}
    />
  );
}
