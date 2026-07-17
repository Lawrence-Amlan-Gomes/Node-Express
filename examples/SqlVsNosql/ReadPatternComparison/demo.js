// Proves both real patterns, both real winners: fetching one aggregate
// favors the document model (fewer real queries); searching across every
// aggregate favors the relational model (one real query vs a manual scan).
import { buildRelationalBlog, getPostWithComments as getRelationalPost, findCommentsByAuthor as findRelationalComments } from "./relational.js";
import { buildDocumentPosts, getPostWithComments as getDocumentPost, findCommentsByAuthor as findDocumentComments } from "./document.js";

// Build the real relational database and the real document array, side by side.
const db = buildRelationalBlog();
const posts = buildDocumentPosts();

console.log("PATTERN A: get one post with its comments");
// A real, fresh counter object — starts at 0 real queries.
const relCounterA = { count: 0 };
// Fetch the real post — this call increments relCounterA for real.
const relPost = getRelationalPost(db, 1, relCounterA);
console.log(`  RELATIONAL: ${relCounterA.count} real queries needed => ${JSON.stringify(relPost)}`);
// Fetch the equivalent document — no counter needed, since it's really 0 queries.
const docPost = getDocumentPost(posts, 1);
console.log(`  DOCUMENT:   0 queries needed (direct property access) => ${JSON.stringify(docPost)}`);

console.log("\nPATTERN B: find every comment written by \"Alex\", across ALL posts");
// A real, fresh counter object for this second pattern.
const relCounterB = { count: 0 };
// One real, indexed query — searches every row, but costs just 1 round trip.
const relComments = findRelationalComments(db, "Alex", relCounterB);
console.log(`  RELATIONAL: ${relCounterB.count} real query (indexed JOIN across all rows) => ${JSON.stringify(relComments)}`);
// The document version — real manual scanning, no query engine to ask.
const docResult = findDocumentComments(posts, "Alex");
console.log(`  DOCUMENT:   0 queries available — had to manually scan ${docResult.postsScanned} posts and ${docResult.commentsScanned} comments in application code => ${JSON.stringify(docResult.matches)}`);

console.log("\nSame two models, two completely different real winners depending on the read pattern.");
