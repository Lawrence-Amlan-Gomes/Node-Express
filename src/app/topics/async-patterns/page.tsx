import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ReadFileThreeWaysRunner from "@/example-runners/AsyncPatternsOnServer/ReadFileThreeWaysRunner";
import BlockingServerDemoRunner from "@/example-runners/AsyncPatternsOnServer/BlockingServerDemoRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function BlockingDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-blue-500 mb-2.5">Two concurrent requests, same 300ms of &quot;work&quot; each — the only variable is HOW they wait:</div>
      <div className="mb-3">
        <div className="text-yellow-500 mb-1">/blocking — a synchronous loop</div>
        <div className="pl-2 text-body">request A: [████████████ 300ms ████████████]</div>
        <div className="pl-2 text-body">request B: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[████████████ 300ms ████████████]</div>
        <div className="pl-2 text-muted">total: ~600ms — B can&apos;t even start until A fully releases the one JS thread</div>
      </div>
      <div>
        <div className="text-green-500 mb-1">/nonblocking — a real async wait</div>
        <div className="pl-2 text-body">request A: [████████████ 300ms ████████████]</div>
        <div className="pl-2 text-body">request B: [████████████ 300ms ████████████]</div>
        <div className="pl-2 text-muted">total: ~300ms — both wait at the same time, thread is free the whole way</div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Same Operation, Three Syntaxes",
    paragraphs: [
      "Node's async story evolved in real stages, and all three still show up in real code: callbacks (fs.readFile(path, (err, data) => ...)) were the original pattern — every async Node API took a callback as its last argument. Promises wrapped that same pattern in a value you can .then() and chain. async/await is sugar on top of promises — the same underlying operation, written to read top-to-bottom like synchronous code, without actually blocking anything.",
      "The demo below reads the exact same real file three different ways and gets the exact same real content back each time — proof these are three syntaxes for the same operation, not three different behaviors.",
    ],
    demo: <ReadFileThreeWaysRunner />,
    demoCommand: "node read-file-three-ways.js",
    filePointer: {
      path: "examples/AsyncPatternsOnServer/AsyncOnAServer/read-file-three-ways.js",
      note: "The exact script the demo above runs, unmodified.",
    },
  },
  {
    heading: "Blocking the Event Loop Is a Real Production Bug, Measured",
    paragraphs: [
      "This is the single most production-relevant idea in this whole stage: Node has exactly one JS thread. A long SYNCHRONOUS operation on that thread — a heavy loop, sync file I/O (fs.readFileSync on a huge file), expensive JSON.parse, a slow regex — doesn't just slow down the one request that triggered it. It freezes the ENTIRE server, every other concurrent request included, for as long as that operation runs.",
      "The demo below proves this with real, measured numbers, not a claim: a real local http server has a /blocking route (a genuine synchronous busy-wait) and a /nonblocking route (a real async wait of the identical duration). Firing two concurrent requests at /blocking takes roughly DOUBLE the per-request time — they can't overlap, because the first one occupies the one JS thread completely until it's done. Firing two concurrent requests at /nonblocking takes roughly the SAME as one — they genuinely overlap, because an async wait frees the thread immediately.",
      "One more real, confirmed detail worth knowing: proving this by racing two DIFFERENT routes against each other (fire /blocking and a quick /ping at the same time, see which is slow) turned out to be genuinely flaky — which request's connection gets processed first isn't guaranteed by code order alone. Measuring the TOTAL time for two requests to the SAME route sidesteps that entirely, which is why the demo is built that way.",
      "As with every server demo in this app, the script ends with server.close() — an open, listening server keeps Node's event loop alive indefinitely, so closing it is what actually lets the script finish (see the Core Modules topic for the full explanation, confirmed there by testing a version without it).",
    ],
    extra: <BlockingDiagram />,
    demo: <BlockingServerDemoRunner />,
    demoCommand: "node blocking-server-demo.js",
    filePointer: {
      path: "examples/AsyncPatternsOnServer/AsyncOnAServer/blocking-server-demo.js",
      note: "The exact script the demo above runs, unmodified — read straight through to see both routes and the timing test.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Callbacks, promises, and async/await are the same underlying async model with three different syntaxes — async/await is the modern default because it reads top-to-bottom without giving up any of what promises already do. The real production concern isn't syntax, though — it's that Node has one JS thread, and any genuinely synchronous work on it (not I/O-bound waiting, but actual CPU-bound computation or a *Sync fs call) blocks every other request the whole server is handling, not just its own.",
    ],
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
