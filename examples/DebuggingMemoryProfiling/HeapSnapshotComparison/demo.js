// Real, comparison-based leak hunting: take a real heap snapshot BEFORE
// some work runs, take another real snapshot AFTER, then count how many
// real instances of one class exist in each — the same core technique
// Chrome DevTools' "Comparison" view uses, just done by hand here so the
// real mechanics are visible instead of hidden behind a GUI.
import v8 from "node:v8";
import { readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// A real class instance is easy to search for by name in a real snapshot
// — this is standing in for "some object your app allocates a lot of,"
// like a request record, a session, or a cached row.
class LeakedRecord {
  constructor(id) {
    this.id = id;
    this.payload = "x".repeat(1024);
  }
}

// A real, deliberately unbounded array — nothing ever removes entries
// from it, so every LeakedRecord pushed here stays reachable forever,
// exactly like a real leak.
const leaks = [];

// Counts real instances of `className` inside one real .heapsnapshot
// file, by reading V8's own documented snapshot format directly.
function countInstances(snapshotPath, className) {
  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf-8"));
  const { node_fields, node_types } = snapshot.snapshot.meta;
  // node_fields tells us WHICH position in each flat node record holds
  // "type" and "name" — reading these by position, not by guessing.
  const typeFieldIndex = node_fields.indexOf("type");
  const nameFieldIndex = node_fields.indexOf("name");
  // node_types[typeFieldIndex] is the real list of possible type strings
  // ("object", "closure", "string", ...) — the node's raw type NUMBER is
  // an index into this list.
  const typeNames = node_types[typeFieldIndex];
  const stride = node_fields.length;
  const { nodes, strings } = snapshot;

  let count = 0;
  for (let i = 0; i < nodes.length; i += stride) {
    const type = typeNames[nodes[i + typeFieldIndex]];
    const name = strings[nodes[i + nameFieldIndex]];
    if (type === "object" && name === className) count++;
  }
  return count;
}

async function main() {
  const beforePath = path.join(tmpdir(), `before-${process.pid}.heapsnapshot`);
  const afterPath = path.join(tmpdir(), `after-${process.pid}.heapsnapshot`);

  console.log("Taking a real heap snapshot BEFORE any LeakedRecords exist...");
  v8.writeHeapSnapshot(beforePath);

  console.log("Simulating 3000 real 'requests' that each leak one real object...");
  for (let i = 0; i < 3000; i++) {
    leaks.push(new LeakedRecord(i));
  }

  // Forces a real garbage-collection pass first (needs `node --expose-gc`)
  // so the AFTER snapshot reflects real, still-reachable objects only —
  // not GC garbage that just hasn't been swept yet.
  if (global.gc) global.gc();

  console.log("Taking a real heap snapshot AFTER...");
  v8.writeHeapSnapshot(afterPath);

  const before = countInstances(beforePath, "LeakedRecord");
  const after = countInstances(afterPath, "LeakedRecord");

  console.log("\nReal LeakedRecord instances counted directly from each real snapshot:");
  console.log(JSON.stringify({ before, after, grew: after - before }, null, 2));

  console.log(
    `\nThat's the real technique: nothing in these numbers is estimated — every LeakedRecord in "after" is a real object this process is still holding onto, found by actually reading the real snapshot file.`,
  );

  // These snapshot files are only useful for this one comparison — real
  // production debugging would keep them to open in Chrome DevTools, but
  // this demo cleans up after itself like every other script here does.
  rmSync(beforePath);
  rmSync(afterPath);
}

main();
