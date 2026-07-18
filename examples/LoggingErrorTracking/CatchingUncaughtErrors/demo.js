// server.js deliberately calls process.exit(1) once its real safety net
// fires — running it straight inside THIS process would kill this demo
// script too. So this demo spawns server.js as a genuinely separate
// process (the same real pattern used in the Error Handling in Express
// topic's LegacyTryCatch example) specifically so there's a real,
// separate process to observe crashing, instead of trying to survive
// the crash in-process.
import { execSync } from "node:child_process";

console.log("Running `node server.js` as a real, separate process...\n");

try {
  // If the child exits 0, execSync just returns its real stdout.
  const output = execSync("node server.js", { encoding: "utf-8", timeout: 3000 });
  // Should never actually reach here — the background task always crashes it.
  console.log("Unexpected: the process did not crash.", output);
} catch (err) {
  // A non-zero real exit makes execSync THROW — the real stdout the
  // child actually produced before dying is still available on the
  // error object, along with its real exit code.
  console.log(`The real child process exited with code ${err.status} (non-zero — it really crashed, on purpose).\n`);
  console.log("The real, structured FATAL log line it printed before exiting:");
  // Print the real stdout the crashed process actually produced.
  console.log(err.stdout.trim());
}

console.log("\nNotice: the log line above was written, and the process exited cleanly with a real, non-zero code — not a silent hang, and not a raw, unhandled stack trace dumped with no context. That's the real value of the process-level safety net.");
