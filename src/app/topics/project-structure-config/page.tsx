import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import LayeredRoutesControllersRunner from "@/example-runners/ProjectStructureConfig/LayeredRoutesControllersRunner";
import StaticAssetsAndJsonRunner from "@/example-runners/ProjectStructureConfig/StaticAssetsAndJsonRunner";
import EnvConfigWithDotenvRunner from "@/example-runners/ProjectStructureConfig/EnvConfigWithDotenvRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17.

function LayersDiagram() {
  const steps: { label: string; caption: string }[] = [
    { label: "server.js", caption: "Creates the app, mounts /todos at the router — does NOT contain todo logic." },
    { label: "routes/todos.routes.js", caption: "GET /:id goes to getTodoById. Just a table of path → function, no logic." },
    { label: "controllers/todos.controller.js", caption: "getTodoById actually runs here — reads data, sends the real response." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">A request to GET /todos/1, travelling down through the layers</div>
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
        <span className="text-yellow-500 text-xs">Each layer only knows about the one below it — server.js never touches todo logic, and the controller never cares what URL got it here.</span>
      </div>
    </div>
  );
}

function StaticVsApiDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two very different requests, on the exact same app</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">GET / (or /index.html)</div>
          <div className="text-body text-xs leading-relaxed">Matches a REAL file in public/. express.static() sends it straight off disk — no route handler code of ours runs at all.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">GET /api/status</div>
          <div className="text-body text-xs leading-relaxed">No matching file in public/, so express.static() does nothing — the request falls through to our real route handler instead.</div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">Same app, same port — a real static website and a real JSON API, coexisting without conflict.</span>
      </div>
    </div>
  );
}

function EnvConfigDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Where a route&apos;s real value actually comes from</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs font-semibold text-cyan-500">.env (plain text file, on disk)</div>
          <div className="text-body text-xs leading-relaxed mt-0.5">GREETING_MESSAGE=Hello from your real .env file...</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs font-semibold text-cyan-500">import &quot;dotenv/config&quot; (runs FIRST, top of the file)</div>
          <div className="text-body text-xs leading-relaxed mt-0.5">Reads .env, copies every KEY=value onto process.env.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs font-semibold text-cyan-500">process.env.GREETING_MESSAGE</div>
          <div className="text-body text-xs leading-relaxed mt-0.5">Now holds the real .env value — read by the /greeting route.</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">.env</div>
          <div className="text-body text-xs leading-relaxed">Real values, real secrets. Git-ignored — NEVER committed.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">.env.example</div>
          <div className="text-body text-xs leading-relaxed">Safe placeholder values only. Committed, so teammates know what to fill in.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Layering: Routes Declare, Controllers Do",
    body: (
      <>
        <p>
          Every topic so far in this project has put everything in one server.js file — fine for a handful of routes,
          but it doesn&apos;t scale to a real app with dozens of endpoints.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "Routes Declare WHICH Path Maps to WHICH Function",
              description: "Nothing else lives here. Reading a routes file should tell you every endpoint a resource has, at a glance, without wading through implementation.",
            },
            {
              label: "Controllers Contain the ACTUAL Logic",
              description: "Reading the request, deciding what to do, sending a response — a controller function doesn't know or care what URL path got it there.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          Splitting routes from controllers is the standard way a real Express app stays readable past a handful of
          endpoints — server.js should stay thin, just wiring things together, never growing into a wall of logic.
        </Callout>
        <p>
          The demo below proves this split doesn&apos;t change behavior at all from the client&apos;s side — the same
          GET/POST requests get the same real responses as a single-file version would. The layering is purely an
          internal organization choice; it&apos;s invisible over HTTP, and that&apos;s exactly the point.
        </p>
      </>
    ),
    extra: <LayersDiagram />,
    demo: <LayeredRoutesControllersRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/LayeredRoutesControllers/server.js",
      note: "A real, self-contained Express app — server.js just wires things together; the real logic lives in routes/todos.routes.js and controllers/todos.controller.js.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ProjectStructureConfig/LayeredRoutesControllers"
        runCommand="node server.js"
        runPort={4030}
        steps={[
          {
            method: "GET",
            path: "/todos",
            expectStatus: 200,
            expectBody: '[{"id":1,"text":"Learn Express routing","done":true},{"id":2,"text":"Learn layered project structure","done":false}]',
          },
          { method: "GET", path: "/todos/1", expectStatus: 200, expectBody: '{"id":1,"text":"Learn Express routing","done":true}' },
          {
            method: "POST",
            path: "/todos",
            body: JSON.stringify({ text: "Test via Postman" }, null, 2),
            expectStatus: 201,
            expectBody: '{"id":3,"text":"Test via Postman","done":false}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Serving Static Assets Alongside a JSON API",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "express.static() Serves Real Files Off Disk",
              description: "HTML, CSS, images, a frontend team's built output — no route handler needed for each individual file.",
            },
            {
              label: "The Literal Bridge Point With a Frontend",
              description: "The same Express app that serves your JSON API can also serve the compiled frontend sitting in a folder next to it.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          express.static() and an ordinary JSON route can live on the exact same app without conflict — it only
          answers requests that match a real file, and lets everything else fall through untouched.
        </Callout>
        <p>
          The demo below proves both coexist for real on the exact same app: a request for / returns a real static
          HTML file (a real text/html response, unmodified from disk), while a request for /api/status returns real
          JSON (a real application/json response) from an ordinary route handler.
        </p>
      </>
    ),
    extra: <StaticVsApiDiagram />,
    demo: <StaticAssetsAndJsonRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/StaticAssetsAndJson/server.js",
      note: "A real, self-contained Express app — a real public/index.html file served by express.static(), plus a real /api/status JSON route on the same app.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ProjectStructureConfig/StaticAssetsAndJson"
        runCommand="node server.js"
        runPort={4031}
        steps={[
          {
            method: "GET",
            path: "/",
            expectStatus: 200,
            expectBody: "The real public/index.html file, unmodified — starts with <!DOCTYPE html> and an <h1> saying \"This is a real file on disk, not generated by any route handler.\"",
          },
          { method: "GET", path: "/api/status", expectStatus: 200, expectBody: '{"status":"ok","servedBy":"the JSON API, not a static file"}' },
        ]}
      />
    ),
  },
  {
    heading: "Environment Config with dotenv",
    body: (
      <>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "Config That Changes Per Environment Belongs in .env",
              description: "A port number, an API key, a database URL — not hardcoded in your code. A plain-text KEY=value file, loaded once at startup, copies its values onto process.env.",
              example: 'import "dotenv/config"; — the very first line, before anything reads process.env.SOMETHING.',
            },
            {
              label: ".env Is Git-Ignored; .env.example Is Committed",
              description: "Real secrets should never reach git. A companion .env.example with safe placeholder values SHOULD be committed, so a teammate knows exactly which variables to fill in.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          The exact same code behaves differently in dev, staging, and production purely by which real values happen
          to be in each environment&apos;s .env — zero code edits needed to change behavior per environment.
        </Callout>
        <p>
          The demo below proves config is really driving real behavior, not just sitting in a file unused:
          process.env.PORT and process.env.GREETING_MESSAGE both hold the exact values written in .env, the /greeting
          route&apos;s real response body contains that exact message, and a real, separately spawned node server.js
          process is shown actually listening on the PORT number .env specifies.
        </p>
      </>
    ),
    extra: <EnvConfigDiagram />,
    demo: <EnvConfigWithDotenvRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/EnvConfigWithDotenv/server.js",
      note: "A real, self-contained Express app — a real .env (git-ignored) and .env.example (committed) side by side, loaded with dotenv.",
    },
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/ProjectStructureConfig/EnvConfigWithDotenv"
        runCommand="node server.js"
        runPort={4032}
        steps={[
          {
            method: "GET",
            path: "/greeting",
            expectStatus: 200,
            expectBody: '{"message":"Hello from your real .env file, not a hardcoded string!"}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Splitting routes (which paths exist) from controllers (what actually happens) is the standard way
        a real Express app stays readable past a handful of endpoints — server.js should stay thin, just wiring things
        together. express.static() serves real files straight off disk with no route handler needed, and can live on
        the exact same app as a JSON API — the literal handoff point with a frontend team&apos;s build output. And
        config that differs per environment or is secret belongs in a real .env file, loaded with dotenv (or
        Node&apos;s own newer --env-file flag), never hardcoded — with .env itself git-ignored and a placeholder
        .env.example committed in its place.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["server.js (wiring)", "routes/ (which path)", "controllers/ (what happens)", "response out"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Routes declare which path/method maps to which function; controllers contain the actual logic — this split is what keeps a growing Express app readable.",
            "express.static() serves real files from disk with no route handler needed per file, and can coexist on the same app as a JSON API without conflict.",
            "Config that differs per environment or is secret (ports, API keys, database URLs) belongs in a real .env file loaded via dotenv, never hardcoded into source.",
            ".env (real values) is git-ignored; .env.example (safe placeholders) is committed, so teammates know what variables to set without ever seeing real secrets.",
          ]}
        />
      </>
    ),
  },
];

export default function ProjectStructureConfigPage() {
  return (
    <StudyPage
      title="Project Structure & Config"
      stageLabel="Stage B — Express Fundamentals"
      stageColor="purple"
      intro="The final piece of Express fundamentals isn't a new API — it's how a real app stays organized as it grows past one file: splitting routes from controllers, serving real static assets alongside a JSON API, and moving environment-specific config out of hardcoded source and into a real .env file."
      sections={sections}
    />
  );
}
