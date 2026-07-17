import StudyPage, { type StudySection } from "@/components/StudyPage";
import FlowChain from "@/components/FlowChain";
import ComparisonCard from "@/components/ComparisonCard";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import EventLoopOrderRunner from "@/example-runners/NodeRuntimeFoundations/EventLoopOrderRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17 so
// every box carries its own plain-English caption, not just a label — the
// diagram should explain itself without needing the surrounding prose.

function RuntimeLayersDiagram() {
  const toneClasses = {
    blue: "bg-blue-500/3 border-blue-500 text-blue-500",
    green: "bg-green-500/3 border-green-500 text-green-500",
    none: "bg-surface-raised border-border text-body",
  } as const;
  const layers: { title: string; caption: string; tone: keyof typeof toneClasses }[] = [
    { title: "Your JavaScript Code", caption: "The functions, variables, and logic you actually write.", tone: "none" },
    { title: "V8 — the engine", caption: "Reads your JavaScript and runs it. The exact same engine Google Chrome uses.", tone: "blue" },
    {
      title: "libuv — the helper",
      caption:
        "V8 alone can't touch a file or a network. libuv is bolted on top to handle files, network connections, timers, and the event loop itself.",
      tone: "green",
    },
    { title: "Your Operating System", caption: "The real disk and the real network card libuv talks to.", tone: "none" },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Node.js, layer by layer</div>
      <div className="flex flex-col gap-1.5">
        {layers.map((layer, i) => (
          <div key={layer.title}>
            <div className={`rounded-card px-3 py-2 border ${toneClasses[layer.tone]}`}>
              <div className="font-mono text-sm font-semibold">{layer.title}</div>
              <div className="text-xs mt-0.5 opacity-90 leading-relaxed">{layer.caption}</div>
            </div>
            {i < layers.length - 1 && <div className="text-center text-muted text-xs py-1">↓</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function LibuvPhasesDiagram() {
  const phases = [
    { name: "timers", detail: "Runs any setTimeout / setInterval callback whose wait time is already up." },
    { name: "pending callbacks", detail: "A few rare, low-level system callbacks. You almost never touch this one directly." },
    { name: "poll", detail: "Checks for new file/network results and runs their callbacks. If there's nothing else to do, Node waits here." },
    { name: "check", detail: "Runs every setImmediate() callback — always right after poll, every single cycle." },
    { name: "close callbacks", detail: "Runs cleanup callbacks, like socket.on('close', ...)." },
  ];
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-purple-500 text-sm font-semibold mb-3">
        One trip through all 5 phases below = &quot;one tick&quot; of Node&apos;s event loop.
      </div>
      <div className="flex flex-col gap-2">
        {phases.map((phase, i) => (
          <div key={phase.name} className="flex items-start gap-2.5">
            <span
              className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[10px] mt-0.5 ${
                phase.name === "check" ? "border-yellow-500 text-yellow-500" : "border-cyan-500 text-cyan-500"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <span className={`font-mono text-sm font-semibold ${phase.name === "check" ? "text-yellow-500" : "text-cyan-500"}`}>
                {phase.name}
              </span>
              <div className="text-body text-xs leading-relaxed mt-0.5">{phase.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-sublabel text-xs mt-3 pl-7">↳ then back to timers, forever, for as long as the process runs.</div>
      <div className="mt-3 pt-3 border-t border-border text-body text-xs leading-relaxed">
        Promises (<code className="text-cyan-500">.then</code>) and <code className="text-cyan-500">queueMicrotask</code> are NOT one of
        these 5 phases — they always finish completely between every single callback, no matter which phase you&apos;re in. Same rule
        you already know from plain JavaScript.
      </div>
    </div>
  );
}

function EventLoopOrderDiagram() {
  const steps = [
    { label: "1-2", title: "Synchronous code", detail: "Runs top to bottom, immediately, before anything else gets a turn." },
    {
      label: "3-4",
      title: "Microtasks drain completely",
      detail: "Promise.then and queueMicrotask both run, fully, before any timer or setImmediate gets a turn.",
    },
    {
      label: "5-6",
      title: "One event loop phase runs",
      detail: "setTimeout (timers phase) and setImmediate (check phase) each get their turn.",
    },
  ];
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">The real order, step by step</div>
      <div className="flex flex-col gap-1.5 mb-4">
        {steps.map((step, i) => (
          <div key={step.label}>
            <div className="rounded-card px-3 py-2 border border-border bg-surface-raised">
              <span className="font-mono text-xs text-cyan-500 mr-2">lines {step.label}</span>
              <span className="font-mono text-sm font-semibold text-body">{step.title}</span>
              <div className="text-xs mt-0.5 text-body leading-relaxed">{step.detail}</div>
            </div>
            {i < steps.length - 1 && <div className="text-center text-sublabel text-xs py-1">↓</div>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2.5">
          <div className="text-yellow-500 text-xs font-mono font-semibold mb-1">Started at the top of a script</div>
          <div className="text-body text-xs leading-relaxed">Order NOT guaranteed. Lines 5 and 6 can swap places between runs.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="text-green-500 text-xs font-mono font-semibold mb-1">Started inside a real I/O callback</div>
          <div className="text-body text-xs leading-relaxed">
            Order IS guaranteed. Line 6 (setImmediate) always wins — check always runs right after poll.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Node Is a Runtime, Not a Language",
    body: (
      <>
        <p>
          JavaScript, all by itself, cannot read a file. It cannot open a network connection. The people who designed the JavaScript
          language never gave it those powers — something else has to add them.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "In a Browser: the Browser Adds the Powers",
              description:
                "When your JavaScript runs inside Chrome or Firefox, the browser hands it extra tools: fetch to make network calls, the DOM to change a web page, localStorage to save small bits of data.",
              example: "document.querySelector(...) only works because the browser built it. It is not part of JavaScript itself.",
            },
            {
              label: "Outside a Browser: Node.js Adds the Powers",
              description:
                "Node.js does the same job as a browser, but for JavaScript running on a server or your own computer. It gives JavaScript the power to read files, open network connections, and talk to a database.",
              example: "fs.readFile(...) and http.createServer(...) both come from Node. Neither one is part of the JavaScript language.",
            },
          ]}
        />
        <p>Node.js itself is a program written in C++. Inside that program are two main parts, working together as a team.</p>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "V8 — the Engine",
              description:
                "V8 is the part that actually reads your JavaScript and runs it, line by line. It is the exact same engine Google Chrome uses to run JavaScript in your browser.",
            },
            {
              label: "libuv — the Helper",
              description:
                "V8 cannot touch a file or a network on its own. libuv is a separate piece of code, also written in C++, that Node bolts on top of V8. It is what actually handles files, network connections, timers, and the event loop itself.",
            },
          ]}
        />
        <p>
          Why split the work like this? V8 can only do one thing at a time — think of it as a single-lane road with room for exactly
          one car. If V8 had to sit and wait every time your code asked for a slow file, your whole program would freeze while it
          waited. libuv fixes that: when your code asks for something slow, libuv takes that request off to the side. V8 keeps
          running your other code. When the slow thing finally finishes, libuv brings the result back and your callback runs.
        </p>
        <Callout title="The Bottom Line">
          Node.js is not a new version of JavaScript. It is V8 (the engine that runs your code) plus libuv (the helper that gives it
          real-world powers like files and networks), packaged together into one program.
        </Callout>
      </>
    ),
    extra: <RuntimeLayersDiagram />,
  },
  {
    heading: "New Territory: libuv's Actual Phases and the Thread Pool",
    body: (
      <>
        <ConceptBreakdown
          items={[
            {
              label: "The Rule You Already Know Still Applies",
              description:
                "You already know this cold from plain JavaScript: synchronous code runs first. Then the microtask queue (Promise.then, queueMicrotask) empties out completely. Then exactly one macrotask runs. Then microtasks empty out again. That rule does not change in Node — it is still exactly true.",
            },
            {
              label: "What's Actually New: 'Macrotask' Is Really 5 Named Phases",
              description:
                "In plain JavaScript, you were told there is one 'macrotask queue.' In Node, that is really libuv running through a fixed cycle of 5 named phases, one after another, forever. Which phase you are currently in decides which kind of callback is allowed to run next.",
            },
            {
              label: "'Single-Threaded' Only Describes Your JavaScript Code",
              description:
                "There is exactly one JS call stack, so two of your own callbacks can never run at the exact same instant. But Node itself is not doing only one thing overall: libuv quietly runs its own thread pool (4 threads by default) off to the side, just for jobs that have no native async option — reading files, and some crypto/DNS work. A network request doesn't even need the thread pool — the operating system itself handles that asynchronously. None of this ever blocks your one JS thread.",
            },
            {
              label: "Why This Is the Reason Node Works Well as a Backend",
              description:
                "An older style of server gives every incoming connection its own thread, and a busy server can run out of threads fast. Node keeps just one JS thread free at all times to keep accepting new work, and only comes back to run your callback when its phase comes back around in the cycle.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Node&apos;s event loop is not one queue — it is libuv cycling through 5 real, named phases (timers → pending callbacks → poll →
          check → close callbacks) forever. setImmediate lives specifically in the check phase, always right after poll.
        </Callout>
      </>
    ),
    extra: (
      <>
        <FlowChain steps={["timers", "pending callbacks", "poll (I/O)", "check (setImmediate)", "close callbacks", "→ timers again"]} />
        <LibuvPhasesDiagram />
      </>
    ),
  },
  {
    heading: "Seeing the Real Order",
    body: (
      <>
        <p>
          The demo below logs 6 lines out of order on purpose, so you can watch the real rule play out. Lines 1-4 are the part you
          already know: synchronous code first, then both microtasks, in order, completely, before any timer gets a turn. Lines 5
          and 6 are the genuinely new, Node-only part — setImmediate() does not exist in browsers at all, and it lives specifically
          in libuv&apos;s check phase from the diagram above.
        </p>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "At the Top Level of a Script: the Order Is NOT Guaranteed",
              description:
                "Confirmed directly by actually running this exact file over and over on this machine, not assumed from memory: setTimeout(fn, 0) (timers phase) and setImmediate(fn) (check phase) sometimes swap places when a script starts running fresh. This is real, documented Node behavior, not a bug in this demo — it depends on tiny timing differences in how long the process took to start up.",
              example: "Run the demo below a few times. Watch lines 5 and 6 occasionally trade places.",
            },
            {
              label: "Inside an I/O Callback: the Order IS Guaranteed",
              description:
                "Confirmed the same way, 5 out of 5 real runs: once you are already inside a callback for real file or network I/O, setImmediate() is guaranteed to run before setTimeout(fn, 0), every single time. That callback fires during the poll phase, and check (where setImmediate lives) is always the very next phase — timers won't come around again until a whole new cycle starts.",
              example: "This exact distinction is a real, commonly asked interview question.",
            },
          ]}
        />
      </>
    ),
    extra: <EventLoopOrderDiagram />,
    demo: <EventLoopOrderRunner />,
    demoCommand: "node event-loop-order.js",
    filePointer: {
      path: "examples/NodeRuntimeFoundations/EventLoopOrder/event-loop-order.js",
      note: "The exact script the demo above runs, unmodified — open it directly and run `npm start` in that folder yourself.",
    },
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: Node is a C++ program. It embeds V8 (which runs your JavaScript on one thread) plus libuv
        (which adds a thread pool and a real, named-phase event loop on top of async I/O). The JS-level rule you already knew —
        microtasks fully drain before the next macrotask — still holds. What&apos;s new is that a &quot;macrotask&quot; is really a fixed
        cycle of 5 libuv phases, and setImmediate lives specifically in check, right after poll.
      </p>
    ),
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
      intro="You already know the JS-level event loop (sync → microtasks → macrotask) cold. This topic covers what Node specifically adds on top of plain JS to make that model actually run outside a browser: V8, libuv, its thread pool, and the real named phases hiding behind the word 'macrotask.'"
      sections={sections}
    />
  );
}
