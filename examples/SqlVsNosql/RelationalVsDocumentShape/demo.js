// Proves the real structural difference between the two models, for the
// exact same blog post data, side by side.
import { buildRelationalBlog, getPostWithComments as getRelationalPost } from "./relational.js";
import { buildDocumentBlog, getPostWithComments as getDocumentPost } from "./document.js";

const db = buildRelationalBlog();
const relationalResult = getRelationalPost(db, 1);
console.log("RELATIONAL (SQLite, 3 separate tables joined together at query time):");
console.log(JSON.stringify(relationalResult, null, 2));

const doc = buildDocumentBlog();
const documentResult = getDocumentPost(doc);
console.log("\nDOCUMENT (one embedded JS object, already all together):");
console.log(JSON.stringify(documentResult, null, 2));

console.log("\nSame final shape, two completely different ways of getting there.");
