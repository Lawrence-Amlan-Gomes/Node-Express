import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ReadFileThreeWaysRunner from "@/example-runners/AsyncPatternsOnServer/ReadFileThreeWaysRunner";
import BlockingServerDemoRunner from "@/example-runners/AsyncPatternsOnServer/BlockingServerDemoRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (every section needs its
// OWN diagram; a live demo doesn't substitute for one). Rewritten 2026-07-17.

function ThreeSyntaxesDiagram() {
  const rows: { name: string; caption: string }[] = [
    { name: "1) Callback", caption: "fs.readFile(path, (err, data) => ...) — the function you pass runs LATER, once the real read finishes." },
    { name: "2) Promise", caption: "fs.promises.readFile(path).then(data => ...) — the same operation, wrapped in a value you can chain with .then()." },
    { name: "3) async/await", caption: "const data = await fs.promises.readFile(path) — the SAME promise from #2, written to read top to bottom." },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same real file read, three different syntaxes</div>
      <div className="flex flex-col gap-2 mb-3">
        {rows.map((row) => (
          <div key={row.name} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-sm font-semibold text-cyan-500">{row.name}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5 font-mono">{row.caption}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2 text-center">
        <span className="text-green-500 text-xs">All three return the exact same real file content — same operation, different syntax only.</span>
      </div>
    </div>
  );
}

function BlockingDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">
        Two concurrent requests, same 300ms of &quot;work&quot; each — the only variable is HOW they wait
      </div>
      <div className="flex flex-col gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="text-red-500 text-xs font-mono font-semibold mb-1.5">/blocking — a synchronous loop</div>
          <div className="font-mono text-[11px] leading-relaxed text-body">
            request A: [████████████ 300ms ████████████]
            <br />
            request B: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[████████████ 300ms ████████████]
          </div>
          <div className="text-sublabel text-xs mt-1.5">
            total: ~600ms — B can&apos;t even start until A fully releases the one JS thread.
          </div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="text-green-500 text-xs font-mono font-semibold mb-1.5">/nonblocking — a real async wait</div>
          <div className="font-mono text-[11px] leading-relaxed text-body">
            request A: [████████████ 300ms ████████████]
            <br />
            request B: [████████████ 300ms ████████████]
          </div>
          <div className="text-sublabel text-xs mt-1.5">total: ~300ms — both wait at the same time, thread is free the whole way.</div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Same Operation, Three Syntaxes",
    body: (
      <>
        <p>Node&apos;s async story grew in real stages. All three of these styles still show up in real code today.</p>
        <ConceptBreakdown
          items={[
            {
              label: "Callbacks — the Original Pattern",
              description: "Every async Node API used to take a callback as its last argument. This is still the actual underlying mechanism, even today.",
              example: "fs.readFile(path, (err, data) => ...)",
            },
            {
              label: "Promises — the Same Pattern, Wrapped in a Value",
              description: "A Promise wraps that same underlying operation in a real value you can chain with .then().",
              example: "fs.promises.readFile(path).then(data => ...)",
            },
            {
              label: "async/await — Sugar on Top of Promises",
              description: "The exact same underlying operation as #2, written to read top-to-bottom like synchronous code — without actually blocking anything.",
              example: "const data = await fs.promises.readFile(path)",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          The demo below reads the exact same real file three different ways and gets the exact same real content back each
          time — proof these are three syntaxes for the same operation, not three different behaviors.
        </Callout>
      </>
    ),
    extra: <ThreeSyntaxesDiagram />,
    demo: <ReadFileThreeWaysRunner />,
    demoCommand: "node read-file-three-ways.js",
    filePointer: {
      path: "examples/AsyncPatternsOnServer/ReadFileThreeWays/read-file-three-ways.js",
      note: "The exact script the demo above runs, unmodified.",
    },
  },
  {
    heading: "Blocking the Event Loop Is a Real Production Bug, Measured",
    body: (
      <>
        <p>This is the single most production-relevant idea in this whole stage: Node has exactly one JS thread.</p>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "A Long Synchronous Operation Freezes the WHOLE Server",
              description:
                "A heavy loop, sync file I/O (fs.readFileSync on a huge file), expensive JSON.parse, a slow regex — none of these just slow down the one request that triggered them. They freeze the ENTIRE server, every other concurrent request included, for as long as they run.",
            },
            {
              label: "The Demo Below Proves This With Real, Measured Numbers",
              description:
                "A real local http server has a /blocking route (a genuine synchronous busy-wait) and a /nonblocking route (a real async wait of the identical duration). Firing two concurrent requests at /blocking takes roughly DOUBLE the per-request time. Firing two concurrent requests at /nonblocking takes roughly the SAME as one.",
            },
            {
              label: "Racing Two Different Routes Turned Out to Be Flaky",
              description:
                "Firing /blocking and a quick /ping at the same time, to see which one is slow, isn't reliable — which request's connection gets processed first isn't guaranteed by code order alone. Measuring the TOTAL time for two requests to the SAME route sidesteps that entirely, which is why the demo is built that way.",
            },
          ]}
        />
        <p>
          As with every server demo in this app, the script ends with{" "}
          <code className="text-cyan-500 text-xs">server.close()</code> — an open, listening server keeps Node&apos;s event
          loop alive indefinitely, so closing it is what actually lets the script finish (see the Core Modules topic for the
          full explanation, confirmed there by testing a version without it).
        </p>
        <Callout title="The Bottom Line" accent="yellow">
          The real production concern is never the syntax you chose. It&apos;s whether any genuinely synchronous work ever runs
          on the one JS thread — that&apos;s what blocks every other request the whole server is handling, not just its own.
        </Callout>
      </>
    ),
    extra: <BlockingDiagram />,
    demo: <BlockingServerDemoRunner />,
    demoCommand: "node blocking-server-demo.js",
    filePointer: {
      path: "examples/AsyncPatternsOnServer/BlockingVsNonBlocking/blocking-server-demo.js",
      note: "The exact script the demo above runs, unmodified — read straight through to see both routes and the timing test.",
    },
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: callbacks, promises, and async/await are the same underlying async model with three
        different syntaxes. async/await is the modern default because it reads top-to-bottom without giving up any of what
        promises already do. The real production concern isn&apos;t syntax, though — it&apos;s that Node has one JS thread, and
        any genuinely synchronous work on it (not I/O-bound waiting, but actual CPU-bound computation or a *Sync fs call)
        blocks every other request the whole server is handling, not just its own.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["callback (err, data) => ...", "promise .then(data => ...)", "async/await — same promise, top-to-bottom syntax"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "async/await doesn't change Node's concurrency model — it's still one JS thread, promises underneath, just easier-to-read syntax.",
            "The real bug isn't 'using callbacks instead of async/await' — it's genuine synchronous work (a heavy loop, a *Sync fs call, a slow regex) occupying the one thread, which freezes every other concurrent request.",
            "Async I/O (network calls, timers, most fs calls) doesn't block anything — the thread is free to serve other requests while waiting on it.",
            "Measured, not assumed: two concurrent requests to a blocking route take ~2x one request's time (serialized); two concurrent requests to a non-blocking route take ~1x (overlapped).",
          ]}
        />
      </>
    ),
  },
];

export default function AsyncPatternsPage() {
  return (
    <StudyPage
      title="Async Patterns on a Server"
      stageLabel="Stage A — Node.js & Backend Foundations"
      stageColor="blue"
      intro="Callbacks, promises, and async/await are the same async model wearing three different syntaxes — but the real production stakes are elsewhere: a genuinely synchronous operation on Node's one JS thread freezes the entire server, not just its own request. This topic proves that with real, measured numbers from a real local server, not a claim to take on faith."
      sections={sections}
    />
  );
}
