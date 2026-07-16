import { execSync } from "node:child_process";

// Plain async Server Component, no client interactivity needed — runs the
// real demo.js against the already-migrated remote Postgres table on every render.
export default async function PrismaMigrateWorkflowRunner() {
  const output = execSync("node demo.js", {
    encoding: "utf-8",
    cwd: process.cwd() + "/examples/MigrationsSchemaDesign/PrismaMigrateWorkflow",
  });

  return <>{output}</>;
}
