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

// Real proof of a genuine native-strip-types limitation: a real TS enum
// throws under plain `node` (strip-only mode can't safely erase enum syntax),
// works once --experimental-transform-types is added, and works under tsx
// (esbuild-based) with zero extra flags either way.
export default async function EnumSupportRunner() {
  const stripOnly = run("node src/enum-demo.ts");
  const transform = run("node --experimental-transform-types src/enum-demo.ts");
  const tsx = run("npx tsx src/enum-demo.ts");

  return (
    <>
      {stripOnly}
      {"\n$ node --experimental-transform-types src/enum-demo.ts\n"}
      {transform}
      {"\n$ npx tsx src/enum-demo.ts\n"}
      {tsx}
    </>
  );
}
