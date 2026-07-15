import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import LayeredRoutesControllersRunner from "@/example-runners/ProjectStructureConfig/LayeredRoutesControllersRunner";
import StaticAssetsAndJsonRunner from "@/example-runners/ProjectStructureConfig/StaticAssetsAndJsonRunner";
import EnvConfigWithDotenvRunner from "@/example-runners/ProjectStructureConfig/EnvConfigWithDotenvRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function LayersDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-purple-500 mb-2.5">A request to GET /todos/1 travels down through the layers:</div>
      <div className="pl-2 mb-1.5 text-body">server.js — creates the app, mounts /todos at the router</div>
      <div className="pl-2 mb-1.5 text-cyan-500">→ routes/todos.routes.js — GET /:id goes to getTodoById (no logic here)</div>
      <div className="pl-2 mb-1.5 text-green-500">→ controllers/todos.controller.js — getTodoById actually runs, sends the response</div>
      <div className="mt-2 text-muted">
        Each layer only knows about the one below it — server.js never touches todo logic directly, and the controller never cares what URL got it here.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Layering: Routes Declare, Controllers Do",
    paragraphs: [
      "Every topic so far in this project has put everything in one server.js file — fine for a handful of routes, but it doesn't scale to a real app with dozens of endpoints. The standard fix is splitting a resource's code into two layers: a routes file that declares WHICH path + method maps to WHICH function (nothing else), and a controllers file that contains the actual logic those functions run. Reading a routes file should tell you every endpoint a resource has at a glance, without wading through implementation.",
      "The demo below proves this split doesn't change behavior at all from the client's side — the same GET/POST requests get the same real responses as a single-file version would. The layering is purely an internal organization choice; it's invisible over HTTP, and that's exactly the point.",
    ],
    extra: <LayersDiagram />,
    demo: <LayeredRoutesControllersRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/LayeredRoutesControllers/server.js",
      note: "A real, self-contained Express app — server.js just wires things together; the real logic lives in routes/todos.routes.js and controllers/todos.controller.js.",
    },
  },
  {
    heading: "Serving Static Assets Alongside a JSON API",
    paragraphs: [
      "express.static() is Express's built-in middleware for serving real files straight off disk — HTML, CSS, images, a frontend team's built output — with no route handler needed for each individual file. This is the literal bridge point between a backend and a frontend's build artifacts: the same Express app that serves your JSON API can also serve the compiled frontend sitting in a folder next to it.",
      "The demo below proves both coexist for real on the exact same app: a request for / returns a real static HTML file (a real text/html response, unmodified from disk), while a request for /api/status returns real JSON (a real application/json response) from an ordinary route handler — nothing about express.static() interferes with routes that don't match a real file in its folder.",
    ],
    demo: <StaticAssetsAndJsonRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/StaticAssetsAndJson/server.js",
      note: "A real, self-contained Express app — a real public/index.html file served by express.static(), plus a real /api/status JSON route on the same app.",
    },
  },
  {
    heading: "Environment Config with dotenv",
    paragraphs: [
      "Config that changes between environments — a port number, an API key, a database URL — doesn't belong hardcoded in your code. It belongs in a .env file: a plain-text KEY=value file, loaded once at startup, that copies its values onto process.env (the same object Node already uses for real environment variables). The dotenv package is the long-standing, still-most-common way real job codebases do this — import \"dotenv/config\" as the very first line, before anything reads process.env.SOMETHING.",
      "A real convention worth knowing alongside this: .env files with real secrets should NEVER be committed to git (this project's own root .gitignore already excludes them), while a companion .env.example file — safe placeholder values only — SHOULD be committed, so a teammate cloning the repo knows exactly which variables to fill in on their own machine.",
      "The demo below proves config is really driving real behavior, not just sitting in a file unused: process.env.PORT and process.env.GREETING_MESSAGE both hold the exact values written in .env, the /greeting route's real response body contains that exact message, and a real, separately spawned node server.js process is shown actually listening on the PORT number .env specifies.",
    ],
    demo: <EnvConfigWithDotenvRunner />,
    demoCommand: "node demo.js",
    filePointer: {
      path: "examples/ProjectStructureConfig/EnvConfigWithDotenv/server.js",
      note: "A real, self-contained Express app — a real .env (git-ignored) and .env.example (committed) side by side, loaded with dotenv.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Splitting routes (which paths exist) from controllers (what actually happens) is the standard way a real Express app stays readable past a handful of endpoints — server.js should stay thin, just wiring things together. express.static() serves real files straight off disk with no route handler needed, and can live on the exact same app as a JSON API — the literal handoff point with a frontend team's build output. And config that differs per environment or is secret belongs in a real .env file, loaded with dotenv (or Node's own newer --env-file flag), never hardcoded — with .env itself git-ignored and a placeholder .env.example committed in its place.",
    ],
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
