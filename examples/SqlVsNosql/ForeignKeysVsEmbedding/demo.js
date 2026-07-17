// Proves the real, contrasting outcomes: the relational database actively
// rejects an inconsistent relationship; the document model raises no error
// at all for the equivalent situation, because it has nothing to check
// against.
import { buildRelationalBlog, insertPostForNonexistentUser } from "./relational.js";
import { buildDocumentPost } from "./document.js";

// Build the real database with only one real, valid user.
const db = buildRelationalBlog();
try {
  // Attempt the real broken insert — a post pointing at a user that doesn't exist.
  insertPostForNonexistentUser(db);
  // Only reached if SQLite somehow allowed it — should never happen here.
  console.log("Relational insert succeeded — this should never happen with foreign keys enforced");
} catch (err) {
  // Reached instead, for real — SQLite itself threw, with a real error message.
  console.log(`RELATIONAL: insert REJECTED by the database itself — "${err.message}"`);
}

// Build the equivalent "orphan" post, document-style — no database involved.
const post = buildDocumentPost();
console.log(`\nDOCUMENT: the equivalent "orphan" post was created with no error at all:`);
// Print the real object — it was created successfully, with no complaint.
console.log(JSON.stringify(post, null, 2));
console.log("Nothing in the document model itself noticed or cared — there's no separate table to check authorName against.");
