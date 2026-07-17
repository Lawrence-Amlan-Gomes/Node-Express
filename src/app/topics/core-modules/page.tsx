import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import NodeBuiltInsTourRunner from "@/example-runners/CoreModules/NodeBuiltInsTourRunner";
import WebStandardGlobalsTourRunner from "@/example-runners/CoreModules/WebStandardGlobalsTourRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (every section needs its
// OWN diagram; a live demo doesn't substitute for one). Rewritten 2026-07-17.

function NodeBuiltInsDiagram() {
  const modules: { name: string; caption: string }[] = [
    { name: "node:path", caption: "Builds file paths the right way for whatever OS this runs on — no manual \"/\" or \"\\\\\" gluing." },
    { name: "node:fs", caption: "Reads and writes real files on disk, synchronously or with Promises." },
    { name: "Buffer", caption: "Node's raw-bytes type. Needed anywhere a real backend touches binary data — uploads, sockets, images." },
    { name: "node:events (EventEmitter)", caption: "A publish/listen pattern. Node's own streams and servers — and Express itself — are built on this internally." },
    { name: "process", caption: "Real, live info about the actual running program: its version, platform, arguments, environment." },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Built into Node — nothing here needs npm install</div>
      <div className="flex flex-col gap-2">
        {modules.map((mod) => (
          <div key={mod.name} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-sm font-semibold text-cyan-500">{mod.name}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{mod.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebGlobalsDiagram() {
  const rows: { name: string; caption: string }[] = [
    { name: "fetch", caption: "The exact same fetch() from frontend work. Node ships it natively now — no node-fetch or axios needed for a basic request." },
    { name: "Headers", caption: "The same Web-standard Headers object, used identically on both sides of a request." },
    { name: "FormData", caption: "Real multipart-form-shaped data, without installing a separate form-data npm package." },
    { name: "structuredClone", caption: "A real deep clone, built in. No JSON.parse(JSON.stringify(...)) hack needed — and it handles more real types correctly." },
  ];
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Web-standard globals Node now ships natively — no import needed</div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.name} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-sm font-semibold text-green-500">{row.name}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{row.caption}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "The Core Modules That Make Node a Runtime",
    body: (
      <>
        <p>
          These are the built-in modules that don&apos;t need installing — they ship inside Node itself. They&apos;re imported
          with the <code className="text-cyan-500 text-xs">node:</code> prefix (
          <code className="text-cyan-500 text-xs">node:path</code>,{" "}
          <code className="text-cyan-500 text-xs">node:fs</code>, and so on), which makes it clear you mean Node&apos;s own
          built-in, not some npm package with the same name.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "path",
              description: "Handles file paths correctly, on whatever operating system this runs on. No manual string gluing with / or \\.",
            },
            {
              label: "fs",
              description: "Reads and writes real files — synchronously, or with Promises for async code.",
            },
            {
              label: "process",
              description: "Exposes the actual running process: its version, its platform, its environment variables, its arguments.",
            },
            {
              label: "events (EventEmitter)",
              description: "The same publish/listen pattern that Express and most of Node's own APIs (streams, servers) are built on internally.",
            },
          ]}
        />
        <p>
          Buffer is different from the four above — it&apos;s Node&apos;s raw-bytes type, not a module you import.
        </p>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: "Why Buffer Exists at All",
              description:
                "JavaScript strings hold Unicode text, not raw binary. A real backend regularly has to handle raw binary — file uploads, sockets, image data — and a plain string would lose or mangle that information.",
              example: "Buffer.from(\"Node\") holds the real bytes [78, 111, 100, 101] — not just the text \"Node\".",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          path, fs, process, and events are the real foundation every higher-level Node/Express concept sits on. Buffer exists
          for exactly the cases where a string isn&apos;t the right type — real raw bytes.
        </Callout>
      </>
    ),
    extra: <NodeBuiltInsDiagram />,
    demo: <NodeBuiltInsTourRunner />,
    demoCommand: "node index.js",
    filePointer: {
      path: "examples/CoreModules/NodeBuiltInsTour/index.js",
      note: "The exact script the demo above runs, unmodified — open it and read straight through, numbered comment by numbered comment.",
    },
  },
  {
    heading: "Web-Standard Globals Node Now Ships Natively",
    body: (
      <>
        <p>
          This is a real, direct bridge from frontend work: fetch, Headers, FormData, and structuredClone are the same Web
          Platform APIs already used in a browser. Node now implements them natively, as real globals — no import, no
          third-party package.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "This Wasn't Always True",
              description:
                "Older Node needed a package like node-fetch or axios just for basic HTTP requests. Worth knowing when reading older codebases or tutorials that still do this.",
            },
            {
              label: "The Demo Below Proves fetch for Real",
              description:
                "The script starts an actual local HTTP server on a real (ephemeral) port, then calls fetch() against it and reads a real JSON response back. Nothing here is mocked — it's a genuine round trip over an actual socket, just on localhost instead of the real network.",
            },
          ]}
        />
        <p>
          Notice the script ends with <code className="text-cyan-500 text-xs">server.close()</code>.
        </p>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "Why server.close() Is Required, Not Just Tidy",
              description:
                "A Node process only exits on its own once nothing is left keeping its event loop alive. A server that's still listening for connections counts as exactly that kind of thing.",
              example:
                "Confirmed directly: a copy of a demo like this one, without that line, was still running unexited 3+ seconds later, with no sign it would ever stop.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          fetch/Headers/FormData/structuredClone are now native Node globals, not polyfills — a direct, concrete point of
          overlap with existing frontend experience. server.close() is what lets a script like this one actually finish.
        </Callout>
      </>
    ),
    extra: <WebGlobalsDiagram />,
    demo: <WebStandardGlobalsTourRunner />,
    demoCommand: "node index.js",
    filePointer: {
      path: "examples/CoreModules/WebStandardGlobalsTour/index.js",
      note: "The exact script the demo above runs, unmodified — open it and read straight through, numbered comment by numbered comment.",
    },
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: node: built-ins (path, fs, process, events) are the foundation every higher-level
        Node/Express concept sits on — path for cross-platform-safe paths, fs for real file I/O, process for runtime info,
        EventEmitter as the pattern underneath streams and Express itself. Buffer is real raw bytes, not text. And Node now
        natively ships the same Web-standard globals already known from frontend work (fetch, Headers, FormData,
        structuredClone) — a genuine, concrete example of existing frontend background transferring directly to the backend
        side.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["node:path/node:fs/node:process/node:events", "Buffer for raw bytes", "fetch/Headers/FormData/structuredClone", "same globals, now on both sides of the request"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "The node: prefix (node:fs, node:path) makes a built-in import unambiguous versus an npm package of the same name — increasingly the recommended style.",
            "EventEmitter is the same pattern Node's own streams and Express itself are built on — understanding it explains a lot of Node's own API design, not just a standalone utility.",
            "Buffer exists because JS strings are Unicode text — real binary data (uploads, sockets) needs a real byte-level type, not a string.",
            "fetch/Headers/FormData/structuredClone are now native Node globals, not polyfills — a direct, concrete point of overlap with existing frontend experience.",
          ]}
        />
      </>
    ),
  },
];

export default function CoreModulesPage() {
  return (
    <StudyPage
      title="Core Modules"
      stageLabel="Stage A — Node.js & Backend Foundations"
      stageColor="blue"
      intro="fs, path, process, events, and Buffer are the real built-in foundation everything else in this project sits on top of — plus a genuinely direct bridge from frontend work: fetch, Headers, FormData, and structuredClone are the same Web-standard globals, now shipped natively in Node itself."
      sections={sections}
    />
  );
}
