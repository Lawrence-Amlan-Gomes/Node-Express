import StudyPage, { type StudySection } from "@/components/StudyPage";
import ComparisonCard from "@/components/ComparisonCard";
import FlowChain from "@/components/FlowChain";
import TypedDevRunner from "@/example-runners/TypeScriptWithNode/TypedDevRunner";
import TypeCheckGapRunner from "@/example-runners/TypeScriptWithNode/TypeCheckGapRunner";
import EnumSupportRunner from "@/example-runners/TypeScriptWithNode/EnumSupportRunner";

// Bespoke, page-local diagram — per the standing rule in
// co-founder/build-conventions.md.

function TsConfigDiagram() {
  const options: [string, string][] = [
    ["module / moduleResolution", "\"nodenext\" — matches Node's own real ESM/CJS resolution rules, not a bundler's looser ones"],
    ["strict", "true — the actual safety net; without it most of TypeScript's real value is opt-in and easy to skip"],
    ["rewriteRelativeImportExtensions", "true — lets you write import \"./math.ts\" (Node's own resolver requires the real extension) while tsc still rewrites it to .js in the compiled output"],
    ["rootDir / outDir", "\"src\" / \"dist\" — keeps source and compiled output physically separate, never mixed in one folder"],
  ];
  return (
    <div className="rounded-card border border-dashed border-blue-500 bg-surface p-4 my-4 font-mono text-xs leading-relaxed">
      <div className="text-blue-500 mb-2.5">tsconfig.json — the options that actually matter for a backend:</div>
      {options.map(([key, detail]) => (
        <div className="pl-2 mb-2 text-body" key={key}>
          <span className="text-cyan-500">{key}</span>
          <span className="text-muted"> — </span>
          {detail}
        </div>
      ))}
    </div>
  );
}

