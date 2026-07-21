import { Worker } from "node:worker_threads";
import { availableParallelism } from "node:os";
import { countPrimesInRange } from "./isPrime.js";

const RANGE_END = 8_000_000;

console.log(`Counting real primes below ${RANGE_END}, single-threaded first...`);
const singleStart = Date.now();
const singleCount = countPrimesInRange(0, RANGE_END);
const singleMs = Date.now() - singleStart;
console.log(`Single-threaded: ${singleCount} real primes found, in ${singleMs}ms.`);

// This real machine's own real CPU core count — worker_threads only pays
// off up to genuinely available real cores.
const numWorkers = availableParallelism();
console.log(`\nSplitting the SAME work across ${numWorkers} real worker threads (this machine's real core count)...`);

// One real, shared 32-bit slot PER WORKER — every worker writes its own
// real result directly into this ONE shared buffer, no copying.
const sharedBuffer = new SharedArrayBuffer(numWorkers * Int32Array.BYTES_PER_ELEMENT);
const counts = new Int32Array(sharedBuffer);

const chunkSize = Math.ceil(RANGE_END / numWorkers);
const multiStart = Date.now();

await Promise.all(
  Array.from({ length: numWorkers }, (_, workerIndex) => {
    const start = workerIndex * chunkSize;
    const end = Math.min(start + chunkSize, RANGE_END);
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL("./prime-worker.js", import.meta.url), {
        workerData: { start, end, workerIndex, sharedBuffer },
      });
      worker.on("message", resolve);
      worker.on("error", reject);
    });
  }),
);

const multiMs = Date.now() - multiStart;
// Real sum of every real worker's own real shared-memory slot.
const multiCount = counts.reduce((sum, n) => sum + n, 0);

console.log(`Multi-threaded: ${multiCount} real primes found, in ${multiMs}ms.`);
console.log(`\nBoth real counts match: ${singleCount === multiCount} (${singleCount} === ${multiCount}) — same real work, split across real threads, not approximated.`);
console.log(`Real measured speed-up: ~${(singleMs / multiMs).toFixed(1)}x faster, using this real machine's ${numWorkers} real cores.`);
