import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Build a real, cross-platform-safe path to a temp file.
const filePath = path.join(os.tmpdir(), "async-patterns-demo.txt");
// Write one real file to disk — all three reads below load this exact
// same file, so any difference in output would be a real bug, not expected.
fs.writeFileSync(filePath, "Same real file, read three different ways.\n");

// Just a label printed before the callback-style read runs.
console.log("1) Callback style: fs.readFile(path, (err, data) => ...)");
// The original Node async pattern — the function you pass runs LATER,
// once the real disk read finishes.
fs.readFile(filePath, "utf-8", (err, data) => {
  // err is null on success, or a real Error if something went wrong.
  if (err) throw err;
  console.log(`   => "${data.trim()}"`);

  // Just a label printed before the Promise-style read runs.
  console.log("2) Promise style: fs.promises.readFile(path).then(...)");
  // fs.promises wraps the exact same underlying operation in a real
  // Promise, so you can .then() it instead of passing a callback.
  fs.promises.readFile(filePath, "utf-8").then((data2) => {
    console.log(`   => "${data2.trim()}"`);
    // Kick off the third style only after the first two have finished,
    // so all three log lines print in a predictable 1-2-3 order.
    runAsyncAwaitVersion();
  });
});

// "async" marks this function as one that can use "await" inside it —
// sugar on top of the SAME promise-based operation as style #2.
async function runAsyncAwaitVersion() {
  console.log("3) async/await style: const data = await fs.promises.readFile(path)");
  // "await" pauses just THIS function until the promise resolves — it
  // does not block Node's one JS thread while waiting.
  const data3 = await fs.promises.readFile(filePath, "utf-8");
  console.log(`   => "${data3.trim()}"`);
  // The actual point of this whole file, spelled out once at the end.
  console.log("\nAll three read the exact same real file — same operation, three different syntaxes for handling when it finishes.");
}
