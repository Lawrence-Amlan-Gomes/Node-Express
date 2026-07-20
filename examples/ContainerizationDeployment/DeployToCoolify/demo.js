// Proves the EXACT image that later gets deployed to the real Coolify
// server also builds and runs correctly right here, first — the same
// "verify locally before shipping anywhere" discipline as every other
// real infra decision in this project.
import { execSync } from "node:child_process";

const TAG = "node-express-learning-deploy-to-coolify";
const CONTAINER_NAME = "deploy-to-coolify-demo";
const PORT = 4092;

function run(command) {
  return execSync(command, { encoding: "utf-8", cwd: process.cwd() }).trim();
}

async function main() {
  console.log("Building the real image (the exact one Coolify builds too)...");
  run(`docker build -q -t ${TAG} .`);

  run(`docker rm -f ${CONTAINER_NAME} 2>/dev/null || true`);

  console.log("Running it as a real local container...");
  run(`docker run --rm -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${TAG}`);

  await new Promise((resolve) => setTimeout(resolve, 800));

  const rootRes = await fetch(`http://localhost:${PORT}/`);
  const rootBody = await rootRes.json();

  const healthRes = await fetch(`http://localhost:${PORT}/health`);
  const healthBody = await healthRes.json();

  run(`docker stop ${CONTAINER_NAME}`);

  console.log("\nGET / — real response from the real local container:");
  console.log(JSON.stringify({ status: rootRes.status, body: rootBody }, null, 2));

  console.log("\nGET /health — the same real endpoint a real host polls to know this container is alive:");
  console.log(JSON.stringify({ status: healthRes.status, body: healthBody }, null, 2));
}

main();
