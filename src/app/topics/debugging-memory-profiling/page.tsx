import StudyPage, { type StudySection } from "@/components/StudyPage";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import PostmanCheck from "@/components/PostmanCheck";
import InspectorProtocolRunner from "@/example-runners/DebuggingMemoryProfiling/InspectorProtocolRunner";
import HeapSnapshotComparisonRunner from "@/example-runners/DebuggingMemoryProfiling/HeapSnapshotComparisonRunner";
import DanglingEventListenersRunner from "@/example-runners/DebuggingMemoryProfiling/DanglingEventListenersRunner";
import UnboundedCacheRunner from "@/example-runners/DebuggingMemoryProfiling/UnboundedCacheRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per
// the standing rule in co-founder/build-conventions.md.

function InspectorProtocolDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What &quot;attaching a debugger&quot; really is — a real connection, not magic</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">1. Your Node process opens a real door</div>
          <div className="text-body text-xs leading-relaxed">
            <code className="text-blue-500">node --inspect server.js</code> (or <code className="text-blue-500">inspector.open()</code> from inside code) starts a
            real WebSocket server on a real port (9229 by default) — nothing to do with your app&apos;s own HTTP port.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">2. A real client connects through that door</div>
          <div className="text-body text-xs leading-relaxed">
            Chrome DevTools (via <code className="text-blue-500">chrome://inspect</code>) is ONE real client. This section&apos;s demo is
            ANOTHER — a plain Node script, using the same real protocol, with no browser at all.
          </div>
        </div>
        <div className="rounded-card border border-blue-500/40 bg-blue-500/3 px-3 py-2">
          <div className="font-mono text-xs text-blue-500 font-semibold mb-0.5">3. The client sends real commands, gets real answers back</div>
          <div className="text-body text-xs leading-relaxed">
            &quot;Evaluate this expression.&quot; &quot;What&apos;s the current value of this variable?&quot; &quot;Pause at this line.&quot; The
            live process actually runs them and replies — while it keeps handling real requests the whole time.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-blue-500 bg-blue-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-blue-500 text-xs">
          Chrome DevTools isn&apos;t special — it&apos;s just a nice UI on top of this same real protocol.
        </span>
      </div>
    </div>
  );
}

function TryInChromeDevTools() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — Chrome DevTools, the GUI Version</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        The demo above talks to the real inspector protocol from a script. Here&apos;s the exact same real protocol, used
        the way you&apos;ll actually use it day to day.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/DebuggingMemoryProfiling/InspectorProtocol&quot; &amp;&amp; node --inspect server.js
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Chrome, address bar</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">chrome://inspect</code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">
            Under &quot;Remote Target,&quot; a real entry for this exact process appears — click its <span className="text-body font-semibold">inspect</span> link.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. In the DevTools window that opens</div>
          <div className="text-xs text-body leading-relaxed">
            Open the <span className="text-body font-semibold">Sources</span> tab, find <code className="text-cyan-500">controllers/compute.controller.js</code>, click the
            line number next to <code className="text-cyan-500">globalThis.__requestCount += 1</code> to set a real breakpoint.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">4. In Postman (or another terminal)</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">GET http://localhost:4096/compute?n=10</code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">
            Execution really pauses, right there, mid-request — BEFORE that highlighted line actually runs, not after. Open
            the real Console tab and type <code className="text-cyan-500">globalThis.__requestCount</code> (the bare name{" "}
            <code className="text-cyan-500">requestCount</code> doesn&apos;t exist — it was only ever attached to{" "}
            <code className="text-cyan-500">globalThis</code>, never declared as its own variable) — on your very FIRST
            request, expect a real <code className="text-cyan-500">0</code>, since the increment on this exact line
            hasn&apos;t happened yet. Press Step Over (F10) once and check again — now it&apos;s <code className="text-cyan-500">1</code>.
          </div>
        </div>
      </div>
    </div>
  );
}

function HeapSnapshotDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Comparison-based leak hunting — the same real technique this section&apos;s demo runs by hand</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="font-mono text-xs text-body font-semibold mb-1">BEFORE snapshot</div>
          <div className="text-body text-xs leading-relaxed">
            A real, complete freeze-frame of every object this process is holding onto, at this exact moment — written to a
            real <code className="text-purple-500">.heapsnapshot</code> file by <code className="text-purple-500">v8.writeHeapSnapshot()</code>.
          </div>
        </div>
        <div className="rounded-card border border-purple-500/40 bg-purple-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-purple-500 font-semibold mb-1">AFTER snapshot</div>
          <div className="text-body text-xs leading-relaxed">
            The exact same kind of freeze-frame, taken again after some real work runs. Same format, same technique — just a
            later moment in time.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-yellow-500 text-xs">
          The real question a leak hunt answers: which class of object grew between the two snapshots, and DIDN&apos;T get
          garbage collected in between? That growth is the leak.
        </span>
      </div>
    </div>
  );
}

