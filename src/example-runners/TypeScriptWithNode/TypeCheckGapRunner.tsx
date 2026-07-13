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

// Real proof that running TypeScript (native strip-types) is NOT the same as
// type-checking it: the first command executes a file with a genuine type
// error and produces a real, wrong-but-running result; the second command is
// the actual, separate step (tsc, pointed at an isolated tsconfig so this
// permanent, deliberate error never blocks this example's own build/typecheck
// scripts) that catches it for real.
export default async function TypeCheckGapRunner() {
  const ran = run("node src/type-error-demo.ts");
  const checked = run("npx tsc -p tsconfig.errordemo.json");

  return (
    <>
      {ran}
      {"\n$ npx tsc -p tsconfig.errordemo.json\n"}
      {checked || "(no output — tsc exited 0, meaning no type error was found)"}
    </>
  );
}
