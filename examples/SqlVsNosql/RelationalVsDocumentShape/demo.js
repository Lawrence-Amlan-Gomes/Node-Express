// Proves the real structural difference between the two models, for the
// exact same blog post data, side by side.
import { buildRelationalBlog, getPostWithComments as getRelationalPost } from "./relational.js";
import { buildDocumentBlog, getPostWithComments as getDocumentPost } from "./document.js";

// Build the real, in-memory SQLite database — 3 real linked tables.
const db = buildRelationalBlog();
// Fetch it back with a real JOIN + a second query — the relational way.
const relationalResult = getRelationalPost(db, 1);
console.log("RELATIONAL (SQLite, 3 separate tables joined together at query time):");
// Print the real reassembled result, pretty-printed.
console.log(JSON.stringify(relationalResult, null, 2));

// Build the real, plain-object document — already all in one place.
const doc = buildDocumentBlog();
// "Fetch" it back with zero queries — just reading properties.
const documentResult = getDocumentPost(doc);
console.log("\nDOCUMENT (one embedded JS object, already all together):");
// Print the real result — same shape as the relational one above.
console.log(JSON.stringify(documentResult, null, 2));

console.log("\nSame final shape, two completely different ways of getting there.");