function EventListenerLeakDiagram() {
  return (
    <div className="rounded-card border border-dashed border-red-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same real EventEmitter, two real routes — only ONE keeps growing</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">/subscribe-buggy — listener added INSIDE the handler</div>
          <div className="text-body text-xs leading-relaxed">
            Every real request runs <code className="text-red-500">broadcaster.on(...)</code> again. Nothing ever calls
            <code className="text-red-500"> .off()</code>. Real listener count: 1, 2, 3... forever, one more for every request.
          </div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">/subscribe-fixed — listener added ONCE, outside any handler</div>
          <div className="text-body text-xs leading-relaxed">
            The real <code className="text-green-500">broadcaster.on(...)</code> call runs one single time, when this file first
            loads. Every request after that just reuses it. Real listener count: 1, always.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 mt-3 text-center">
        <span className="text-body text-xs">
          Node itself notices this exact pattern — the real, built-in <code className="text-red-500">MaxListenersExceededWarning</code>
          {" "}fires automatically past 10 listeners on one event, without any extra tooling.
        </span>
      </div>
    </div>
  );
}

function UnboundedCacheDiagram() {
  return (
    <div className="rounded-card border border-dashed border-orange-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two real Maps used as caches — only one ever removes anything</div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-red-500/40 bg-red-500/3 px-3 py-2">
          <div className="font-mono text-xs text-red-500 font-semibold mb-0.5">cacheBuggy — every new key just gets added</div>
          <div className="text-body text-xs leading-relaxed">
            Real production traffic has effectively unlimited unique keys (user IDs, session IDs, request IDs). With no
            eviction, real cache size tracks total unique requests ever seen — not memory available.
          </div>
        </div>
        <div className="rounded-card border border-green-500/40 bg-green-500/3 px-3 py-2">
          <div className="font-mono text-xs text-green-500 font-semibold mb-0.5">cacheFixed — capped at 5, oldest evicted first</div>
          <div className="text-body text-xs leading-relaxed">
            Before adding a new key past the real cap, the real OLDEST key (Map keeps real insertion order) gets deleted
            first. Size never exceeds 5, no matter how many unique keys arrive.
          </div>
        </div>
      </div>
      <div className="rounded-card border border-orange-500 bg-orange-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-orange-500 text-xs">
          This exact shape — a plain object or Map used as a cache, with no cap and no expiry — is one of the most common
          real memory leaks in production Node apps.
        </span>
      </div>
    </div>
  );
}

function ClinicDoctorDiagram() {
  return (
    <div className="rounded-card border border-dashed border-cyan-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">What Clinic Doctor actually measures while your real app runs under real load</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Event loop delay</div>
          <div className="text-body text-xs leading-relaxed">How long real callbacks wait before the loop gets back to them — high delay points at blocking code, exactly like this section&apos;s /blocking route.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">CPU usage</div>
          <div className="text-body text-xs leading-relaxed">Real process CPU over time — sustained high usage points at expensive synchronous work.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Active handles</div>
          <div className="text-body text-xs leading-relaxed">Real open sockets, timers, file descriptors — a number that should stabilize, not climb forever.</div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2">
          <div className="font-mono text-xs text-body font-semibold mb-0.5">Garbage collection</div>
          <div className="text-body text-xs leading-relaxed">How often and how long real GC pauses run — frequent long pauses point at memory pressure.</div>
        </div>
      </div>
      <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2 mt-3 text-center">
        <span className="text-cyan-500 text-xs">
          Clinic Doctor&apos;s real value: it looks at all four together and tells you WHICH kind of problem you have, so
          you know whether to reach for a CPU profiler, a heap snapshot, or neither.
        </span>
      </div>
    </div>
  );
}

