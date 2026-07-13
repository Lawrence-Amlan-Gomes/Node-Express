import { execSync } from "node:child_process";

// Genuinely live: this is a plain async Server Component (no client
// interactivity needed, so no runner-side faking at all) that actually spawns
// `node` on the real example script on every render and captures its real
// stdout. Rerunning it (via TerminalFrame's rerun button -> router.refresh())
// re-executes the real process again — this is why setTimeout vs setImmediate
// occasionally flips order between renders, not a scripted illusion of it.
//
// Confirmed directly (next build failed, then passed, on each attempt):
// execFileSync("node", [anyLiteralFilename]) fails Turbopack's production
// build with "server relative imports are not implemented yet" — it
// statically treats a literal string in that array-argument position as a
// module specifier to resolve, regardless of path.join vs concatenation vs a
// bare filename. execSync("node event-loop-order.js", { cwd }) — a single
// shell-command string, not an array of path-shaped args — sidesteps that
// heuristic entirely. See co-founder/build-conventions.md for the standing
// rule this became.
export default async function EventLoopOrderRunner() {
  const output = execSync("node event-loop-order.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/NodeRuntimeFoundations/EventLoopOrder",
  });

  return <>{output}</>;
}