const sections: StudySection[] = [
  {
    heading: "A Typed Project Layout & tsconfig for a Backend",
    paragraphs: [
      "A backend TS project is a real npm project (package.json) plus one extra file, tsconfig.json, that tells the TypeScript compiler how to check and compile your code. This demo's own tsconfig.json is real, working evidence — src/ holds the actual .ts source, dist/ holds tsc's compiled output, and nothing else lives in either folder.",
      "One genuinely easy-to-miss detail: Node's own module resolution (module: \"nodenext\") requires RELATIVE imports to include the real file extension — import { add } from \"./math.ts\", not \"./math\". That's Node's rule, not TypeScript's, and it trips people coming from bundler-based setups (Next.js, Vite) where extensionless imports just work. tsc historically refused to let you write a literal .ts extension at all, since it couldn't rewrite it — rewriteRelativeImportExtensions: true (this demo's tsconfig.json has it) is the real, current fix: write the honest .ts extension everywhere, and tsc rewrites it to .js only in the files it actually emits.",
    ],
    extra: <TsConfigDiagram />,
    filePointers: [
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/tsconfig.json", note: "The real tsconfig driving every command in this topic." },
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/src/math.ts", note: "A small typed module — an interface plus a typed function — imported by every other file in this demo." },
    ],
  },
  {
    heading: "Two Real Zero-Build Ways to Run TypeScript",
    paragraphs: [
      "Node itself can now run a .ts file directly — no build step, no extra dependency — by stripping type annotations at load time. This is genuinely native as of Node 22.6+, confirmed here with zero flags on this machine's Node v22.22.3. tsx is the other real, extremely common option: a real installed devDependency (esbuild under the hood) that does the same job, historically with broader syntax support.",
      "Both commands below run the exact same typed file (src/index.ts, which imports math.ts) and produce identical output — proof neither one is doing anything fake or different from the other for straightforward, everyday TS code.",
    ],
    demo: <TypedDevRunner />,
    demoCommand: "node src/index.ts",
    filePointer: {
      path: "examples/TypeScriptWithNode/TypedBackendSetup/src/index.ts",
      note: "The exact typed entry file both commands above run, unmodified.",
    },
  },
  {
    heading: "The Real Gap: Type-Stripping Is Not Type-Checking",
    paragraphs: [
      "This is the actual, interview-relevant catch behind both tools above: stripping/transpiling types is NOT the same as checking them. Neither native node nor tsx reads your types for correctness — they just delete the annotations and run whatever's left as plain JS. The demo below runs a file with a genuine, unsuppressed type error (passing two strings to a function typed to take two numbers) directly with node — it runs anyway, silently doing string concatenation instead of addition, and prints a wrong-but-plausible result.",
      "tsc --noEmit is the actual, separate step that catches this — a real type-checking pass with no code execution at all. This demo runs it against an isolated tsconfig (tsconfig.errordemo.json) specifically so this permanent, deliberate error never blocks this example's own clean build/typecheck scripts — see that file for exactly how it's isolated.",
      "The real production implication: a fast dev loop (native strip or tsx) trades away type safety for speed on purpose. That's a legitimate, common choice — but it means tsc --noEmit (or equivalent, in an IDE or CI) has to run SEPARATELY as the actual safety net. Skipping it isn't a shortcut, it's turning off type-checking entirely.",
    ],
    demo: <TypeCheckGapRunner />,
    demoCommand: "node src/type-error-demo.ts",
    filePointers: [
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/src/type-error-demo.ts", note: "The real, genuinely wrong (unsuppressed) call — add(\"2\", \"3\") against a function typed for two numbers." },
      { path: "examples/TypeScriptWithNode/TypedBackendSetup/tsconfig.errordemo.json", note: "The isolated config used only to type-check this one deliberately-broken file, kept out of the main build." },
    ],
  },
  {
    heading: "tsc for Production: a Real Compile Step",
    paragraphs: [
      "For an actual production build, the compile step is real tsc, run without --noEmit — it writes real .js files to dist/ (this demo's own dist/index.js and dist/math.js are exactly what got emitted, confirmed by running it directly), and — this is the part rewriteRelativeImportExtensions was for — the .ts extension in the source import gets rewritten to a real .js extension in the compiled file, since Node can't resolve a .ts extension in already-compiled JS.",
      "One more real gotcha worth knowing: by default, tsc still WRITES its output files even when a type error exists elsewhere in the project (it only refuses to emit if you explicitly set noEmitOnError: true) — it just exits with a non-zero status code. That's exactly why a CI pipeline (or this project's own skillGit.md flow) has to actually check the exit code of tsc/tsc --noEmit, not just whether dist/ got created.",
      "One more real, current limitation worth knowing going in: native strip-types mode can't safely erase every TypeScript construct — a real enum throws a genuine SyntaxError under plain node (confirmed below), needing --experimental-transform-types to work. tsx handles the same enum with zero extra flags, since esbuild does a real syntax transform, not just stripping.",
    ],
    demo: <EnumSupportRunner />,
    demoCommand: "node src/enum-demo.ts",
    filePointer: {
      path: "examples/TypeScriptWithNode/TypedBackendSetup/src/enum-demo.ts",
      note: "A real TypeScript enum — the exact construct strip-only mode can't handle without the extra flag.",
    },
  },
  {
    heading: "Interview Angle",
    paragraphs: [
      "Quick recap. A real backend TS setup is package.json + tsconfig.json (module/moduleResolution: nodenext, strict, rewriteRelativeImportExtensions for the explicit .ts-extension requirement Node's own resolver imposes). For dev, native node (zero deps, Node 22.6+) or tsx (broader syntax support, e.g. enums) both run TS directly with zero build step — but neither one type-checks; that's a real, separate job for tsc --noEmit. For prod, tsc actually compiles to real .js, rewriting extensions correctly, but still emits output on error unless noEmitOnError is set, so CI has to check the real exit code.",
    ],
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
