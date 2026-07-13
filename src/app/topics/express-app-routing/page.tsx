import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import BasicExpressAppRunner from "@/example-runners/ExpressAppRouting/BasicExpressAppRunner";
import RootRouteDemoRunner from "@/example-runners/ExpressAppRouting/RootRouteDemoRunner";
import NamedWildcardsRunner from "@/example-runners/ExpressAppRouting/NamedWildcardsRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function ExpressVsNextDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-purple-500 mb-2.5">The mental model you already have, mapped over:</div>
      <div className="pl-2 mb-2 text-body">
        <span className="text-cyan-500">next dev</span> — a dev server that builds/routes pages for you
      </div>
      <div className="pl-2 mb-2 text-body">
        <span className="text-cyan-500">node server.js</span> — YOU write the server; Express just gives you app.get/post/etc. and a router
      </div>
      <div className="mt-2 text-muted">
        There&apos;s no framework-managed dev server here — server.js is a real, plain Node process you start yourself, every time.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Creating an App: You Own the Server Now",
    paragraphs: [
      "This project pins Express 5, not Express 4 — npm's own default install and the Express Technical Committee's production-recommended release as of 2026 (Express 4 doesn't enter formal EOL until October 2026 at the earliest, but 5 is the real, current target for new work). Confirmed directly: npm install express installs 5.2.1 by default here.",
      "Unlike Next.js, there's no framework-managed dev server to reach for. In plain English: express() gives you back an \"app\" — an empty website/API before anything is wired up. app.get(path, handler) is how you say \"when someone visits this URL, run this function\" (a \"route\"). app.listen(PORT) is the one line that actually opens a real network port and starts accepting requests — node server.js IS the whole \"start the server\" story here; there's no separate build step (real deployments add a process manager on top of this later, covered in Stage E).",
      "The demo below proves this is a genuinely running server, not just a file full of definitions: it starts the real app above and makes one real request to its very first route, \"/\".",
      "Like every server demo in this app, it ends with server.close() — a real server that's still listening for connections keeps Node's event loop alive forever, so closing it is what actually lets the script finish and print its output (see the Core Modules topic for the full explanation, confirmed there by testing a version without it). app.listen() alone starts something meant to run forever, like a real deployed backend; these demo scripts are the opposite case — start it, prove it works, then explicitly shut it down.",
    ],
    extra: <ExpressVsNextDiagram />,
    demo: <RootRouteDemoRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ExpressAppRouting/CreatingTheApp/server.js",
      note: "A real, self-contained Express app just for this — one route, nothing else, with plain-English comments explaining every piece.",
    },
  },
  {
    heading: "Routes, Params, Query, Body, and a Real Router",
    paragraphs: [
      "req.params carries real route-parameter values (:name in the route pattern); req.query carries the real parsed query string; req.body needs the express.json() middleware actually registered first (app.use(express.json())) before any route can read a real parsed JSON body — without it, req.body is undefined, a genuinely common beginner bug.",
      "express.Router() is how real Express apps split routes across multiple files instead of one giant server.js — and this example actually proves it rather than just claiming it: the /api routes live in their own real file, api-routes.js, which knows nothing about server.js at all. server.js just imports that router and mounts it with app.use(\"/prefix\", router) — every request under that prefix gets forwarded to it automatically. A real backend keeps growing this way: a routes file per related group (users, orders, auth...), never one giant file with every route in it.",
      "The demo below exercises every one of these against the real, running app above — route params, query params, a real posted JSON body, the mounted (separately-filed) router, and Express's real default 404 behavior for anything that matches nothing.",
    ],
    demo: <BasicExpressAppRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/ExpressAppRouting/RoutesParamsQueryBody/api-routes.js", note: "A real, separate routes file — this is what \"splitting routes across files\" actually looks like, not just a description of it." },
      { path: "examples/ExpressAppRouting/RoutesParamsQueryBody/server.js", note: "A real, self-contained Express app just for this — params, query, body, and the mounted router, nothing else." },
    ],
  },
  {
    heading: "A Real Express 5 Routing Change: Named Wildcards",
    paragraphs: [
      "This is a genuine, confirmed Express 5 breaking change, not a minor detail: the old Express 4 bare wildcard pattern (app.get(\"/old/*\", ...)) now THROWS at route-registration time. Express 5's router (built on a newer path-to-regexp) requires a named wildcard segment instead: app.get(\"/files/*splat\", ...).",
      "Also confirmed directly, and genuinely easy to get wrong if you assume Express 4 behavior: req.params.splat for a multi-segment match isn't a single joined string — it's a real ARRAY of the matched path segments (e.g. requesting /files/a/b/c.txt gives splat: [\"a\", \"b\", \"c.txt\"]).",
      "The demo below proves both halves for real: the new named-wildcard route actually matching and returning that array, and — on a separate, throwaway app so it doesn't disturb the real one — the old bare '*' syntax genuinely throwing the instant you try to register it.",
    ],
    demo: <NamedWildcardsRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ExpressAppRouting/NamedWildcards/server.js",
      note: "A real, self-contained Express app just for this — the one named-wildcard route, nothing else.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Express 5 is the real, current target — npm's own default, with a genuine breaking change in wildcard routes (named segments only, and the match comes back as an array, not a string) that trips people who last touched Express 4. app.get/post/use plus express.Router() for splitting routes across files is the real day-to-day API surface; express.json() has to be registered before any route reads req.body, or it's undefined.",
    ],
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
      intro="Stage B starts here: a real Express 5 app, its real routes (params, query, a parsed JSON body), a real express.Router() for splitting routes across files, and a genuine Express 5 breaking change in wildcard routes — confirmed directly, not assumed from Express 4 habits."
      sections={sections}
    />
  );
}
