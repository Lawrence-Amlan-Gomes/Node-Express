import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import CjsEsmInteropRunner from "@/example-runners/ModulesNpmPackageJson/CjsEsmInteropRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md.

function SemverDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-blue-500 mb-2.5">&quot;react&quot;: &quot;^19.2.7&quot; — three numbers, three different promises:</div>
      <div className="flex gap-4 mb-2">
        <span className="text-cyan-500">19</span>
        <span className="text-body">major — breaking changes allowed</span>
      </div>
      <div className="flex gap-4 mb-2">
        <span className="text-cyan-500">2</span>
        <span className="text-body">minor — new features, no breaking changes</span>
      </div>
      <div className="flex gap-4 mb-2">
        <span className="text-cyan-500">7</span>
        <span className="text-body">patch — bug fixes only</span>
      </div>
      <div className="mt-2 text-muted">
        <span className="text-yellow-500">^</span> allows minor + patch bumps (installs latest 19.x.x, never 20.0.0) —{" "}
        <span className="text-yellow-500">~</span> allows patch bumps only (installs latest 19.2.x, never 19.3.0) — an
        exact version string with no prefix pins that build precisely.
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Two Real Module Systems, Not a Style Choice",
    paragraphs: [
      "Node shipped with CommonJS (require/module.exports) years before JavaScript itself had a standard module system. ES Modules (import/export) is the language's own official answer, and Node now supports both for real — but they're genuinely different systems under the hood, not just different syntax for the same thing.",
      "How Node decides which system a given .js file uses: check the nearest package.json's \"type\" field. \"type\": \"commonjs\" (or no type field at all — this is the default) means .js files are CommonJS. \"type\": \"module\" means .js files are ES Modules. The .cjs and .mjs extensions override that field explicitly, file by file, regardless of what \"type\" says — which is exactly how this topic's own example forces both systems to exist side by side in one project without fighting the type field.",
    ],
    extra: (
      <ComparisonCard
        tone="caution"
        title="The real differences, not just the syntax"
        points={[
          "CommonJS require() is synchronous — it can appear anywhere in a function, conditionally, in a loop. import is a static, hoisted declaration — always at the top of the file, never conditional.",
          "CommonJS has module-scoped __dirname/__filename built in. ES Modules don't — you rebuild them from import.meta.url when needed.",
          "Only ES Modules can use top-level await (an await outside any function, at the top of the file). CommonJS cannot, at all — see the live demo below for exactly where that line gets drawn.",
        ]}
      />
    ),
  },
  {
    heading: "The require()-Can-Now-Load-ESM Surprise (Node ≥22.12)",
    paragraphs: [
      "The old, widely-known rule was absolute: require() of a real ES Module always throws ERR_REQUIRE_ESM. That rule is now only half true. Confirmed directly on this machine (Node v22.22.3, re-run 3 times, identical result every time): require() of a genuine .mjs file now WORKS synchronously, as long as that ESM file has no top-level await anywhere in its own module graph.",
      "The moment that same ESM file has a real top-level await, require() throws a different, more specific error — ERR_REQUIRE_ASYNC_MODULE — because require() is synchronous by contract and can't pause to await anything. dynamic import() (which returns a real Promise you await) is what still works unconditionally, top-level await or not. Line 3 and line 4 in the demo below are that exact contrast, both real, both just run.",
      "Why this matters for real work: plenty of still-current tutorials, Stack Overflow answers, and even some teammates will confidently tell you require(esm) always throws. On Node 22.12+ that's now only conditionally true — a genuinely 2026-relevant correction, not textbook trivia.",
    ],
    demo: <CjsEsmInteropRunner />,
    demoCommand: "node main.js",
    filePointer: {
      path: "examples/ModulesNpmPackageJson/CjsEsmInterop/main.js",
      note: "The exact script the demo above runs, unmodified — open it and the three module files (math.cjs, math.mjs, async-tla.mjs) it pulls from directly.",
    },
  },
  {
    heading: "package.json, Scripts & Semver",
    paragraphs: [
      "package.json is the one file that makes a folder of JS files an actual npm project: name/version identify it, \"main\" says which file loading the package resolves to, \"scripts\" are named shell commands run via npm run <name> (or bare npm start/npm test, which are special-cased), and \"dependencies\"/\"devDependencies\" declare what the project needs installed. This exact demo's own package.json is real, working evidence of all four: a \"start\" script that runs main.js, and a real dependency (picocolors — the same tiny library actually coloring the output above) declared with a semver range.",
      "Version numbers in dependencies aren't exact by default — they're semver RANGES, and the prefix character controls how much npm is allowed to update on the next install. picocolors is pinned here as \"^1.1.1\" — this is a real, common interview question, because getting the range wrong is how \"it works on my machine\" bugs happen.",
      "package-lock.json is what makes an install reproducible despite those ranges: it records the EXACT resolved version (and the exact version of every transitive dependency) from the last successful install, so a teammate's npm install — or a CI pipeline's — gets identical versions, not just versions matching the range. This demo's own package-lock.json below is the real file npm generated the moment picocolors was actually installed here — open it and you'll see the exact resolved version and integrity hash, not just the \"^1.1.1\" range from package.json.",
    ],
    extra: (
      <>
        <SemverDiagram />
        <FlowChain steps={["npm install", "resolve every range in package.json", "write exact versions to package-lock.json", "future installs reuse those exact versions"]} />
      </>
    ),
    filePointers: [
      { path: "examples/ModulesNpmPackageJson/CjsEsmInterop/package.json", note: "This demo's own real package.json — the \"start\" script, and picocolors declared as a real dependency with a semver range." },
      { path: "examples/ModulesNpmPackageJson/CjsEsmInterop/package-lock.json", note: "Auto-generated by a real npm install run in this exact folder — the exact resolved version + integrity hash the ^1.1.1 range resolved to." },
    ],
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. CommonJS (require/module.exports) and ES Modules (import/export) are two real systems, chosen per-file via package.json's \"type\" field (or overridden per-file via .cjs/.mjs). As of Node 22.12+, require() can load a synchronous ESM file directly — but still can't touch one with top-level await, where only import() (or a dynamic import()) works. package.json's scripts are the real automation surface; semver ranges (^, ~) control what npm install is allowed to upgrade; package-lock.json pins the exact tree that actually gets installed.",
    ],
    extra: (
      <ComparisonCard
        tone="good"
        title="What to say in the interview"
        points={[
          "require() is synchronous and (since Node 22.12) can load simple synchronous ESM directly — but never anything with top-level await, which needs import().",
          "package.json \"type\" sets the default per project; .cjs/.mjs extensions always override it file-by-file.",
          "^1.2.3 allows minor+patch upgrades (never a major bump); ~1.2.3 allows patch only — package-lock.json is what actually pins the resolved tree for reproducible installs.",
          "npm scripts (\"scripts\" in package.json) are real shell commands — npm run <name>, with start/test/install as specially-recognized bare commands.",
        ]}
      />
    ),
  },
];

export default function ModulesNpmPackageJsonPage() {
  return (
    <StudyPage
      title="Modules, npm & package.json"
      stageLabel="Stage A — Node.js & Backend Foundations"
      stageColor="blue"
      intro="Two real module systems live in Node at once — CommonJS and ES Modules — and package.json is what decides which one a given file uses, what its dependency versions actually resolve to, and what its automation scripts do. Includes a genuinely surprising, freshly-verified 2026 behavior change: require() can now load ESM directly, under specific conditions."
      sections={sections}
    />
  );
}
