import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import BasicExpressAppRunner from "@/example-runners/ExpressAppRouting/BasicExpressAppRunner";
import RootRouteDemoRunner from "@/example-runners/ExpressAppRouting/RootRouteDemoRunner";
import NamedWildcardsRunner from "@/example-runners/ExpressAppRouting/NamedWildcardsRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (every section needs its
// OWN diagram; a live demo doesn't substitute for one). Rewritten 2026-07-17.

function ExpressVsNextDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The mental model you already have, mapped over</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-sm font-semibold text-cyan-500">next dev</div>
          <div className="text-body text-xs leading-relaxed mt-0.5">A dev server that builds and routes pages for you — the framework manages it.</div>
        </div>
        <div className="rounded-card border border-purple-500 bg-purple-500/3 px-3 py-2">
          <div className="font-mono text-sm font-semibold text-purple-500">node server.js</div>
          <div className="text-body text-xs leading-relaxed mt-0.5">YOU write the server. Express just gives you app.get/post/etc. and a router — nothing runs itself.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">There&apos;s no framework-managed dev server here — server.js is a real, plain Node process you start yourself, every time.</span>
      </div>
    </div>
  );
}

function RequestAnatomyDiagram() {
  const parts: { source: string; caption: string; example: string }[] = [
    { source: "req.params", caption: "Comes from a named placeholder in the ROUTE PATH itself.", example: '"/greet/:name" + visiting "/greet/Lawrence" => req.params.name === "Lawrence"' },
    { source: "req.query", caption: "Comes from the ?key=value part of the URL, parsed automatically.", example: '"/search?q=express" => req.query.q === "express"' },
    { source: "req.body", caption: "Comes from data actually SENT with the request — needs express.json() registered first, or it's undefined.", example: 'POST with {"hello":"world"} => req.body.hello === "world"' },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Three different places real data comes from</div>
      <div className="flex flex-col gap-2">
        {parts.map((part) => (
          <div key={part.source} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-sm font-semibold text-cyan-500">{part.source}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{part.caption}</div>
            <div className="text-sublabel text-xs mt-1 font-mono break-all">{part.example}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WildcardChangeDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A real Express 5 breaking change</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">Express 4: app.get(&quot;/old/*&quot;, ...)</div>
          <div className="text-body text-xs leading-relaxed">A bare &quot;*&quot; wildcard. On Express 5, registering this now THROWS immediately.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">Express 5: app.get(&quot;/files/*splat&quot;, ...)</div>
          <div className="text-body text-xs leading-relaxed">A NAMED wildcard segment. Required now — and its match is a real ARRAY, not a joined string.</div>
        </div>
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">Visiting /files/a/b/c.txt gives req.params.splat === [&quot;a&quot;, &quot;b&quot;, &quot;c.txt&quot;] — one entry per path segment.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Creating an App: You Own the Server Now",
    body: (
      <>
        <p>
          This project pins Express 5, not Express 4 — npm&apos;s own default install and the Express Technical
          Committee&apos;s production-recommended release as of 2026. Confirmed directly: npm install express installs 5.2.1
          by default here.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "express() Creates an Empty App",
              description: "Nothing is wired up yet — just an empty website/API waiting for routes.",
              example: "const app = express();",
            },
            {
              label: "app.get(path, handler) Defines a Route",
              description: "In plain words: \"when someone visits this URL, run this function.\"",
            },
            {
              label: "app.listen(PORT) Actually Starts It",
              description: "This is the one line that opens a real network port and starts accepting requests. node server.js IS the whole \"start the server\" story here — no separate build step.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          express() only builds an empty app — nothing is running yet. app.get(path, handler) just registers what should
          happen for a URL; app.listen(PORT) is the one line that actually opens a real port and starts accepting
          requests. Unlike Next.js, there&apos;s no framework-managed dev server here — node server.js IS the whole
          &quot;start it&quot; story.
        </Callout>
        <p>
          The demo below proves this is a genuinely running server, not just a file full of definitions: it starts the
          real app above, makes one real request to its very first route (&quot;/&quot;), then calls server.close() —
          required, not just tidy, since a still-listening server keeps Node&apos;s event loop alive forever.
        </p>
      </>
    ),
    extra: <ExpressVsNextDiagram />,
    demo: <RootRouteDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ExpressAppRouting/CreatingTheApp/server.js",
      note: "A real, self-contained Express app just for this — one route, nothing else, with plain-English comments explaining every piece.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ExpressAppRouting/CreatingTheApp"
        runCommand="node server.js"
        runPort={4000}
        steps={[{ method: "GET", path: "/", expectStatus: 200, expectBody: '{"message":"Basic Express 5 app — real routes below"}' }]}
      />
    ),
  },
  {
    heading: "Routes, Params, Query, Body, and a Real Router",
    body: (
      <>
        <p>Real data reaches a route handler from three genuinely different places.</p>
        <ConceptBreakdown
          items={[
            {
              label: "express.json() Has to Run First for req.body",
              description: "app.use(express.json()) needs to be registered before any route reads req.body — without it, req.body is undefined, a genuinely common beginner bug.",
            },
            {
              label: "express.Router() Splits Routes Across Files",
              description:
                "This is how real Express apps avoid one giant server.js — this example actually proves it: the /api routes live in their own real file, api-routes.js, which knows nothing about server.js at all.",
              example: 'server.js just imports that router and mounts it: app.use("/prefix", router) — every request under that prefix gets forwarded automatically.',
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          A real backend keeps growing this way: one routes file per related group of endpoints (users, orders,
          auth...), never one giant file with every route crammed in. req.params, req.query, and req.body are three
          genuinely different sources of data — mixing them up is a common real bug.
        </Callout>
        <p>
          The demo below exercises every one of these against the real, running app above — a route param, a query
          string, a real parsed JSON body, and the mounted router, each hit with a real request.
        </p>
      </>
    ),
    extra: <RequestAnatomyDiagram />,
    demo: <BasicExpressAppRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ExpressAppRouting/RoutesParamsQueryBody/api-routes.js", note: "A real, separate routes file — this is what \"splitting routes across files\" actually looks like, not just a description of it." },
      { path: "examples/ExpressAppRouting/RoutesParamsQueryBody/server.js", note: "A real, self-contained Express app just for this — params, query, body, and the mounted router, nothing else." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ExpressAppRouting/RoutesParamsQueryBody"
        runCommand="node server.js"
        runPort={4001}
        steps={[
          { method: "GET", path: "/greet/Lawrence", expectStatus: 200, expectBody: '{"message":"Hello, Lawrence!"}' },
          { method: "GET", path: "/search?q=express", expectStatus: 200, expectBody: '{"query":"express","receivedQuery":{"q":"express"}}' },
          {
            method: "POST",
            path: "/echo",
            body: JSON.stringify({ hello: "world" }, null, 2),
            expectStatus: 200,
            expectBody: '{"youSent":{"hello":"world"}}',
          },
          { method: "GET", path: "/api/status", expectStatus: 200, expectBody: '{"status":"ok","mountedAt":"/api"}' },
        ]}
      />
    ),
  },
  {
    heading: "A Real Express 5 Routing Change: Named Wildcards",
    body: (
      <>
        <p>This is a genuine, confirmed Express 5 breaking change, not a minor detail.</p>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "The Old Bare Wildcard Now Throws",
              description: 'The old Express 4 pattern, app.get("/old/*", ...), now THROWS at route-registration time on Express 5 — its router is built on a newer path-to-regexp that requires a NAMED wildcard segment instead.',
            },
            {
              label: "The Match Comes Back as an Array, Not a String",
              description: 'req.params.splat for a multi-segment match is a real ARRAY of the matched path segments — genuinely easy to get wrong if you assume Express 4 behavior.',
              example: 'Requesting /files/a/b/c.txt gives splat: ["a", "b", "c.txt"].',
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Express 5&apos;s router requires a NAMED wildcard segment (like *splat) instead of a bare &apos;*&apos; — the
          old Express 4 syntax now throws immediately at registration time. And the matched value comes back as a real
          array of path segments, not a joined string, which is easy to get wrong if you&apos;re used to Express 4.
        </Callout>
        <p>
          The demo below proves both halves for real: the new named-wildcard route actually matching and returning that
          array, and — on a separate, throwaway app so it doesn&apos;t disturb the real one — the old bare &apos;*&apos;
          syntax genuinely throwing the instant you try to register it.
        </p>
      </>
    ),
    extra: <WildcardChangeDiagram />,
    demo: <NamedWildcardsRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ExpressAppRouting/NamedWildcards/server.js",
      note: "A real, self-contained Express app just for this — the one named-wildcard route, nothing else.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ExpressAppRouting/NamedWildcards"
        runCommand="node server.js"
        runPort={4006}
        steps={[
          {
            method: "GET",
            path: "/files/a/b/c.txt",
            expectStatus: 200,
            expectBody: '{"message":"wildcard match","splat":["a","b","c.txt"]}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: Express 5 is the real, current target — npm&apos;s own default, with a genuine breaking
        change in wildcard routes (named segments only, and the match comes back as an array, not a string) that trips
        people who last touched Express 4. app.get/post/use plus express.Router() for splitting routes across files is the
        real day-to-day API surface; express.json() has to be registered before any route reads req.body, or it&apos;s
        undefined.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["const app = express()", "app.get/post/use(...) register routes", "express.Router() for modular routes", "app.listen(PORT) actually starts it"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Express 5 is the current, npm-default target — Express 4's bare '*' wildcard route now throws; the replacement is a named wildcard like '/files/*splat'.",
            "A named wildcard's matched value (req.params.splat) is an array of path segments, not a joined string — a real, confirmed difference worth knowing before it surprises you in a real route.",
            "express.json() (or any body-parsing middleware) has to run before a route that reads req.body — otherwise req.body is undefined, a common real bug.",
            "express.Router() is how real apps avoid one giant server.js — mount it with app.use('/prefix', router), and every matching request gets forwarded to it.",
          ]}
        />
      </>
    ),
  },
];

export default function ExpressAppRoutingPage() {
  return (
    <StudyPage
      title="App & Router Basics (Express 5)"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="Stage B continues here: a real Express 5 app, its real routes (params, query, a parsed JSON body), a real express.Router() for splitting routes across files, and a genuine Express 5 breaking change in wildcard routes — confirmed directly, not assumed from Express 4 habits."
      sections={sections}
    />
  );
}
