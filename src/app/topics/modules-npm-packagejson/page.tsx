import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import CjsEsmInteropRunner from "@/example-runners/ModulesNpmPackageJson/CjsEsmInteropRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md. Rewritten 2026-07-17 so
// every part carries its own plain-English caption (detail-rebuild pass).

function SemverDiagram() {
  const parts = [
    { number: "19", name: "major", detail: "Bumps here mean breaking changes. Old code might stop working." },
    { number: "2", name: "minor", detail: "Bumps here add new features. Old code keeps working." },
    { number: "7", name: "patch", detail: "Bumps here are bug fixes only. Nothing new, nothing breaks." },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-blue-500 text-sm font-semibold mb-3 font-mono">&quot;react&quot;: &quot;^19.2.7&quot;</div>
      <div className="flex flex-col gap-2">
        {parts.map((part) => (
          <div key={part.name} className="flex items-start gap-2.5">
            <span className="shrink-0 w-8 h-8 rounded-full border border-cyan-500 text-cyan-500 flex items-center justify-center font-mono text-xs">
              {part.number}
            </span>
            <div>
              <span className="font-mono text-sm font-semibold text-cyan-500">{part.name}</span>
              <div className="text-body text-xs leading-relaxed mt-0.5">{part.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
        <div className="text-xs leading-relaxed">
          <span className="text-yellow-500 font-mono font-semibold">^</span>{" "}
          <span className="text-body">
            allows minor and patch updates. Installs any 19.x.x. Never installs 20.0.0.
          </span>
        </div>
        <div className="text-xs leading-relaxed">
          <span className="text-yellow-500 font-mono font-semibold">~</span>{" "}
          <span className="text-body">allows patch updates only. Installs any 19.2.x. Never installs 19.3.0.</span>
        </div>
        <div className="text-xs leading-relaxed">
          <span className="text-yellow-500 font-mono font-semibold">(nothing)</span>{" "}
          <span className="text-body">an exact version with no symbol. Installs that exact build, every time.</span>
        </div>
      </div>
    </div>
  );
}

function ModuleSystemDecisionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">How Node picks a system for a plain .js file</div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 text-center">
        <span className="font-mono text-sm text-body">Node checks the nearest package.json&apos;s &quot;type&quot; field</span>
      </div>
      <div className="text-center text-sublabel text-xs py-1.5">↓</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">&quot;commonjs&quot; (or missing)</div>
          <div className="text-body text-xs leading-relaxed">Every .js file here is CommonJS — require() / module.exports.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">&quot;module&quot;</div>
          <div className="text-body text-xs leading-relaxed">Every .js file here is an ES Module — import / export.</div>
        </div>
      </div>
      <div className="text-center text-sublabel text-xs py-1.5">but this default can always be overridden, file by file:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">any file.cjs</div>
          <div className="text-body text-xs leading-relaxed">Always CommonJS, no matter what &quot;type&quot; says.</div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">any file.mjs</div>
          <div className="text-body text-xs leading-relaxed">Always an ES Module, no matter what &quot;type&quot; says.</div>
        </div>
      </div>
    </div>
  );
}

function RequireEsmDecisionDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">
        require(&quot;./some-file.mjs&quot;) on Node 22.12+ — what actually happens
      </div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 text-center">
        <span className="font-mono text-sm text-body">Does that .mjs file have a top-level await anywhere inside it?</span>
      </div>
      <div className="text-center text-sublabel text-xs py-1.5">↓</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">No</div>
          <div className="text-body text-xs leading-relaxed">
            require() loads it directly, synchronously. Works fine — this is the new part.
          </div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">Yes</div>
          <div className="text-body text-xs leading-relaxed">
            require() throws ERR_REQUIRE_ASYNC_MODULE. Use await import(...) instead — it always works.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "Two Real Module Systems, Not a Style Choice",
    body: (
      <>
        <p>
          Node shipped with its own module system, CommonJS, years before JavaScript itself had an official one. Later,
          JavaScript got its own real answer: ES Modules. Node now supports both for real. They are not just two different
          spellings of the same thing — they work differently underneath.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "CommonJS — Node's Original System",
              description: "Uses require() to bring in code, and module.exports to send code out. This has existed since Node's very first versions.",
              example: "const { multiply } = require(\"./math.cjs\");",
            },
            {
              label: "ES Modules — JavaScript's Own Official System",
              description: "Uses import and export keywords. This is the same system browsers use for JavaScript modules, not something Node invented.",
              example: "import { add } from \"./math.mjs\";",
            },
          ]}
        />
        <p>
          How does Node decide which system a plain .js file is using? It checks the nearest package.json file, and reads its{" "}
          <code className="text-cyan-500 text-xs">&quot;type&quot;</code> field.
        </p>
        <ConceptBreakdown
          accent="cyan"
          items={[
            {
              label: '"type": "commonjs" (or no "type" field at all)',
              description: "This is the default. Every plain .js file in that project is treated as CommonJS.",
            },
            {
              label: '"type": "module"',
              description: "Every plain .js file in that project is treated as an ES Module instead.",
            },
            {
              label: "The .cjs and .mjs File Extensions Always Win",
              description:
                "A file named math.cjs is always CommonJS, and a file named math.mjs is always an ES Module — no matter what the package.json \"type\" field says. This is exactly how this topic's own example forces both systems to exist side by side in one project, without a fight over the type field.",
            },
          ]}
        />
        <Callout title="The Bottom Line">
          CommonJS and ES Modules are two real, different systems living inside Node at the same time. package.json&apos;s
          &quot;type&quot; field picks the default for plain .js files — the .cjs and .mjs extensions can always override it,
          file by file.
        </Callout>
      </>
    ),
    extra: (
      <>
        <ModuleSystemDecisionDiagram />
        <ComparisonCard
          tone="caution"
          title="The real differences, not just the syntax"
          points={[
            "require() runs synchronously. You can call it anywhere — inside a function, inside an if, inside a loop.",
            "import is different. It is a static, hoisted declaration. It must sit at the top of the file. It can never be conditional.",
            "CommonJS gives you __dirname and __filename for free. ES Modules don't — you rebuild them yourself from import.meta.url.",
            "Only ES Modules can use top-level await — an await sitting outside any function, at the very top of the file. CommonJS cannot do this at all. See the live demo below for exactly where that line gets drawn.",
          ]}
        />
      </>
    ),
  },
  {
    heading: "The require()-Can-Now-Load-ESM Surprise (Node ≥22.12)",
    body: (
      <>
        <p>
          For years, one rule was absolute: calling require() on a real ES Module always threw an error. That rule is now only
          half true. This was confirmed directly on this machine (Node v22.22.3), by actually running the code, three times in a
          row, with the identical result every time.
        </p>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "No Top-Level Await: require() Now Works",
              description:
                "If the ESM file has no top-level await anywhere inside it, require() can load it directly, synchronously, right now. This only works on Node 22.12 and newer.",
            },
            {
              label: "Has Top-Level Await: require() Still Throws",
              description:
                "The moment that ESM file has a real top-level await, require() throws a different, more specific error: ERR_REQUIRE_ASYNC_MODULE. The reason is simple: require() is synchronous by design. It cannot pause and wait for anything.",
            },
            {
              label: "import() Always Works, No Matter What",
              description:
                "A dynamic import() call returns a real Promise, which you await. It works whether or not the file has top-level await. Lines 3 and 4 in the demo below show this exact contrast, both real, both actually run.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="purple">
          Plenty of tutorials and old answers online will confidently tell you require(esm) always throws. On Node 22.12 and
          newer, that is only conditionally true now — a genuinely current correction, not old textbook trivia.
        </Callout>
      </>
    ),
    extra: <RequireEsmDecisionDiagram />,
    demo: <CjsEsmInteropRunner />,
    demoCommand: "node main.js",
    filePointer: {
      path: "examples/ModulesNpmPackageJson/CjsEsmInterop/main.js",
      note: "The exact script the demo above runs, unmodified — open it and the three module files (math.cjs, math.mjs, async-tla.mjs) it pulls from directly.",
    },
  },
  {
    heading: "package.json, Scripts & Semver",
    body: (
      <>
        <p>
          package.json is the one file that turns a plain folder of JS files into a real npm project. This demo&apos;s own
          package.json (linked below) is real, working proof of everything explained here — open it side by side with this
          section.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "name / version",
              description: "Identify the project. Nothing runs differently because of these — they're just labels.",
            },
            {
              label: '"main"',
              description: "Says which file another project loads first if it installs this one as a dependency.",
            },
            {
              label: '"scripts"',
              description:
                "Named shell commands. Run any of them with npm run <name>. Two names are special-cased and don't need \"run\": npm start and npm test.",
              example: 'This demo\'s "start" script runs "node main.js" — try npm start in that folder yourself.',
            },
            {
              label: '"dependencies" / "devDependencies"',
              description: "List what the project needs installed to run (dependencies) or only to develop/test it (devDependencies).",
              example: 'This demo declares a real dependency: picocolors — the same tiny library actually coloring the output above.',
            },
          ]}
        />
        <p>
          A version number like <code className="text-cyan-500 text-xs">^1.1.1</code> in your dependencies is not one exact
          version. It is a RANGE. The symbol in front controls how far npm is allowed to upgrade the next time someone runs npm
          install. Getting this wrong is a real, common way &quot;it works on my machine&quot; bugs happen — and a real, common
          interview question.
        </p>
        <ConceptBreakdown
          accent="green"
          items={[
            {
              label: "package-lock.json Locks In the Exact Version",
              description:
                "Ranges like ^1.1.1 are flexible on purpose. package-lock.json is what removes that flexibility for everyone else: it records the EXACT resolved version — and every dependency's dependency too — from the last successful install.",
              example:
                "This demo's own package-lock.json (linked below) is the real file npm generated the moment picocolors actually got installed here — open it and see the exact resolved version and integrity hash, not just the \"^1.1.1\" range.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="green">
          package.json describes what your project ALLOWS to be installed, using flexible ranges. package-lock.json records
          exactly what WAS installed, as fixed versions — that&apos;s what makes a teammate&apos;s install, or a CI
          pipeline&apos;s install, match yours exactly.
        </Callout>
      </>
    ),
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
    body: (
      <p>
        Quick recap, in plain words: CommonJS (require/module.exports) and ES Modules (import/export) are two real systems.
        package.json&apos;s &quot;type&quot; field picks the default per project, and .cjs/.mjs extensions can always override
        it per file. On Node 22.12 and newer, require() can load a synchronous ESM file directly — but never one with
        top-level await, where only import() still works. package.json&apos;s scripts are the real automation surface. Semver
        ranges (^, ~) control what npm install is allowed to upgrade. package-lock.json pins the exact tree that actually gets
        installed.
      </p>
    ),
    extra: (
      <ComparisonCard
        tone="good"
        title="What to say in the interview"
        points={[
          "require() is synchronous. Since Node 22.12, it can load simple synchronous ESM directly — but never anything with top-level await, which needs import().",
          "package.json \"type\" sets the default per project. .cjs/.mjs extensions always override it, file by file.",
          "^1.2.3 allows minor and patch upgrades, never a major bump. ~1.2.3 allows patch upgrades only. package-lock.json is what actually pins the resolved tree for reproducible installs.",
          "npm scripts (\"scripts\" in package.json) are real shell commands. Run them with npm run <name> — start/test/install are specially-recognized bare commands.",
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
      intro="Two real module systems live inside Node at once — CommonJS and ES Modules. package.json decides which one a file uses, what its dependency versions actually resolve to, and what its automation scripts do. Includes a genuinely surprising, freshly-verified 2026 behavior change: require() can now load ESM directly, under specific conditions."
      sections={sections}
    />
  );
}