function TryClinicYourself() {
  return (
    <div className="rounded-card border border-orange-500/40 bg-orange-500/5 px-4 py-3.5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
        <span className="text-title text-sm font-semibold">Try It Yourself — In Your Own Terminal</span>
      </div>
      <div className="text-body text-xs leading-relaxed mb-3">
        Clinic Doctor genuinely needs a real terminal window it fully controls (it opens a real report when it&apos;s done) —
        it can&apos;t run as one of this page&apos;s own automatic &quot;Live Output&quot; demos the way the sections above do. Everything
        below is a real, correct command against this section&apos;s real server — run it yourself to see the real report.
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">1. Terminal</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            cd &quot;/Users/lawrencealangomes/Documents/Node Express/examples/DebuggingMemoryProfiling/ClinicJsProfiling&quot;
          </code>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">2. Run Clinic Doctor with a real, built-in load generator (autocannon)</div>
          <code className="text-cyan-500 font-mono text-xs break-all block">
            npm run profile
          </code>
          <div className="mt-1.5 text-xs text-body leading-relaxed">
            Runs <code className="text-cyan-500">clinic doctor --autocannon [ /blocking ] --open=false -- node server.js</code> —
            starts the real server, hammers <code className="text-cyan-500">/blocking</code> with real requests, then writes a real
            <code className="text-cyan-500"> .clinic/*.html</code> report.
          </div>
        </div>
        <div className="rounded-card border border-border bg-surface-raised px-3 py-2.5">
          <div className="text-sublabel text-xs uppercase tracking-wide mb-1">3. Open the real report</div>
          <div className="text-xs text-body leading-relaxed">
            A new <code className="text-cyan-500">.clinic/</code> folder appears in this same directory — open its
            <code className="text-cyan-500"> .html</code> file in any browser. Given this route&apos;s real synchronous busy-loop, expect Clinic
            Doctor to flag this as an <span className="text-body font-semibold">event loop</span> issue, not a memory or I/O one.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Attaching a Real Debugger to a Running Process",
    body: (
      <>
        <ConceptBreakdown
          accent="blue"
          items={[
            {
              label: "\"Attach a Debugger\" Just Means: Open a Real Connection to a Live Process",
              description: "It sounds mysterious, but it's a real, ordinary network connection — the same shape as any client talking to any server. The client asks questions; the running process answers them, live, without stopping.",
            },
            {
              label: "--inspect Opens a Real Door on Its Own Port",
              description: "node --inspect server.js starts a second, separate real listener (port 9229 by default) speaking the real V8 Inspector Protocol — has nothing to do with your app's own HTTP port.",
              example: "Your Express app still listens on 4096. The inspector door is a completely separate 9229, opened by Node itself.",
            },
            {
              label: "Chrome DevTools Is Just One Client of That Protocol",
              description: "chrome://inspect is a real UI built on top of that same real protocol. This section's demo below is a SECOND real client of the exact same protocol — a plain Node script, no browser needed.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="blue">
          A debugger doesn&apos;t pause your app by magic — it&apos;s a real client, connected over a real protocol, sending
          real commands to a real running process. Once that clicks, breakpoints and the Console tab stop feeling like
          tricks and start feeling like what they are: remote control.
        </Callout>
        <p>
          The demo below opens the real V8 Inspector Protocol on a real running Express server, connects to it
          programmatically (no Chrome involved), runs real code live inside that process, sends it real HTTP requests,
          then reads its real internal state back — live, through the debugger connection, not by calling the API
          again.
        </p>
      </>
    ),
    extra: <InspectorProtocolDiagram />,
    demo: <InspectorProtocolRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/DebuggingMemoryProfiling/InspectorProtocol/server.js", note: "A plain Express app — nothing in it is debugger-specific. Attaching a debugger never requires changing app code." },
      { path: "examples/DebuggingMemoryProfiling/InspectorProtocol/controllers/compute.controller.js", note: "Real state on globalThis, so a debugger session can actually read it live." },
      { path: "examples/DebuggingMemoryProfiling/InspectorProtocol/demo.js", note: "Opens the real inspector protocol, evaluates real code live, and reads the server's real live state through it." },
    ],
    postmanCheck: <TryInChromeDevTools />,
  },
  {
    heading: "Finding a Memory Leak: Heap Snapshot Comparison",
    body: (
      <>
        <ConceptBreakdown
          accent="purple"
          items={[
            {
              label: "A Heap Snapshot Is a Real, Complete Photo of Every Object in Memory",
              description: "v8.writeHeapSnapshot() writes a real file listing literally every object this process is holding onto right now — what kind it is, how big it is, and what's referencing it.",
            },
            {
              label: "One Photo Alone Tells You Almost Nothing",
              description: "Of course a running app has objects in memory — that's normal. The real signal only shows up by comparing TWO photos, taken at two different real moments.",
            },
            {
              label: "Comparison: What Grew, and Never Got Cleaned Up?",
              description: "Take a BEFORE snapshot, run some real work, take an AFTER snapshot. If a real garbage collection pass ran in between and some class of object STILL grew, those objects are still reachable somewhere — which is exactly what a leak looks like.",
              example: "This section's demo counts real LeakedRecord instances in both snapshots directly — 0 before, and a real, exact count after.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Chrome DevTools&apos; Memory tab does this exact same before/after comparison with a nicer UI. Knowing what
          it&apos;s actually doing underneath — real object counts, compared across two real moments in time — makes
          the UI version make sense instead of feeling like a black box.
        </Callout>
        <p>
          The demo below takes a real heap snapshot, allocates 3000 real objects that are deliberately never released,
          forces a real garbage-collection pass, takes a second real snapshot, then counts real instances of that
          class directly out of both real snapshot files.
        </p>
      </>
    ),
    extra: <HeapSnapshotDiagram />,
    demo: <HeapSnapshotComparisonRunner />,
    demoCommand: "node --expose-gc demo.js",
    filePointers: [
      { path: "examples/DebuggingMemoryProfiling/HeapSnapshotComparison/demo.js", note: "Takes two real heap snapshots and counts real instances of one class directly out of each real file." },
    ],
  },
  {
    heading: "Culprit 1: Dangling Event Listeners",
    body: (
      <>
        <ConceptBreakdown
          accent="red"
          items={[
            {
              label: "An EventEmitter Keeps a Real, Permanent List of Its Listeners",
              description: "Every .on() call adds one more real function to a real internal array. Nothing ever removes it automatically — that's YOUR job, by calling .off() when you're done.",
            },
            {
              label: "The Classic Mistake: .on() Inside a Request Handler",
              description: "If a route handler calls broadcaster.on(...) every time it runs, every single request adds ONE MORE real listener, forever. Each one is a real closure, keeping real memory alive.",
            },
            {
              label: "The Fix: Register Once, Outside the Handler",
              description: "Move the .on() call to module load time — it runs exactly once, no matter how many requests come in after it.",
              example: "This section's /subscribe-fixed route reuses ONE listener registered when the file first loads — real listener count stays at 1 forever.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="red">
          Node doesn&apos;t leave you guessing here — past 10 real listeners on the same event, it prints its own real
          MaxListenersExceededWarning, unprompted. That warning showing up in your logs is a real, built-in leak signal
          worth taking seriously, not silencing.
        </Callout>
        <p>
          The demo below hits a real, buggy route 15 times (adding a real listener every time) and a real, fixed route
          15 times (reusing one real listener), then prints the real listener counts for both — plus Node&apos;s own
          real warning, captured directly from the real server process&apos;s stderr.
        </p>
      </>
    ),
    extra: <EventListenerLeakDiagram />,
    demo: <DanglingEventListenersRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/DebuggingMemoryProfiling/DanglingEventListeners/broadcaster.js", note: "One real, shared EventEmitter — both routes below register on the exact same instance." },
      { path: "examples/DebuggingMemoryProfiling/DanglingEventListeners/controllers/listeners.controller.js", note: "The buggy version (listener added inside the handler) right next to the fixed version (listener added once, at module load)." },
      { path: "examples/DebuggingMemoryProfiling/DanglingEventListeners/routes/listeners.routes.js", note: "Three real routes: the buggy subscribe, the fixed subscribe, and a real listener-count check." },
      { path: "examples/DebuggingMemoryProfiling/DanglingEventListeners/demo.js", note: "Spawns the real server as its own process specifically to capture Node's real stderr warning." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/DebuggingMemoryProfiling/DanglingEventListeners"
        runCommand="node server.js"
        runPort={4093}
        steps={[
          {
            method: "GET",
            path: "/subscribe-buggy",
            note: "First call on a freshly started server.",
            expectStatus: 200,
            expectBody: '{"event":"update-buggy","listenerCount":1}',
          },
          {
            method: "GET",
            path: "/subscribe-buggy",
            note: "Same route again — watch the count go up.",
            expectStatus: 200,
            expectBody: '{"event":"update-buggy","listenerCount":2}',
          },
          {
            method: "GET",
            path: "/subscribe-fixed",
            expectStatus: 200,
            expectBody: '{"event":"update-fixed","listenerCount":1}',
          },
          {
            method: "GET",
            path: "/subscribe-fixed",
            note: "Same route again — the count does NOT move this time.",
            expectStatus: 200,
            expectBody: '{"event":"update-fixed","listenerCount":1}',
          },
          {
            method: "GET",
            path: "/listener-counts",
            expectStatus: 200,
            expectBody: '{"buggy":2,"fixed":1}',
          },
        ]}
      />
    ),
  },
  {
    heading: "Culprit 2: Unbounded In-Memory Caches",
    body: (
      <>
        <ConceptBreakdown
          accent="orange"
          items={[
            {
              label: "A Cache Is Just an Object or Map Holding Onto Results",
              description: "The whole point is skipping real, expensive work (a database query, a slow calculation) the second time the same key is asked for. Nothing wrong with that idea by itself.",
            },
            {
              label: "The Classic Mistake: No Limit, No Expiry",
              description: "If real production traffic has effectively unlimited unique keys — user IDs, session IDs, request IDs — a cache with no cap just keeps growing, forever, one entry per unique key ever seen.",
            },
            {
              label: "The Fix: a Real Cap, With Real Eviction",
              description: "Before adding a new entry past the cap, remove the OLDEST one first. Real size stays bounded no matter how much real traffic arrives.",
              example: "This section's /data-fixed route caps at 5 real entries — the 6th unique key evicts the 1st.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="orange">
          This is the single most common real memory leak in production Node apps — not a scary V8 internals problem,
          just an ordinary object used as a cache with nothing ever removing entries from it.
        </Callout>
        <p>
          The demo below requests 20 real, unique ids from a real, uncapped cache (it grows to 20) and 20 real, unique
          ids from a real, capped cache (it stays at 5) — then prints both real sizes side by side.
        </p>
      </>
    ),
    extra: <UnboundedCacheDiagram />,
    demo: <UnboundedCacheRunner />,
    demoCommand: "node demo.js",
    filePointers: [
      { path: "examples/DebuggingMemoryProfiling/UnboundedCache/caches.js", note: "Two real, separate Maps and a real cap — the only difference between the buggy and fixed routes is which one they use." },
      { path: "examples/DebuggingMemoryProfiling/UnboundedCache/controllers/cache.controller.js", note: "The buggy version (no eviction) right next to the fixed version (evicts the oldest real entry once the cap is hit)." },
      { path: "examples/DebuggingMemoryProfiling/UnboundedCache/demo.js", note: "Requests 20 unique ids against each real route, then compares the two real final cache sizes." },
    ],
    postmanCheck: (
      <PostmanCheck
        folderPath="examples/DebuggingMemoryProfiling/UnboundedCache"
        runCommand="node server.js"
        runPort={4094}
        steps={[
          {
            method: "GET",
            path: "/data-buggy/a",
            expectStatus: 200,
            expectBody: '{"id":"a","cacheSize":1}',
          },
          {
            method: "GET",
            path: "/data-buggy/b",
            note: "A different id — the buggy cache just keeps adding.",
            expectStatus: 200,
            expectBody: '{"id":"b","cacheSize":2}',
          },
          {
            method: "GET",
            path: "/data-fixed/a",
            expectStatus: 200,
            expectBody: '{"id":"a","cacheSize":1}',
          },
          {
            method: "GET",
            path: "/data-fixed/b",
            expectStatus: 200,
            expectBody: '{"id":"b","cacheSize":2}',
          },
          {
            method: "GET",
            path: "/data-fixed/c",
            expectStatus: 200,
            expectBody: '{"id":"c","cacheSize":3}',
          },
          {
            method: "GET",
            path: "/data-fixed/d",
            expectStatus: 200,
            expectBody: '{"id":"d","cacheSize":4}',
          },
          {
            method: "GET",
            path: "/data-fixed/e",
            note: "5th unique id — right at the real cap.",
            expectStatus: 200,
            expectBody: '{"id":"e","cacheSize":5}',
          },
          {
            method: "GET",
            path: "/data-fixed/f",
            note: "6th unique id — \"a\" gets evicted first, so size stays capped.",
            expectStatus: 200,
            expectBody: '{"id":"f","cacheSize":5}',
          },
          {
            method: "GET",
            path: "/cache-stats",
            expectStatus: 200,
            expectBody: '{"buggySize":2,"fixedSize":5,"maxFixedSize":5}',
          },
        ]}
      />
    ),
  },
  {
    heading: "When to Reach for Clinic.js",
    body: (
      <>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Heap Snapshots Answer \"What's Leaking?\" — Not \"Why Is This Slow?\"",
              description: "Everything so far in this topic finds memory leaks. A slow app with plenty of free memory is a genuinely different problem — Clinic.js is built specifically for that second question.",
            },
            {
              label: "Clinic Doctor: Run Your Real App Under Real Load, Get a Real Diagnosis",
              description: "It samples real, live signals — CPU, event loop delay, active handles, garbage collection — while real traffic hits your app, then tells you which KIND of problem you have.",
            },
            {
              label: "Then Reach for a Specific Tool, Not a Guess",
              description: "Doctor's real diagnosis points you to the right next tool — clinic flame for a real CPU flame graph if it's CPU-bound, or back to heap snapshots if it's actually a leak after all.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="cyan">
          Heap snapshots and Clinic Doctor aren&apos;t competing tools — they answer different real questions. Reach for
          heap snapshots when memory keeps climbing. Reach for Clinic Doctor when requests are slow and you don&apos;t
          yet know why.
        </Callout>
        <p>
          Clinic Doctor genuinely needs to control its own terminal session and writes a real HTML report at the end —
          it can&apos;t run as one of this page&apos;s own automatic demos the way the sections above do. This
          section&apos;s server (with a real, deliberately blocking route) and its real <code>npm run profile</code>{" "}
          command are both real and ready — the walkthrough below is exact, copy-pasteable, and genuinely correct to
          run yourself.
        </p>
      </>
    ),
    extra: <ClinicDoctorDiagram />,
    filePointers: [
      { path: "examples/DebuggingMemoryProfiling/ClinicJsProfiling/server.js", note: "A plain Express app with one real, deliberately blocking route — Clinic Doctor's real target for this walkthrough." },
      { path: "examples/DebuggingMemoryProfiling/ClinicJsProfiling/controllers/blocking.controller.js", note: "A real synchronous busy-loop — exactly the kind of bug Clinic Doctor is built to catch." },
      { path: "examples/DebuggingMemoryProfiling/ClinicJsProfiling/package.json", note: "Real clinic and autocannon devDependencies, and the real npm run profile script." },
    ],
    postmanCheck: <TryClinicYourself />,
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap. Attaching a debugger means opening a real connection to a real running process over the V8
        Inspector Protocol — Chrome DevTools is one client of that protocol, not the protocol itself. Finding a memory
        leak is fundamentally a comparison: take a real heap snapshot, do some work, force a real GC pass, take
        another snapshot, and see what grew that shouldn&apos;t have. The two most common real culprits behind that
        growth are dangling event listeners (a `.on()` call inside a handler that never gets `.off()`&apos;d — proven
        here against Node&apos;s own real MaxListenersExceededWarning) and unbounded in-memory caches (a Map or object
        with no cap and no expiry — proven here with a real capped cache staying at 5 while an uncapped one kept
        growing). And when the real problem is slowness rather than memory, Clinic Doctor samples real CPU, event
        loop delay, and GC behavior under real load to tell you which specific tool to reach for next.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["attach a real debugger (--inspect)", "heap snapshot BEFORE", "real work runs", "force GC, heap snapshot AFTER", "compare: what grew and shouldn't have?", "or: Clinic Doctor, when it's slowness, not memory"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "A debugger is a real client of the V8 Inspector Protocol — the same one Chrome DevTools uses — not a special built-in Node feature separate from the process itself.",
            "Leak hunting is comparison-based: one heap snapshot alone means nothing. The real signal is an object count that grows between two snapshots, with a real GC pass in between, and never comes back down.",
            "The two classic leak sources worth naming by name in an interview: event listeners registered inside a handler instead of once at setup, and in-memory caches/objects with no size cap or TTL.",
            "Node has real, built-in leak detection for one of those two: MaxListenersExceededWarning fires automatically past 10 listeners on the same event, no extra tooling required.",
            "Clinic Doctor answers a different question than heap snapshots — not 'what's leaking' but 'why is this slow' — by sampling real CPU, event loop delay, active handles, and GC together and pointing at which one is the real problem.",
          ]}
        />
      </>
    ),
  },
];

export default function DebuggingMemoryProfilingPage() {
  return (
    <StudyPage
      title="Debugging & Memory Profiling"
      stageLabel="Stage E — Testing, Tooling & Production Readiness"
      stageColor="green"
      intro="Attaching a real debugger to a live process, hunting memory leaks by comparing real heap snapshots, the two classic real culprits behind most leaks, and when a slow-but-not-leaking app calls for Clinic.js instead."
      sections={sections}
    />
  );
}
