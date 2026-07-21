import { parentPort, workerData } from "node:worker_threads";
import { countPrimesInRange } from "./isPrime.js";

const { start, end, workerIndex, sharedBuffer } = workerData;

// A real, genuinely shared block of memory — every worker thread writes
// into the SAME real buffer, at its own real slot, no copying involved.
// This is the actual thing worker_threads offers that cluster's separate
// OS processes never could: real shared memory, not just message-passing.
const counts = new Int32Array(sharedBuffer);

const count = countPrimesInRange(start, end);

// Atomics.store writes this real result directly into the real shared
// buffer, safely, even though every worker does this at roughly the same
// real moment.
Atomics.store(counts, workerIndex, count);

parentPort.postMessage("done");
