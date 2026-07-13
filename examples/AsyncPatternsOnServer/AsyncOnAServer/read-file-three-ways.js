import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const filePath = path.join(os.tmpdir(), "async-patterns-demo.txt");
fs.writeFileSync(filePath, "Same real file, read three different ways.\n");

// 1) Callback style — the original Node async pattern, still real, still everywhere
console.log("1) Callback style: fs.readFile(path, (err, data) => ...)");
fs.readFile(filePath, "utf-8", (err, data) => {
  if (err) throw err;
  console.log(`   => "${data.trim()}"`);

  // 2) Promise style — fs.promises wraps the same underlying operation
  console.log("2) Promise style: fs.promises.readFile(path).then(...)");
  fs.promises.readFile(filePath, "utf-8").then((data2) => {
    console.log(`   => "${data2.trim()}"`);
    runAsyncAwaitVersion();
  });
});

// 3) async/await — the same promise from #2, written to read top-to-bottom
async function runAsyncAwaitVersion() {
  console.log("3) async/await style: const data = await fs.promises.readFile(path)");
  const data3 = await fs.promises.readFile(filePath, "utf-8");
  console.log(`   => "${data3.trim()}"`);
  console.log("\nAll three read the exact same real file — same operation, three different syntaxes for handling when it finishes.");
}
