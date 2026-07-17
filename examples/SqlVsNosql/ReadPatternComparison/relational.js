// Same real SQLite setup style as the other sections in this topic — see
// RelationalVsDocumentShape/relational.js for the fuller node:sqlite intro.
import { DatabaseSync } from "node:sqlite";

// Builds a real, in-memory blog with 2 real users, 3 real posts, and 3 real comments.
export function buildRelationalBlog() {
  // A real, in-memory-only SQLite database for this process.
  const db = new DatabaseSync(":memory:");
  // Turn on real foreign-key enforcement — off by default in SQLite.
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, title TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id));
    CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL, author_id INTEGER NOT NULL, text TEXT NOT NULL, FOREIGN KEY (post_id) REFERENCES posts(id), FOREIGN KEY (author_id) REFERENCES users(id));
  `);

  // Insert the two real users these posts/comments will reference.
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(2, "Alex");

  // Insert three real posts, two owned by Lawrence, one by Alex.
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 1, "Post One");
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(2, 1, "Post Two");
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(3, 2, "Post Three");

  // Insert three real comments, spread across posts and authors on purpose —
  // this is what makes "find every comment Alex wrote" a real cross-post search.
  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(1, 1, 2, "Nice one!");
  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(2, 2, 2, "Agreed.");
  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(3, 3, 1, "Interesting take.");

  // Hand back the real, ready-to-query database.
  return db;
}

// PATTERN A: "get one post with its comments" — a single aggregate.
// Costs 2 real queries, because the data lives in separate tables.
export function getPostWithComments(db, postId, queryCounter) {
  // Count this real query, so the demo can print a real, honest number.
  queryCounter.count++;
  // Query #1: the post itself.
  const post = db.prepare("SELECT id, title FROM posts WHERE id = ?").get(postId);
  // Count this second real query too.
  queryCounter.count++;
  // Query #2: its comments, in a separate table.
  const comments = db.prepare("SELECT text FROM comments WHERE post_id = ?").all(postId);
  // Reassemble both real query results into one object.
  return { ...post, comments: comments.map((c) => c.text) };
}

// PATTERN B: "find every comment a specific person ever wrote, across
// EVERY post" — a cross-cutting query over many aggregates at once. SQL
// answers this in ONE real, indexed, set-based query — the database
// itself does the searching across all rows.
export function findCommentsByAuthor(db, authorName, queryCounter) {
  // Count this one real query — SQL needs only one, no matter how many rows exist.
  queryCounter.count++;
  // A single real query, joining across comments/users/posts all at once.
  return db
    .prepare(
      `SELECT comments.text, posts.title AS postTitle
       FROM comments
       JOIN users ON comments.author_id = users.id
       JOIN posts ON comments.post_id = posts.id
       WHERE users.name = ?`,
    )
    .all(authorName);
}
