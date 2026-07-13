import StudyPage, { type StudySection } from "@/components/StudyPage";
import FlowChain from "@/components/FlowChain";
import ComparisonCard from "@/components/ComparisonCard";
import EventLoopOrderRunner from "@/example-runners/NodeRuntimeFoundations/EventLoopOrderRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md.

function RuntimeLayersDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="rounded bg-surface-raised px-2.5 py-1.5 text-body mb-1.5">Your JavaScript code</div>
      <div className="text-center text-muted mb-1.5">↓ executed by</div>
      <div className="rounded bg-blue-500/10 border border-blue-500 text-blue-500 px-2.5 py-1.5 mb-1.5">
        V8 — the JS engine (same one Chrome uses)
      </div>
      <div className="text-center text-muted mb-1.5">↓ V8 alone can&apos;t touch files/network — Node bolts on</div>
      <div className="rounded bg-green-500/10 border border-green-500 text-green-500 px-2.5 py-1.5 mb-1.5">
        libuv — event loop, thread pool, async I/O
      </div>
      <div className="text-center text-muted mb-1.5">↓ talks to</div>
      <div className="rounded bg-surface-raised px-2.5 py-1.5 text-body">Operating System (filesystem, network sockets)</div>
    </div>
  );
}

function LibuvPhasesDiagram() {
  const phases = [
    { name: "timers", detail: "setTimeout / setInterval callbacks whose delay has elapsed" },
    { name: "pending callbacks", detail: "a few deferred system-level callbacks (rare in app code)" },
    { name: "poll", detail: "fetch new I/O events; run I/O callbacks (fs, network) — Node waits here if there's nothing else to do" },
    { name: "check", detail: "setImmediate() callbacks — always exactly after poll, every cycle" },
    { name: "close callbacks", detail: "e.g. socket.on('close', ...)" },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-purple-500 mb-2.5">libuv&apos;s phases — one trip through all of them is &quot;one tick&quot; of the loop:</div>
      {phases.map((phase, i) => (
        <div className="pl-2 mb-1.5 text-body" key={phase.name}>
          {i + 1}.{" "}
          <span className={phase.name === "check" ? "text-yellow-500" : "text-cyan-500"}>{phase.name}</span> —{" "}
          <span className="text-body">{phase.detail}</span>
        </div>
      ))}
      <div className="pl-2 text-muted">(→ back to timers, forever, for the life of the process)</div>
      <div className="mt-2.5 text-body">
        Microtasks (<code className="text-cyan-500">Promise.then</code>/<code className="text-cyan-500">queueMicrotask</code>) aren&apos;t
        a phase — they drain completely between every single callback anywhere in this cycle, same rule you already know from plain JS.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Node Is a Runtime, Not a Language",
    paragraphs: [
      "JavaScript by itself can't read a file or open a network socket — the language spec doesn't define those things. In a browser, the browser provides them (fetch, the DOM, localStorage). Node.js is what provides them when JavaScript runs outside a browser: it's a C++ program that embeds Google's V8 engine (the same one Chrome uses) to execute your JS, and bolts on a library called libuv to handle everything V8 can't: files, network connections, timers, and the event loop itself.",
      "This split matters immediately: V8 runs your JavaScript on a single thread, one call stack, one thing at a time. libuv is what lets Node hand off slow work (reading a file, waiting on a network response) so that single thread isn't stuck waiting — it keeps running other code, and comes back to your callback when the slow thing finishes.",
    ],
    extra: <RuntimeLayersDiagram />,
  },
  {
    heading: "New Territory: libuv's Actual Phases and the Thread Pool",
    paragraphs: [
      "You already know the JS-level event loop rule cold from plain JavaScript: synchronous code runs first, then the microtask queue (Promise.then/queueMicrotask) drains completely, then one macrotask runs, then microtasks drain again. That rule doesn't change in Node — it's still exactly true. What's actually new here is what's UNDER that rule: Node's \"macrotask queue\" isn't really one queue. It's libuv running through a fixed cycle of named phases, and which phase you're in determines which kind of callback can run.",
      "\"Single-threaded\" describes your JS call stack only — there is exactly one, so two of your callbacks never run at the literal same instant. It does NOT mean Node does one thing at a time overall: libuv keeps its own thread pool (default size 4) under the hood specifically for things that have no native async OS API — filesystem access and some crypto/DNS calls — while network I/O is handled by the OS's own async mechanisms directly, no thread pool needed. None of that blocks your one JS thread.",
      "This thread pool + phase model is the actual reason Node became a real backend choice: an old-style one-thread-per-connection server runs out of threads under real load. Node keeps its one JS thread free to keep accepting new work, and only comes back to your callback when its phase comes back around.",
    ],
    extra: (
      <>
        <FlowChain steps={["timers", "pending callbacks", "poll (I/O)", "check (setImmediate)", "close callbacks", "→ timers again"]} />
        <LibuvPhasesDiagram />
      </>
    ),
  },
  {
    heading: "Seeing the Real Order",
    paragraphs: [
      "Lines 1-4 below are the part you already know: sync first, then both microtasks in order, completely, before any timer/macrotask gets a turn. The genuinely new, Node-specific part is lines 5 and 6 — setImmediate is a real API that doesn't exist in browsers at all, and it lives specifically in libuv's check phase from the diagram above.",
      "Confirmed by actually running this exact script repeatedly on this machine (not asserted from memory): at the TOP LEVEL of a script, Node does NOT guarantee whether setTimeout(fn, 0) (timers phase) or setImmediate(fn) (check phase) runs first — it flipped between runs during testing. That's real, documented behavior, not a bug in the demo: it depends on how long process startup took relative to the timer's minimum ~1ms resolution, which can push you into the loop's first pass either just before or just after the timers phase. Rerun the demo a few times below and watch lines 5 and 6 occasionally swap places.",
      "That non-determinism disappears the moment you're already inside an I/O callback (e.g. inside fs.readFile's callback) — confirmed the same way, 5/5 runs. At that point setImmediate is guaranteed to run before setTimeout(fn, 0), every time, because an I/O callback fires during the poll phase, and check (setImmediate) is always the very next phase after poll — timers won't come around again until the next full cycle. This exact distinction is a real interview question.",
    ],
    demo: <EventLoopOrderRunner />,
    demoCommand: "node event-loop-order.js",
    filePointer: {
      path: "examples/NodeRuntimeFoundations/EventLoopOrder/event-loop-order.js",
      note: "The exact script the demo above runs, unmodified — open it directly and run `npm start` in that folder yourself.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. Node is a C++ program embedding V8 (executes your JS on one thread) plus libuv (a thread pool + a real, named-phase event loop, on top of async I/O). The JS-level rule you already knew (microtasks fully drain before the next macrotask) still holds — what's new is that \"macrotask\" is really a fixed cycle of libuv phases (timers → pending callbacks → poll → check → close callbacks), and setImmediate lives specifically in check, right after poll.",
    ],
    extra: (
      <ComparisonCard
        tone="good"
        title="What to say in the interview"
        points={[
          "Node is single-threaded for JS execution, but non-blocking overall — libuv offloads I/O to a thread pool (default 4 threads) for fs/some crypto/DNS, and to the OS directly for network sockets.",
          "Blocking the event loop (e.g. a long synchronous loop, or sync file I/O) freezes the ENTIRE server, not just one request — this is a real production bug, not just theory.",
          "Microtasks (promises) always drain completely before the next phase's callback runs — this is why a chain of .then() calls can starve a setTimeout(fn, 0) that was scheduled earlier.",
          "setImmediate vs setTimeout(fn, 0) ordering is deterministic inside an I/O callback (setImmediate wins, because check always follows poll) but NOT at the top level of a script.",
        ]}
      />
    ),
  },
];

export default function WhatIsNodeJsPage() {
  return (
    <StudyPage
      title="What is Node.js, really"
      stageLabel="Stage A — Node.js & Backend Foundations"
      stageColor="blue"
      intro="You already know the JS-level event loop (sync → microtasks → macrotask) cold. This topic is what Node specifically bolts on top of plain JS to make that model actually run outside a browser — V8, libuv, its thread pool, and the real named phases behind 'macrotask' — the mental model that makes everything else here (middleware order, why a slow route hangs the whole server) click."
      sections={sections}
    />
  );
}
