// This script never imports server.js or express directly — its only
// job is to drive REAL Docker commands and REAL HTTP calls, exactly the
// same "orchestrate from the outside" role demo.js plays in every other
// topic in this project (see co-founder/build-conventions.md).
import { execSync } from "node:child_process";

const MULTISTAGE_TAG = "node-express-learning-dockerfile-multistage";
const SINGLESTAGE_TAG = "node-express-learning-dockerfile-singlestage";
const CONTAINER_NAME = "dockerfile-basics-demo";
const PORT = 4090;

// Runs a real shell command and returns its real trimmed output.
// "2>&1" merges Docker's build progress (written to stderr) into the
// same captured stream, matching the pattern already confirmed necessary
// for Jest elsewhere in this project.
function run(command) {
  return execSync(command, { encoding: "utf-8", cwd: process.cwd() }).trim();
}

async function main() {
  // Build the real, production-worthy multi-stage image.
  console.log("Building the multi-stage image (Dockerfile)...");
  run(`docker build -q -f Dockerfile -t ${MULTISTAGE_TAG} .`);

  // Build the real, deliberately naive single-stage image, for comparison.
  console.log("Building the single-stage image (Dockerfile.singlestage)...");
  run(`docker build -q -f Dockerfile.singlestage -t ${SINGLESTAGE_TAG} .`);

  // Ask Docker for the REAL size of each image, in bytes, so the ratio
  // below is a real calculated number, never a hardcoded guess.
  const multistageBytes = Number(run(`docker image inspect ${MULTISTAGE_TAG} --format "{{.Size}}"`));
  const singlestageBytes = Number(run(`docker image inspect ${SINGLESTAGE_TAG} --format "{{.Size}}"`));
  const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(1);

  // In case an old container from a previous run got left behind.
  run(`docker rm -f ${CONTAINER_NAME} 2>/dev/null || true`);

  // Actually run the real multi-stage image as a real container, publishing
  // its port to this host — proving the small image isn't just small, it
  // genuinely still works.
  console.log("Running the multi-stage image as a real container...");
  run(`docker run --rm -d --name ${CONTAINER_NAME} -p ${PORT}:${PORT} ${MULTISTAGE_TAG}`);

  // Give the container a real moment to finish starting Node before the
  // first request arrives.
  await new Promise((resolve) => setTimeout(resolve, 800));

  // A real HTTP request, from OUTSIDE the container, to the real port
  // "docker run -p" published — no different from hitting any other app.
  const res = await fetch(`http://localhost:${PORT}/`);
  const body = await res.json();

  // Stop the real running container now that the proof is captured.
  run(`docker stop ${CONTAINER_NAME}`);

  console.log("\nReal response from inside the running container:");
  console.log(JSON.stringify({ status: res.status, body }, null, 2));

  console.log("\nReal measured image sizes (docker image inspect):");
  console.log(`  Multi-stage  (Dockerfile):            ${toMB(multistageBytes)} MB`);
  console.log(`  Single-stage (Dockerfile.singlestage): ${toMB(singlestageBytes)} MB`);
  console.log(`  Real ratio: the single-stage image is ${(singlestageBytes / multistageBytes).toFixed(1)}x larger.`);
}

main();
