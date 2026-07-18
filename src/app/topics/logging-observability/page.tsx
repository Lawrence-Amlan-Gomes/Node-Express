import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import PostmanCheck from "@/components/PostmanCheck";
import StructuredLoggingWithPinoRunner from "@/example-runners/LoggingErrorTracking/StructuredLoggingWithPinoRunner";
import RequestLoggingWithPinoHttpRunner from "@/example-runners/LoggingErrorTracking/RequestLoggingWithPinoHttpRunner";
import CatchingUncaughtErrorsRunner from "@/example-runners/LoggingErrorTracking/CatchingUncaughtErrorsRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md.

function ConsoleVsPinoDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-sublabel mb-2.5 uppercase tracking-wide text-[11px]">The SAME real event, logged two different real ways</div>
      <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2 mb-2">
        <div className="text-red-500 font-semibold mb-1">console.log(&quot;created task &quot; + task.id)</div>
        <div className="text-body">created task 2</div>
        <div className="text-sublabel mt-1">Just a plain string. A real log tool can&apos;t reliably pull the id back out of it — what if a title also contains the word &quot;task&quot;?</div>
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2">
        <div className="text-green-500 font-semibold mb-1">logger.info({"{ taskId: task.id, title: task.title }"}, &quot;created a new task&quot;)</div>
        <div className="text-body break-all">{"{\"level\":30,\"time\":1784366048747,...,\"taskId\":2,\"title\":\"Ship the logging topic\",\"msg\":\"created a new task\"}"}</div>
        <div className="text-sublabel mt-1">Real, separate JSON fields — a real log tool can filter on taskId directly, or search every line where level is 40 or higher.</div>
      </div>
    </div>
  );
}

function AutoRequestLogDiagram() {
  const rows: { route: string; status: number; level: string; levelNum: number; tone: "green" | "yellow" | "red" }[] = [
    { route: "GET /tasks/2", status: 200, level: "info", levelNum: 30, tone: "green" },
    { route: "GET /tasks/999", status: 404, level: "warn", levelNum: 40, tone: "yellow" },
    { route: "GET /broken", status: 500, level: "error", levelNum: 50, tone: "red" },
  ];
  const toneClasses: Record<string, string> = {
    green: "border-green-500 bg-green-500/3 text-green-500",
    yellow: "border-yellow-500 bg-yellow-500/3 text-yellow-500",
    red: "border-red-500 bg-red-500/3 text-red-500",
  };
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Three real requests — ZERO logging code written inside any of these route handlers</div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.route} className={`rounded-card border px-3 py-2 ${toneClasses[row.tone]}`}>
            <div className="font-mono text-xs font-semibold">{row.route} → real {row.status}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">pino-http auto-logs this at real level &quot;{row.level}&quot; ({row.levelNum}) — checked directly with customLogLevel configured.</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">
          THE REAL GOTCHA, confirmed directly: pino-http&apos;s own DEFAULT never bumps the level for a real 500 —
          every request logs at &quot;info&quot; (30) unless you configure customLogLevel yourself, like this example does.
        </span>
      </div>
    </div>
  );
}

function CrashSafetyNetDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The SAME real crash, with and without a process-level handler — checked directly</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">NO handler registered</div>
          <div className="text-body text-xs leading-relaxed">Node still exits (code 1, confirmed directly) — but dumps a raw, unstructured stack trace straight to stderr. No level, no structure, nothing a real log tool can search or alert on.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">A real process.on() handler</div>
          <div className="text-body text-xs leading-relaxed">Node still exits (same real code 1) — but FIRST, a real structured FATAL log line gets written, and you control exactly what happens before the process actually dies.</div>
        </div>
      </div>
      <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-red-500 text-xs">The process crashes EITHER WAY — modern Node (v15+) always exits on a genuinely unhandled rejection. The real handler doesn&apos;t prevent the crash. It controls what gets logged, and how, before it happens.</span>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Structured JSON Logging with pino",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "console.log Is Fine for a Script — Not for Production",
              description: "A real production backend needs LOGS, not just printed text: structured, machine-readable JSON that a real log-search tool (Datadog, CloudWatch, Elastic) can filter and query on, with a real severity level attached to every line.",
            },
            {
              label: "pino Logs Real Structured Fields, Not Glued-Together Strings",
              description: "logger.info({ taskId: 2 }, \"created a new task\") produces a real JSON object with taskId as its own real field — never buried inside a sentence a machine has to parse.",
              example: "logger.warn({ taskId: id }, \"requested a task id that does not exist\")",
            },
            {
              label: "Real Log Levels, in Real Numeric Order",
              description: "info (30) for normal events, warn (40) for something worth a closer look, error (50) for a real failure, fatal (60) for a crash — a real log tool can filter to \"level >= 40\" to surface only what actually matters.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          A real logger turns each event into real, structured, queryable data — the exact same information a plain
          console.log string has, but shaped so a machine (or a human filtering thousands of lines) can actually use it.
        </Callout>
        <p>
          The demo below runs real requests against a real Express API using pino directly inside its
          controllers. Watch the real, structured JSON log lines print alongside the demo&apos;s own narration —
          an INFO line for a real, successful task creation, and real WARN lines for bad input and a missing task id.
        </p>
      </>
    ),
    extra: <ConsoleVsPinoDiagram />,
    demo: <StructuredLoggingWithPinoRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/LoggingErrorTracking/StructuredLoggingWithPino/logger.js", note: "One real, shared pino instance — imported everywhere logging is needed, instead of console.log scattered across the codebase." },
      { path: "examples/LoggingErrorTracking/StructuredLoggingWithPino/routes/tasks.routes.js", note: "Declares which path/method maps to which controller function — no logging code here at all." },
      { path: "examples/LoggingErrorTracking/StructuredLoggingWithPino/controllers/tasks.controller.js", note: "The ONLY file that calls logger.info/logger.warn — real structured fields on every call." },
      { path: "examples/LoggingErrorTracking/StructuredLoggingWithPino/demo.js", note: "Calls the real, running API over real HTTP — the real log lines print from the same process, interleaved with this file's own narration." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/LoggingErrorTracking/StructuredLoggingWithPino"
        runCommand="node server.js"
        runPort={4078}
        steps={[
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({ title: "Try it in Postman" }, null, 2),
            note: "Watch your terminal — a real structured INFO log line prints there, not in this response.",
            expectStatus: 201,
            expectBody: '{"id":2,"title":"Try it in Postman","done":false}',
          },
          {
            method: "POST",
            path: "/tasks",
            body: JSON.stringify({}, null, 2),
            note: "A real, structured WARN log line prints in your terminal.",
            expectStatus: 400,
            expectBody: '{"error":"title is required"}',
          },
          { method: "GET", path: "/tasks/999", note: "A real, structured WARN log line prints in your terminal.", expectStatus: 404, expectBody: '{"error":"task not found"}' },
          { method: "GET", path: "/tasks", note: "A real, structured INFO log line prints in your terminal, with the real current count.", expectStatus: 200, expectBody: '[{"id":1,"title":"Write the logging topic","done":false},{"id":2,"title":"Try it in Postman","done":false}]' },
        ]}
      />
    ),
  },
  {
    heading: "Automatic Request Logging with pino-http",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "pino-http Logs EVERY Request Automatically",
              description: "Real method, real URL, real status code, real response time in milliseconds — with zero logging code written inside any route handler at all.",
            },
            {
              label: "It's Real, Global Middleware",
              description: "app.use(pinoHttp()) has to run before the real routes below it, so it can time and log every single request that reaches the app — the same reason session middleware and helmet() also live in server.js, not a controller.",
            },
            {
              label: "The Real Default Level Never Changes on a 500 — Confirmed Directly",
              description: "pino-http's own message text changes to \"request errored,\" but the numeric level stays at info (30) for every request, including a real 500, unless customLogLevel is configured.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          Automatic request logging gets you a complete request log for free — but its real default severity levels
          need a small, deliberate config fix (customLogLevel) before a real 500 actually stands out from a real 200.
        </Callout>
        <p>
          The demo below hits three real routes — an existing task (200), a missing one (404), and a route that
          deliberately fails (500) — and shows the real, automatic log line pino-http produces for each, with the
          real, correct severity level this example&apos;s customLogLevel config assigns.
        </p>
      </>
    ),
    extra: <AutoRequestLogDiagram />,
    demo: <RequestLoggingWithPinoHttpRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/LoggingErrorTracking/RequestLoggingWithPinoHttp/routes/tasks.routes.js", note: "Declares the three real routes — no logging code here either." },
      { path: "examples/LoggingErrorTracking/RequestLoggingWithPinoHttp/controllers/tasks.controller.js", note: "The real handler logic — genuinely zero logging calls anywhere in this file." },
      { path: "examples/LoggingErrorTracking/RequestLoggingWithPinoHttp/server.js", note: "The real pino-http config — trimmed serializers and the real customLogLevel fix for the 500-stays-at-info gotcha." },
      { path: "examples/LoggingErrorTracking/RequestLoggingWithPinoHttp/demo.js", note: "Calls the real, running API over real HTTP — every log line comes entirely from pino-http's own middleware." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/LoggingErrorTracking/RequestLoggingWithPinoHttp"
        runCommand="node server.js"
        runPort={4079}
        steps={[
          { method: "GET", path: "/tasks/2", note: "Watch your terminal — a real automatic INFO log line (level 30) prints there.", expectStatus: 200, expectBody: '{"id":2,"title":"Ship it","done":false}' },
          { method: "GET", path: "/tasks/999", note: "A real automatic WARN log line (level 40) prints in your terminal.", expectStatus: 404, expectBody: '{"error":"task not found"}' },
          { method: "GET", path: "/broken", note: "A real automatic ERROR log line (level 50) prints in your terminal, with a real err object attached.", expectStatus: 500, expectBody: '{"error":"simulated failure"}' },
        ]}
      />
    ),
  },
  {
    heading: "Catching Uncaught Errors & Unhandled Rejections",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "Express 5 Already Catches Errors INSIDE a Route Handler",
              description: "A rejected promise inside an async route handler gets auto-forwarded to the centralized error middleware — covered already in Error Handling in Express and Testing an Express App. This section is about the other case.",
            },
            {
              label: "What About Errors OUTSIDE Any Request Entirely?",
              description: "A background job, a fire-and-forget call, code that runs at startup — Express's own safety net never sees any of these, because they never go through a route handler at all.",
            },
            {
              label: "process.on(\"uncaughtException\" / \"unhandledRejection\") Is the Real Last Line of Defense",
              description: "Modern Node (v15+) already crashes the process on a genuinely unhandled rejection either way — with or without this handler. The real value is controlling WHAT gets logged, and HOW, before it dies.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Registering a real process-level handler doesn&apos;t stop the crash — Node was always going to exit.
          It replaces a raw, unstructured stack dump with one real, structured, searchable FATAL log line.
        </Callout>
        <p>
          The demo below spawns a real, separate Node process running a server that deliberately fires a real
          background task with no await and no .catch() — a genuine unhandled rejection, outside any request. It
          proves the real process really does exit (a real, non-zero code), but only after writing one real,
          structured log line explaining exactly what happened.
        </p>
        <p>
          Unlike every other section on this page, this one doesn&apos;t get a Postman guide — the server it runs is
          designed to crash within milliseconds of starting, on purpose, which isn&apos;t something you can usefully
          click around in Postman. Run it directly yourself instead: <code className="text-cyan-500">node server.js</code> in
          that folder, and watch your own terminal.
        </p>
      </>
    ),
    extra: <CrashSafetyNetDiagram />,
    demo: <CatchingUncaughtErrorsRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/LoggingErrorTracking/CatchingUncaughtErrors/server.js", note: "The real process.on() handlers, and a real, deliberately unawaited background task that triggers one of them." },
      { path: "examples/LoggingErrorTracking/CatchingUncaughtErrors/routes/health.routes.js", note: "A real, minimal route — proves this app has a genuine HTTP surface, structured the same as every other topic." },
      { path: "examples/LoggingErrorTracking/CatchingUncaughtErrors/controllers/health.controller.js", note: "The trivial real handler behind GET /health." },
      { path: "examples/LoggingErrorTracking/CatchingUncaughtErrors/demo.js", note: "Spawns server.js as a real, separate process (the same real pattern as the Error Handling in Express topic's LegacyTryCatch example) specifically so the real crash can be observed safely." },
    ],
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. console.log is fine for a script, but a real production backend needs structured, queryable
        logs — pino turns every event into real JSON with a real severity level, instead of a plain string a machine
        can&apos;t reliably parse. pino-http logs every real request automatically, with zero code in any route
        handler — but its own real default never bumps the severity level for a real 500, a genuine gotcha worth
        fixing with customLogLevel. And a process-level uncaughtException/unhandledRejection handler doesn&apos;t
        stop a genuinely unhandled error from crashing the process — modern Node already does that on its own — it
        just replaces a raw, unstructured stack dump with one real, structured, searchable log line before the
        process actually dies.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["something happens", "worth a log line? → structured fields, real severity level, not a glued string", "inside a route handler? → Express 5 forwards a thrown/rejected error automatically", "outside any request? → a real process-level handler logs it before Node exits anyway"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "pino vs winston, if it comes up: both produce real structured JSON. pino is widely used specifically for its low overhead — it's built to add minimal cost to a hot request path. winston is older and more configurable out of the box (built-in support for multiple real destinations — console, file, a remote HTTP endpoint — called \"transports\"). Neither one is simply \"better\" — pino when raw speed matters most, winston when you need flexible, built-in multi-destination routing without adding it yourself.",
            "Structured logging (real fields, not glued strings) is what actually makes logs searchable at scale — a real log tool can filter on a field like taskId or statusCode directly, which it can never reliably do with a plain sentence.",
            "A process-level crash handler doesn't prevent a crash — modern Node already exits on a genuinely unhandled rejection. Its real job is producing one real, structured log line instead of a raw stack dump, so whoever's on call actually knows what happened.",
            "Express 5's own automatic error forwarding (Error Handling in Express) and this topic's process-level handlers cover two DIFFERENT scopes — inside a request vs. completely outside one (a background job, startup code) — a real backend needs both, not just one.",
          ]}
        />
      </>
    ),
  },
];

export default function LoggingObservabilityPage() {
  return (
    <StudyPage
      title="Logging & Error Tracking"
      stageLabel="Stage E — Testing, Tooling & Production Readiness"
      stageColor="green"
      intro="Real structured JSON logging with pino, real automatic per-request logging with pino-http (including a genuine, confirmed gotcha in its default severity levels), and a real process-level safety net for errors that happen completely outside any request at all — each one proven against a real, running Express server."
      sections={sections}
    />
  );
}
