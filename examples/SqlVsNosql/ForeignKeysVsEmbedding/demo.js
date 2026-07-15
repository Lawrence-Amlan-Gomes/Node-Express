// Proves the real, contrasting outcomes: the relational database actively
// rejects an inconsistent relationship; the document model raises no error
// at all for the equivalent situation, because it has nothing to check
// against.
import { buildRelationalBlog, insertPostForNonexistentUser } from "./relational.js";
import { buildDocumentPost } from "./document.js";

const db = buildRelationalBlog();
try {
  insertPostForNonexistentUser(db);
  console.log("Relational insert succeeded — this should never happen with foreign keys enforced");
} catch (err) {
  console.log(`RELATIONAL: insert REJECTED by the database itself — "${err.message}"`);
}

const post = buildDocumentPost();
console.log(`\nDOCUMENT: the equivalent "orphan" post was created with no error at all:`);
console.log(JSON.stringify(post, null, 2));
console.log("Nothing in the document model itself noticed or cared — there's no separate table to check authorName against.");
