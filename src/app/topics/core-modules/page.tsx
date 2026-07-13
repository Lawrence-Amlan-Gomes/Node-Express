import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import CoreModulesTourRunner from "@/example-runners/CoreModules/CoreModulesTourRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function WebGlobalsDiagram() {
  const rows: [string, string][] = [
    ["fetch", "Same fetch() from frontend work — Node ships it natively now, no node-fetch/axios needed for basic requests."],
    ["Headers", "The same Web-standard Headers object — used identically on both sides of a request."],
    ["FormData", "Real multipart-form-shaped data, without a form-data npm package."],
    ["structuredClone", "A real deep clone, built in — no JSON.parse(JSON.stringify(...)) hack needed (and it handles more types correctly)."],
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-blue-500 mb-2.5">Web-standard globals Node now ships natively — no import needed:</div>
      {rows.map(([name, detail]) => (
        <div className="pl-2 mb-2 text-body" key={name}>
          <span className="text-cyan-500">{name}</span>
          <span className="text-muted"> — </span>
          {detail}
        </div>
      ))}
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "The Core Modules That Make Node a Runtime",
    paragraphs: [
      "These are the built-in modules that don't need installing — they ship with Node itself, imported via the node: protocol prefix (node:path, node:fs, and so on), which makes it unambiguous that you're importing a built-in, not a same-named npm package. path handles file paths correctly across operating systems (no manual string concatenation with / or \\); fs reads and writes real files, synchronously or via Promises; process exposes the actual running process — its version, platform, environment variables, and arguments; events' EventEmitter is the same pattern Express and most of Node's own APIs (streams, servers) are built on internally.",
      "Buffer is Node's raw-bytes type — the thing that exists specifically because JavaScript strings are Unicode text, not raw binary, and a real backend regularly has to handle raw binary (file uploads, sockets, image data) where a string would lose or mangle information.",
    ],
    filePointer: {
      path: "examples/CoreModules/CoreModulesTour/index.js",
      note: "The exact script every demo below runs, unmodified — open it and read straight through, numbered comment by numbered comment.",
    },
  },
  {
    heading: "Web-Standard Globals Node Now Ships Natively",
    paragraphs: [
      "This is a real, direct bridge from frontend work: fetch, Headers, FormData, and structuredClone are the same Web Platform APIs used in a browser — Node now implements them natively as real globals, no import, no third-party package. This wasn't always true (older Node needed node-fetch or axios for this), which is worth knowing when reading older codebases or tutorials.",
      "The demo below proves fetch for real — the script starts an actual local HTTP server on a real (ephemeral) port, then calls fetch() against it and reads a real JSON response back. Nothing here is mocked; it's a genuine round trip over an actual socket, just on localhost instead of the network.",
      "Notice the script ends with server.close(). A Node process only exits on its own once nothing is left keeping its event loop alive, and a server that's still listening for connections counts as exactly that — leave it out, and the process just hangs forever waiting for a connection that's never coming (confirmed directly: a copy of a demo like this one without that line was still running, unexited, 3+ seconds later, with no sign it would ever stop). So server.close() here isn't cleanup for tidiness — it's the line that lets this script actually finish and print its output at all. You'll see this exact pattern again in every demo throughout this app that spins up a real server just to prove something and then needs to hand control back.",
    ],
    extra: <WebGlobalsDiagram />,
    demo: <CoreModulesTourRunner />,
    demoCommand: "node index.js",
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. node: built-ins (path, fs, process, events) are the foundation every higher-level Node/Express concept sits on — path for cross-platform-safe paths, fs for real file I/O, process for runtime info, EventEmitter as the pattern underneath streams and Express itself. Buffer is real raw bytes, not text. And Node now natively ships the same Web-standard globals already known from frontend work (fetch, Headers, FormData, structuredClone) — a genuine, concrete example of the existing frontend background transferring directly to the backend side.",
    ],
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
