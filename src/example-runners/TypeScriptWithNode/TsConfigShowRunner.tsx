import { execSync } from "node:child_process";

const cwd = process.cwd() + "/examples/TypeScriptWithNode/TypedBackendSetup";

// Plain async Server Component, no client interactivity needed — runs the
// real `tsc --showConfig` command every render, proving the tsconfig.json
// values described in this section are actually the ones tsc resolves and
// uses (including two options TypeScript adds automatically that aren't
// written in the file at all: allowImportingTsExtensions, moduleDetection).
export default async function TsConfigShowRunner() {
  const output = execSync("npx tsc --showConfig", {
    encoding: "utf-8",
    cwd,
  });

  return <>{output}</>;
}
