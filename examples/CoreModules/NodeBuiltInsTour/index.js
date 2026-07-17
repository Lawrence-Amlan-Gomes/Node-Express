// Every import below uses the "node:" prefix — this makes it unambiguous
// that we mean Node's own built-in module, not some npm package that
// happens to share the same name.
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { EventEmitter } from "node:events";

// 1) path.join builds a real file path correctly for THIS operating
// system (using "/" or "\\" automatically), instead of you gluing
// strings by hand.
const filePath = path.join(os.tmpdir(), "node-express-playground-notes.txt");
console.log(`1) path.join(os.tmpdir(), "...") => ${filePath}`);

// 2) fs.writeFileSync — a real file, actually written to disk right now.
fs.writeFileSync(filePath, "Real note written by fs.writeFileSync\n");
// Read that same real file back, as a real string (utf-8 encoding).
const contents = fs.readFileSync(filePath, "utf-8");
console.log(`2) fs.writeFileSync + fs.readFileSync => "${contents.trim()}"`);

// 3) Buffer — Node's raw-bytes type. Buffer.from turns the text "Node"
// into its real underlying bytes, not just a JS string.
const buf = Buffer.from("Node", "utf-8");
// buf.join(", ") shows the actual byte numbers; buf.toString() decodes
// those bytes back into readable text.
console.log(`3) Buffer.from("Node") => bytes: [${buf.join(", ")}], toString(): "${buf.toString()}"`);

// 4) EventEmitter — the same publish/listen pattern Express and Node's
// own streams/servers are built on internally.
const bus = new EventEmitter();
// Register a real listener for a custom event named "greet".
bus.on("greet", (name) => console.log(`4) EventEmitter "greet" listener fired with name="${name}"`));
// Actually fire that event right now — the listener above runs synchronously.
bus.emit("greet", "Lawrence");

// 5) process — real, live information about the actual running process,
// not made-up values.
console.log(`5) process => version: ${process.version}, platform: ${process.platform}, argv[0]: ${path.basename(process.argv[0])}`);
