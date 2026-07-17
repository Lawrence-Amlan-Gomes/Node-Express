import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import ConceptBreakdown from "@/components/ConceptBreakdown";
import Callout from "@/components/Callout";
import TsConfigShowRunner from "@/example-runners/TypeScriptWithNode/TsConfigShowRunner";
import TypedDevRunner from "@/example-runners/TypeScriptWithNode/TypedDevRunner";
import TypeCheckGapRunner from "@/example-runners/TypeScriptWithNode/TypeCheckGapRunner";
import EnumSupportRunner from "@/example-runners/TypeScriptWithNode/EnumSupportRunner";

// Bespoke, page-local diagrams — one per non-Interview-Angle section, per the
// standing rule in co-founder/build-conventions.md (including the "every
// section needs its OWN diagram, a demo/ComparisonCard doesn't count"
// addition confirmed 2026-07-17). Rewritten 2026-07-17 so every part carries
// its own plain-English caption.

function TsConfigDiagram() {
  const options: { key: string; detail: string }[] = [
    { key: "module / moduleResolution", detail: '"nodenext" — matches how Node itself resolves imports for real, not a looser bundler rule.' },
    { key: "strict", detail: "true — the actual safety net. Without it, most of TypeScript's real value becomes optional." },
    {
      key: "rewriteRelativeImportExtensions",
      detail: 'true — lets you write import "./math.ts" (Node\'s own resolver requires the real extension) while tsc still rewrites it to .js in the compiled output.',
    },
    { key: "rootDir / outDir", detail: '"src" / "dist" — keeps your source files and tsc\'s compiled output physically separate, never mixed in one folder.' },
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">tsconfig.json — the options that matter most for a backend</div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <div key={option.key} className="rounded-card border border-border bg-surface-raised px-3 py-2">
            <div className="font-mono text-sm font-semibold text-cyan-500">{option.key}</div>
            <div className="text-body text-xs leading-relaxed mt-0.5">{option.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZeroBuildComparisonDiagram() {
  return (
    <div className="rounded-card border border-dashed border-green-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Two ways to run src/index.ts directly, no build step</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-cyan-500 bg-cyan-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-cyan-500 font-semibold mb-1">node src/index.ts</div>
          <div className="text-body text-xs leading-relaxed">
            Native Node. Built in since Node 22.6 — zero extra dependency. Deletes the type annotations and runs the rest.
          </div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">npx tsx src/index.ts</div>
          <div className="text-body text-xs leading-relaxed">
            tsx — a real installed devDependency (esbuild underneath). Historically handles more TypeScript syntax than native
            stripping.
          </div>
        </div>
      </div>
      <div className="text-center text-sublabel text-xs py-1.5">↓</div>
      <div className="rounded-card border border-border bg-surface-raised px-3 py-2 text-center">
        <span className="text-body text-xs">Same real output from both — proof neither one is faking anything.</span>
      </div>
    </div>
  );
}

function StripVsCheckDiagram() {
  return (
    <div className="rounded-card border border-dashed border-yellow-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">Same file, two different tools, two different jobs</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-red-500 font-semibold mb-1">node / tsx (type-stripping)</div>
          <div className="text-body text-xs leading-relaxed">
            Only deletes the type annotations. Never reads them for correctness. Runs the file anyway, even with a real type
            error inside — the wrong result just gets printed.
          </div>
        </div>
        <div className="rounded-card border border-green-500 bg-green-500/3 px-3 py-2.5">
          <div className="font-mono text-xs text-green-500 font-semibold mb-1">tsc --noEmit</div>
          <div className="text-body text-xs leading-relaxed">
            A real type-checking pass. No code ever runs. Catches the real error and exits with a non-zero status code.
          </div>
        </div>
      </div>
    </div>
  );
}

function CompileFlowDiagram() {
  return (
    <div className="rounded-card border border-dashed border-purple-500 bg-surface p-4 my-4">
      <div className="text-xs uppercase tracking-wide text-sublabel mb-3">npx tsc (no --noEmit) — a real compile step</div>
      <div className="flex items-center gap-3 flex-wrap justify-center mb-3">
        <span className="font-mono text-xs bg-surface-raised border border-border rounded-md px-2.5 py-1.5 text-body">
          src/math.ts <span className="text-sublabel">— import &quot;./math.ts&quot;</span>
        </span>
        <span className="text-sublabel">→ rewritten to →</span>
        <span className="font-mono text-xs bg-green-500/3 border border-green-500 rounded-md px-2.5 py-1.5 text-green-500">
          dist/math.js <span className="text-sublabel">— import &quot;./math.js&quot;</span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="rounded-card border border-yellow-500 bg-yellow-500/3 px-3 py-2.5">
          <div className="text-yellow-500 text-xs font-mono font-semibold mb-1">Emits by default, even on error</div>
          <div className="text-body text-xs leading-relaxed">
            tsc still writes files to dist/ even when a type error exists elsewhere in the project. It just exits non-zero. Add
            noEmitOnError: true to actually block writing.
          </div>
        </div>
        <div className="rounded-card border border-red-500 bg-red-500/3 px-3 py-2.5">
          <div className="text-red-500 text-xs font-mono font-semibold mb-1">A real enum needs an extra flag</div>
          <div className="text-body text-xs leading-relaxed">
            Native strip-only mode cannot safely erase a real TypeScript enum — plain node throws a real SyntaxError.
            --experimental-transform-types fixes it. tsx handles the same enum with zero extra flags.
          </div>
        </div>
      </div>
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "A Typed Project Layout & tsconfig for a Backend",
    body: (
      <>
        <p>
          A backend TypeScript project is a real npm project (package.json) plus one extra file: tsconfig.json. This one extra
          file tells the TypeScript compiler how to check your code, and how to compile it. This demo&apos;s own tsconfig.json
          (linked below) is real, working proof — src/ holds the real .ts source, dist/ holds tsc&apos;s real compiled output,
          nothing else lives in either folder.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "Node's Resolver Needs the Real File Extension",
              description:
                'Node\'s own module resolution ("module": "nodenext") requires relative imports to include the real file extension. This is Node\'s own rule, not TypeScript\'s.',
              example: 'import { add } from "./math.ts" — not "./math". This trips people coming from Next.js or Vite, where extensionless imports just work.',
            },
            {
              label: "tsc Used to Refuse a Literal .ts Extension",
              description:
                "Older tsc versions would not let you write a real .ts extension at all, since it had no way to rewrite it.",
            },
            {
              label: "rewriteRelativeImportExtensions Is the Real Fix",
              description:
                'This demo\'s tsconfig.json sets rewriteRelativeImportExtensions: true. Write the honest .ts extension everywhere in your source — tsc rewrites it to .js only in the files it actually compiles and emits.',
            },
          ]}
        />
        <Callout title="The Bottom Line">
          A real backend tsconfig.json isn&apos;t decoration — every option in the diagram below is doing real work, and getting
          module/moduleResolution wrong is one of the most common real setup mistakes.
        </Callout>
      </>
    ),
    extra: <TsConfigDiagram />,
    demo: <TsConfigShowRunner />,
    demoCommand: "npx tsc --showConfig",
    filePointers: [
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/tsconfig.json", note: "The real tsconfig driving every command in this topic." },
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/src/math.ts", note: "A small typed module — an interface plus a typed function — imported by every other file in this demo." },
    ],
  },
  {
    heading: "Two Real Zero-Build Ways to Run TypeScript",
    body: (
      <>
        <p>
          Node itself can now run a .ts file directly. No build step, no extra dependency — it strips the type annotations at
          load time and runs what&apos;s left. This is genuinely native as of Node 22.6, confirmed here with zero extra flags,
          on this machine&apos;s Node v22.22.3.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "node src/index.ts — Native, Built In",
              description: "Zero extra dependency. Works on any Node 22.6+ install, out of the box.",
            },
            {
              label: "npx tsx src/index.ts — a Real, Extremely Common devDependency",
              description: "Uses esbuild under the hood to do the same job. Historically handles a broader range of TypeScript syntax.",
            },
          ]}
        />
        <p>
          Both commands below run the exact same typed file (src/index.ts, which imports math.ts) and produce identical output.
          That&apos;s real proof neither tool is doing anything fake, or different from the other, for straightforward TS code.
        </p>
      </>
    ),
    extra: <ZeroBuildComparisonDiagram />,
    demo: <TypedDevRunner />,
    demoCommand: "node src/index.ts",
    filePointer: {
      path: "examples/TypeScriptWithNode/TypedBackendSetup/src/index.ts",
      note: "The exact typed entry file both commands above run, unmodified.",
    },
  },
  {
    heading: "The Real Gap: Type-Stripping Is Not Type-Checking",
    body: (
      <>
        <p>This is the actual, interview-relevant catch behind both tools from the section above.</p>
        <ConceptBreakdown
          accent="yellow"
          items={[
            {
              label: "Neither Tool Reads Your Types for Correctness",
              description:
                "Native node and tsx both just delete the type annotations and run whatever plain JS is left. Neither one ever checks whether your types actually match.",
            },
            {
              label: "The Demo Below Proves It",
              description:
                'It runs a file with a genuine, unsuppressed type error — passing two strings to a function typed to take two numbers — directly with node. It runs anyway, silently doing string concatenation instead of addition, and prints a wrong-but-plausible result.',
            },
            {
              label: "tsc --noEmit Is the Actual, Separate Check",
              description:
                "A real type-checking pass, with no code execution at all. This demo runs it against an isolated tsconfig (tsconfig.errordemo.json), specifically so this one permanent, deliberate error never blocks this example's own clean build/typecheck scripts.",
            },
          ]}
        />
        <Callout title="The Bottom Line" accent="yellow">
          A fast dev loop (native strip or tsx) trades away type safety for speed, on purpose — a real, legitimate choice. But it
          means tsc --noEmit (or the same check inside your IDE or CI) has to run SEPARATELY, as the real safety net. Skipping it
          isn&apos;t a shortcut — it&apos;s turning type-checking off entirely.
        </Callout>
      </>
    ),
    extra: <StripVsCheckDiagram />,
    demo: <TypeCheckGapRunner />,
    demoCommand: "node src/type-error-demo.ts",
    filePointers: [
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/src/type-error-demo.ts", note: "The real, genuinely wrong (unsuppressed) call — add(\"2\", \"3\") against a function typed for two numbers." },
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/tsconfig.errordemo.json", note: "The isolated config used only to type-check this one deliberately-broken file, kept out of the main build." },
    ],
  },
  {
    heading: "tsc for Production: a Real Compile Step",
    body: (
      <>
        <p>
          For an actual production build, the real compile step is tsc, run WITHOUT --noEmit. It writes real .js files to
          dist/ — this demo&apos;s own dist/index.js and dist/math.js are exactly what got emitted, confirmed by running it
          directly.
        </p>
        <ConceptBreakdown
          items={[
            {
              label: "The .ts Extension Gets Rewritten to .js",
              description:
                "This is exactly what rewriteRelativeImportExtensions was for: Node can't resolve a .ts extension inside already-compiled JS, so tsc rewrites every relative import extension as it emits the file.",
            },
            {
              label: "tsc Still Writes Output Even on a Type Error",
              description:
                "By default, tsc writes its output files even when a type error exists elsewhere in the project. It only refuses to emit if you explicitly set noEmitOnError: true — otherwise it just exits with a non-zero status code.",
              example: "This is exactly why a CI pipeline has to actually check tsc's exit code, not just whether dist/ got created.",
            },
            {
              label: "Native Strip Mode Can't Safely Handle a Real Enum",
              description:
                "A real TypeScript enum throws a genuine SyntaxError under plain node — confirmed in the demo below. It needs --experimental-transform-types to work. tsx handles the same enum with zero extra flags, since esbuild does a real syntax transform, not just stripping.",
            },
          ]}
        />
      </>
    ),
    extra: <CompileFlowDiagram />,
    demo: <EnumSupportRunner />,
    demoCommand: "node src/enum-demo.ts",
    filePointer: {
      path: "examples/TypeScriptWithNode/TypedBackendSetup/src/enum-demo.ts",
      note: "A real TypeScript enum — the exact construct strip-only mode can't handle without the extra flag.",
    },
  },
  {
    heading: "Interview Angle",
    body: (
      <p>
        Quick recap, in plain words: a real backend TS setup is package.json + tsconfig.json, with module/moduleResolution set
        to nodenext, strict turned on, and rewriteRelativeImportExtensions for the explicit .ts-extension rule Node&apos;s own
        resolver imposes. For dev, native node (zero deps, Node 22.6+) or tsx (broader syntax support, e.g. enums) both run TS
        directly with zero build step — but neither one type-checks. That&apos;s a real, separate job for tsc --noEmit. For
        prod, tsc actually compiles to real .js, rewriting extensions correctly, but still emits output on error unless
        noEmitOnError is set — so CI has to check the real exit code.
      </p>
    ),
    extra: (
      <>
        <FlowChain steps={["dev: node/tsx runs .ts directly", "tsc --noEmit catches real type errors", "tsc compiles to dist/", "node dist/index.js runs the real prod build"]} />
        <ComparisonCard
          tone="good"
          title="What to say in the interview"
          points={[
            "Type-stripping (native Node or tsx) is fast because it skips type-checking entirely — it's not a lesser form of type-checking, it's none at all.",
            "tsc --noEmit is the actual type-checking step, and it's what a real CI pipeline gates on — not just \"the build ran.\"",
            "tsc emits output by default even when a type error exists elsewhere in the project — noEmitOnError: true is what makes a type error actually block the build.",
            "Node's own module resolution (nodenext) requires explicit relative-import extensions (./math.ts) — rewriteRelativeImportExtensions is what lets tsc still compile that to the correct .js reference.",
          ]}
        />
      </>
    ),
  },
];

export default function TypeScriptWithNodePage() {
  return (
    <StudyPage
      title="TypeScript with Node.js"
      stageLabel="Stage A — Node.js & Backend Foundations"
      stageColor="blue"
      intro="TypeScript is table-stakes for a 2026 backend role, not optional polish. This topic covers a real tsconfig for a backend (module: nodenext), the two real zero-build ways to run TS directly (native Node type-stripping vs tsx), the genuine gap between stripping types and checking them, and what tsc actually does — and doesn't guarantee — for a real production build."
      sections={sections}
    />
  );
}
