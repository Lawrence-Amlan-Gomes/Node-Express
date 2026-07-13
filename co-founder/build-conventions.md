# Build Conventions

Owned by `skillCoFounderMentor.md`. **Read this before building or editing any topic page, example, or runner.** These rules exist because the sibling "Next Js" project (same user, different mentor instance) shows a repeating, confirmed pattern: any drift between what a demo claims to show and what it actually does gets caught, not glossed over. Assume the same scrutiny applies here.

## The shape of this app

This project has a real Next.js viewer app (`src/app/`, `src/components/`, `src/data/curriculum.ts`) that delivers the curriculum — Sidebar, Dashboard, RoadMap page, and one `page.tsx` per built topic via `StudyPage` — mirroring the sibling project's shell exactly (same component names/roles where the concept transfers directly: `GuideSection`, `FilePointer`, `ComparisonCard`, `FlowChain`, `CodeBlock`, `StatusBadge`). **The one deliberate departure:** the sibling's `BrowserFrame` (proving a UI demo by rendering it in mock browser chrome) doesn't fit here, since the subject matter is backend — there's no page to render for most topics. `TerminalFrame` (`src/components/TerminalFrame.tsx`) is the replacement: mock terminal chrome showing the real command that was run and its real captured output. A `StudySection.demoCommand` there is the equivalent of the sibling's `demoTabTitle`.

Each topic gets, once actually reached (build order is learner-driven, one topic at a time — never front-load a topic not yet started):

- `examples/<Topic>/<SubDemo>/` — a standalone, **real, runnable** mini-project (own `package.json`, and a real `.env` only where the example genuinely has something configurable — don't add a decorative one just for shape). Genuinely runnable on its own (`npm start` or equivalent), not a fragment that only makes sense glued into something bigger.
- `src/example-runners/<Topic>/<SubDemo>Runner.tsx` — what actually proves the example live inside the app. Two real patterns, matching the sibling project's own split:
  1. **Plain async Server Component that executes real code every render**, no client-interactivity needed — e.g. spawning the real example script/server and capturing real output (see "The Turbopack execFileSync gotcha" below), or importing and calling a real exported function directly. Zero faking; this is the default and should be preferred whenever the concept allows it.
  2. **A "use client" component with real local state**, only when something about the concept can't work executed straight inside this app's own render (needs its own real routing/params/thrown error that would conflict with this app's own). Rare for backend topics compared to the sibling's frontend ones — most backend concepts (event loop, middleware, routing, error handling) CAN be proven with a real, live, server-side execution instead of a rebuilt stand-in. Reach for this only when pattern 1 genuinely doesn't apply.

## The Turbopack execFileSync gotcha (confirmed 2026-07-13)

Spawning a real example process from a Server Component runner via `child_process.execFileSync("node", [somePathString])` **fails `next build`** with `Module not found ... server relative imports are not implemented yet` — Turbopack's build-time file tracer statically treats a literal/computed string in that array-argument position as a module specifier to resolve, regardless of whether the path is built with `path.join`, `__dirname`, `process.cwd()` concatenation, or even a bare relative filename. Confirmed directly across all of those variations — every one broke the build the same way.

**The fix that works:** use `child_process.execSync("node event-loop-order.js", { cwd: ..., encoding: "utf-8" })` — a single shell-command string plus a `cwd` option, not an array of path-shaped arguments. This sidesteps whatever heuristic Turbopack applies to `execFileSync`'s argument array. See `src/example-runners/NodeRuntimeFoundations/EventLoopOrderRunner.tsx` for the working reference implementation. Use this pattern for every future runner that needs to spawn a real process rather than rediscovering the same failure.

## The missing body text-color gotcha (confirmed 2026-07-13)

`src/app/globals.css` styled `body` with a font-family but never a default `color` — so any text node without an explicit Tailwind `text-*` class (title/body/sublabel/muted, or a semantic accent) fell back to the browser's default black, invisible against this app's black background. Caught in the `LibuvPhasesDiagram` on the `what-is-nodejs` page, where a raw `{i + 1}.` and ` — ` sat directly in a `<div>` with no color class. Fixed globally by adding `color: var(--color-body);` to the `body` rule — this is the actual root-cause fix, not just patching the one diagram. **When writing any new bespoke diagram, every text-bearing element still needs an explicit color class anyway** (don't rely on inheritance as the primary plan) — the body-level fix is a safety net, not a reason to skip explicit `text-body`/`text-muted`/accent classes on new markup.

## Non-negotiable rules

- **Never fabricate behavior.** If a topic makes a claim about how Node/Express/a library behaves (error propagation, middleware order, a status code, a header, an ordering guarantee), verify it by actually running the code first — don't assert from memory or training data. Library/runtime behavior changes across versions, and this project already found one genuinely surprising, verified-for-real gotcha in its first topic (setTimeout vs setImmediate ordering at the top level of a script is NOT guaranteed — see the `what-is-nodejs` topic page).
- **No fake stand-ins where the topic is genuinely about a real tool.** If the topic is about validation, use a real validator; if it's about a database, connect to a real one (can be local/throwaway, but real). Don't simulate what a real dependency would do.
- **Runner output must match the example it claims to demonstrate, exactly.** If the example prints/returns N things, the runner's shown output must show all N — no silently trimming, no adding anything that isn't really there.
- **Keep pinned-version/gotcha notes in `CLAUDE.md` up to date** if a dependency version or tooling behavior turns out to break something in this environment — don't silently work around it without recording why, the way the Turbopack gotcha above is now recorded.

## Verification discipline

Before writing prose that asserts "Express does X" or "Node does Y" as fact, actually run it and look at the real output first — including running it multiple times when a claim is about ordering/timing, since that's exactly the kind of claim that looks deterministic until you check (see the `what-is-nodejs` topic). Record confirmed gotchas here or in `CLAUDE.md` as they're found, not just in the moment they're discovered.
