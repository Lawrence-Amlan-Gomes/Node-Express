import { execSync } from "node:child_process";

const cwd = process.cwd() + "/examples/TypeScriptWithNode/TypedBackendSetup";

function run(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8", cwd, stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string };
    return (e.stdout ?? "") + (e.stderr ?? "");
  }
}

// Plain async Server Component, no client interactivity needed — spawns both
// real commands on every render. First command's output is shown as the
// TerminalFrame's own prompt/output pair (demoCommand handles that); the
// second command gets its own "$ " line here, same as pasting two real
// commands into a real terminal one after another.
export default async function TypedDevRunner() {
  const native = run("node src/index.ts");
  const tsx = run("npx tsx src/index.ts");

  return (
    <>
      {native}
      {"\n$ npx tsx src/index.ts\n"}
      {tsx}
    </>
  );
}
