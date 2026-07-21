import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import RestOverUnderFetchingRunner from "@/example-runners/BeyondRestGraphqlTrpc/RestOverUnderFetchingRunner";
import GraphQlYogaBasicsRunner from "@/example-runners/BeyondRestGraphqlTrpc/GraphQlYogaBasicsRunner";
import TrpcEndToEndTypesRunner from "@/example-runners/BeyondRestGraphqlTrpc/TrpcEndToEndTypesRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function OverUnderFetchingDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">One real goal — &quot;order item + buyer name&quot; — two real REST costs</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Under-fetching: one endpoint was never enough</div>
          <div className="text-body text-xs leading-relaxed">/orders/:id has no user name on it — a real SECOND request to /users/:id is the only way to get it.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">Over-fetching: that second request brings back more than needed</div>
          <div className="text-body text-xs leading-relaxed">/users/:id always returns the WHOLE user — id, email, bio — even though only the name was ever wanted.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Neither is a bug — it&apos;s just what a fixed-shape REST endpoint always does. This is the real gap GraphQL exists to close.</span>
      </div>
    </div>
  );
}

function GraphQlDiagram() {
  return (
    <div className="rounded-card border border-dashed border-pink-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The SAME real goal, ONE real request, the client names exactly what it wants</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">The schema still HAS every field</div>
          <div className="text-body text-xs leading-relaxed">User still has email and bio on the real schema — GraphQL doesn&apos;t remove data, it lets the caller choose.</div>
        </div>
        <div className="rounded-card border border-pink-500/40 bg-pink-500/3 px-3 py-2">
          <div className="font-mono text-xs text-pink-500 font-semibold mb-0.5">A resolver only runs if the query actually asks for it</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s Order.user resolver only fires because the real query asked for the user&apos;s name — leave that part out, and it never runs at all.</div>
        </div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-green-500 text-xs">Real measured result: 1 request instead of 2, and zero unused fields sent — both real REST costs solved by the same real query.</span>
      </div>
    </div>
  );
}

function TrpcDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The client imports a real TYPE from the server — zero real runtime code</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">import type {'{ AppRouter }'} from &quot;./server.ts&quot;</div>
          <div className="text-body text-xs leading-relaxed">The `type` keyword is real, load-bearing syntax — it tells TypeScript (and Node&apos;s own type-stripper) this import only ever exists at compile time.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Every field and argument is real, inferred, compiler-checked TypeScript</div>
          <div className="text-body text-xs leading-relaxed">No hand-written client types to keep in sync by hand — if the real server changes, the client&apos;s own types change with it automatically.</div>
        </div>
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">A wrong call never even runs</div>
          <div className="text-body text-xs leading-relaxed">This section&apos;s demo really passes the wrong type on purpose — tsc rejects it before any request goes out, a real error a REST client&apos;s plain fetch() call could never catch this early.</div>
        </div>
      </div>
    </div>
  );
}

function DecisionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Three real tools, three genuinely different jobs</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">REST: the real default</div>
          <div className="text-body text-xs leading-relaxed">Simple, cacheable by URL, universally understood — still what roughly 9 in 10 real teams ship, per current industry research.</div>
        </div>
        <div className="rounded-card border border-pink-500/40 bg-pink-500/3 px-3 py-2">
          <div className="font-mono text-xs text-pink-500 font-semibold mb-0.5">GraphQL: many DIFFERENT real clients, one real API</div>
          <div className="text-body text-xs leading-relaxed">A mobile app and a web dashboard can each ask for exactly what THEY need from the same real schema — genuinely valuable once client needs diverge.</div>
        </div>
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">tRPC: ONE real team owns both ends, in TypeScript</div>
          <div className="text-body text-xs leading-relaxed">No public API contract to publish — the real payoff is speed and safety when the same team ships the frontend AND the backend.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "The REST Problem: Over-fetching & Under-fetching",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "A Fixed-Shape Endpoint Always Returns the Same Fields",
              description: "GET /users/:id always sends back the whole user — however many fields it has, whether the caller wanted all of them or not.",
            },
            {
              label: "Under-fetching: One Endpoint Wasn't Enough",
              description: "Showing an order with its buyer's name needs data from TWO different real resources — that's two real round trips, no way around it with plain REST.",
            },
            {
              label: "Over-fetching: The Second Request Brings Back Too Much",
              description: "Wanting just the buyer's name still means downloading their email and bio too, because the endpoint has no way to know what THIS particular caller actually needed.",
              example: "This section's demo counts both costs directly: 2 real requests, and real unused fields shipped over the wire.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          This isn&apos;t REST being badly built — it&apos;s the real, structural limit of a fixed-shape endpoint. Every
          caller gets the same response, whether they need all of it or not.
        </Callout>
        <p>
          The demo below fetches an order, then has to make a second real request just to get the buyer&apos;s name —
          and counts exactly how many extra, unused fields come back anyway.
        </p>
      </>
    ),
    extra: <OverUnderFetchingDiagram />,
    demo: <RestOverUnderFetchingRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BeyondRestGraphqlTrpc/RestOverUnderFetching/controllers/data.js", note: "The real user record includes email and bio — fields this section's real goal never needs." },
      { path: "examples/BeyondRestGraphqlTrpc/RestOverUnderFetching/demo.js", note: "Makes the real 2 requests and counts the real unused fields returned." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/BeyondRestGraphqlTrpc/RestOverUnderFetching"
        runCommand="node server.js"
        runPort={4115}
        steps={[
          {
            method: "GET",
            path: "/orders/1",
            expectStatus: 200,
            expectBody: '{"id":"1","userId":"1","item":"Mechanical Keyboard"}',
          },
          {
            method: "GET",
            path: "/users/1",
            note: "A real second request, just to get the buyer's name.",
            expectStatus: 200,
            expectBody: '{"id":"1","name":"Lawrence","email":"lawrence@example.com","bio":"A long real bio nobody asked for in this screen."}',
          },
        ]}
      />
    ),
  },
  {
    heading: "GraphQL: One Real Request, Exactly the Fields You Ask For",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "The Client Writes the Shape of the Response, Not the Server",
              description: "A GraphQL query names exactly which fields it wants, even across what used to be two separate REST resources — the server just fills in whatever was actually asked for.",
            },
            {
              label: "A Schema Is a Real, Published Contract",
              description: "type User { id, name, email, bio } and type Order { id, item, user } — real, typed definitions of everything a client is ALLOWED to ask for, checked before any query even runs.",
            },
            {
              label: "Resolvers Only Run for Fields the Query Actually Requested",
              description: "The real Order.user resolver in this section only fires because the query included \"user { name }\" — leave it out, and that lookup never happens at all.",
              example: "This section's demo sends ONE real query asking for order.item and order.user.name — and gets back exactly those two fields, nothing else.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          GraphQL doesn&apos;t remove data from the schema — it moves the decision of WHAT comes back from the server
          (fixed per endpoint) to the client (different, every query).
        </Callout>
        <p>
          The demo below sends one real GraphQL query for the same &quot;item + buyer name&quot; goal as the REST section,
          and shows the real response contains only what was actually asked for.
        </p>
      </>
    ),
    extra: <GraphQlDiagram />,
    demo: <GraphQlYogaBasicsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BeyondRestGraphqlTrpc/GraphQlYogaBasics/schema/typeDefs.js", note: "The real, published schema — User still has every field, including ones this section's query never asks for." },
      { path: "examples/BeyondRestGraphqlTrpc/GraphQlYogaBasics/schema/resolvers.js", note: "Order.user only runs when a real query actually requests the user field." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/BeyondRestGraphqlTrpc/GraphQlYogaBasics"
        runCommand="node server.js"
        runPort={4116}
        steps={[
          {
            method: "POST",
            path: "/graphql",
            body: '{"query":"{ order(id: \\"1\\") { item user { name } } }"}',
            expectStatus: 200,
            expectBody: '{"data":{"order":{"item":"Mechanical Keyboard","user":{"name":"Lawrence"}}}}',
          },
        ]}
      />
    ),
  },
  {
    heading: "tRPC: End-to-End Type Safety With a TypeScript Frontend",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Directly Relevant Given the Existing Next.js Background",
              description: "tRPC only makes sense when the SAME team, in TypeScript, owns both the client and the server — exactly the position a Next.js frontend developer moving into full-stack work is in.",
            },
            {
              label: "The Server Exports a TYPE, Never Runtime Code",
              description: "export type AppRouter = typeof appRouter — a real TypeScript type, erased completely before the code ever runs. The client's import of it costs nothing at runtime.",
            },
            {
              label: "Every Call Is Real, Inferred, Compiler-Checked TypeScript",
              description: "client.getUser.query({ id: \"1\" }) — genuinely autocompleted, because TypeScript already knows the real shape of every procedure, straight from the server's own code.",
              example: "This section's demo proves it two ways: a real, correct call that actually runs, and a deliberately wrong one that tsc rejects before any request is ever sent.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          tRPC trades REST/GraphQL&apos;s language-agnostic flexibility for something REST and GraphQL can&apos;t offer at
          all: a WRONG call that never compiles, instead of one that fails at runtime — or worse, silently succeeds
          with the wrong shape.
        </Callout>
        <p>
          The demo below runs a real, correctly-typed client call against a real tRPC server, then shows the real
          compiler error a deliberately wrong call produces — caught before any code runs, not after.
        </p>
      </>
    ),
    extra: <TrpcDiagram />,
    demo: <TrpcEndToEndTypesRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/BeyondRestGraphqlTrpc/TrpcEndToEndTypes/server.ts", note: "export type AppRouter — the one real thing a client is ever allowed to import from here." },
      { path: "examples/BeyondRestGraphqlTrpc/TrpcEndToEndTypes/client.ts", note: "import type { AppRouter } — a real, compile-time-only import; every call below is fully typed from it." },
      { path: "examples/BeyondRestGraphqlTrpc/TrpcEndToEndTypes/broken-usage.ts", note: "The deliberately wrong call, isolated so tsc can really check it without affecting the real build — see tsconfig.errordemo.json." },
    ],
    postmanCheck: (
      <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
          <span className="text-title text-sm font-semibold">Try It Yourself — a Real TypeScript Client, Not Postman</span>
        </div>
        <div className="text-body text-xs leading-relaxed mb-3">
          tRPC batches real requests into a specific JSON shape meant to be produced by its own client library, not
          typed by hand — the honest way to try this yourself is the same real client this section&apos;s demo already
          uses, not a hand-built Postman request (same judgment call this project already made for CORS, which is
          also better explored through its own real tool than forced into Postman&apos;s shape).
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal A — the real server</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">
              cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/BeyondRestGraphqlTrpc/TrpcEndToEndTypes&quot; &amp;&amp; node server.ts
            </code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Real TypeScript, run directly — Node&apos;s own native type-stripping handles it. Listens on a real, fixed port: 4117.</div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Terminal B — the real, correct client</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">node client.ts 4117</code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Prints the real, fully-typed result: <code className="text-cyan-500">{'{"id":"1","name":"Lawrence"}'}</code></div>
          </div>
          <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
            <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. See the real compile-time rejection yourself</div>
            <code className="text-cyan-500 font-mono text-xs break-all block">./node_modules/.bin/tsc -p tsconfig.errordemo.json</code>
            <div className="mt-1.5 text-xs text-body leading-relaxed">Prints the real error: <code className="text-cyan-500">broken-usage.ts(16,43): error TS2322: Type &apos;number&apos; is not assignable to type &apos;string&apos;.</code></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    heading: "REST vs GraphQL vs tRPC — When to Reach for Each",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "This Section Stays Conceptual — Deliberately",
              description: "The previous three sections already proved each tool's real, distinctive behavior — this one is about judgment, not another mini-project.",
            },
            {
              label: "REST Remains the Real Default",
              description: "Simple, cacheable by URL, understood by every real client and tool — still what the large majority of real production APIs ship as, per current industry surveys.",
            },
            {
              label: "GraphQL Earns Its Real Complexity When Clients Genuinely Diverge",
              description: "A mobile app, a web dashboard, and a partner integration each wanting different slices of the same real data is the actual scenario GraphQL was built for.",
            },
            {
              label: "tRPC Earns Its Real Value Inside One Team's Own TypeScript Stack",
              description: "No public contract to publish, no separate client SDK to maintain — genuinely the fastest, safest option when the same team owns both ends, in TypeScript, end to end.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          None of these three replaces the others — they solve genuinely different real problems. Picking the wrong
          one for the situation (GraphQL for a single internal TS app, tRPC for a public API) adds real cost with no
          real payoff.
        </Callout>
      </>
    ),
    extra: <DecisionDiagram />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. REST&apos;s real limit is a fixed response shape — this page measured it directly as 2 real
        requests plus real unused fields, just to show an order with its buyer&apos;s name. GraphQL fixes both at once
        by letting the CLIENT name exactly which fields it wants in ONE real request, while the schema still declares
        every field that exists — resolvers only run for fields a query actually asked for, proven here by a real
        query returning exactly 2 fields out of a schema with 6. tRPC solves a different problem entirely: not
        response shape, but the gap between a server&apos;s real types and a client&apos;s real types — solved by
        exporting a TYPE ONLY (erased at runtime) and inferring every client call from it, proven here by a real
        compile-time rejection of a wrong call before any request was sent. The real interview-ready framing: REST is
        still the correct default; reach for GraphQL when genuinely different real clients need genuinely different
        real data from the same API; reach for tRPC when one team owns both ends in TypeScript and wants the
        compiler, not runtime testing, to catch a mismatch.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["REST: fixed shape, real over/under-fetching", "GraphQL: client names the fields, one request", "tRPC: server's real TYPE inferred by the client", "pick based on who the real clients are"]} />
        <ComparisonCard
          tone="good"
          title="Which one, when — the real decision"
          points={[
            "One client, or clients with similar needs, simplicity and caching matter most? REST — still the right default.",
            "Multiple genuinely different real clients (mobile, web, partners) each needing different slices of the same data? GraphQL.",
            "One team, one TypeScript codebase, frontend and backend shipped together? tRPC — the compiler catches what REST/GraphQL can only catch at runtime.",
            "Building a genuinely public API for clients you don't control? REST or GraphQL — tRPC's whole value depends on the client sharing real TypeScript types with the server.",
          ]}
        />
      </>
    ),
  },
];

export default function BeyondRestGraphqlTrpcPage() {
  return (
    <StudyPage
      title="Beyond REST: GraphQL & tRPC Awareness"
      stageLabel="Stage F — Advanced & Interview Prep"
      stageColor="cyan"
      intro="The real REST cost these two tools each solve, measured directly — GraphQL's single-request, client-chosen fields, and tRPC's compiler-checked, end-to-end types — plus when each is actually worth reaching for over REST."
      sections={sections}
    />
  );
}
