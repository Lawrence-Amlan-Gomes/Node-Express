// Same real SQLite setup style as the other sections in this topic — see
// RelationalVsDocumentShape/relational.js for the fuller node:sqlite intro.
import { DatabaseSync } from "node:sqlite";

export function buildRelationalBlog() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, title TEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id));
    CREATE TABLE comments (id INTEGER PRIMARY KEY, post_id INTEGER NOT NULL, author_id INTEGER NOT NULL, text TEXT NOT NULL, FOREIGN KEY (post_id) REFERENCES posts(id), FOREIGN KEY (author_id) REFERENCES users(id));
  `);

  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(2, "Alex");

  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 1, "Post One");
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(2, 1, "Post Two");
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(3, 2, "Post Three");

  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(1, 1, 2, "Nice one!");
  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(2, 2, 2, "Agreed.");
  db.prepare("INSERT INTO comments (id, post_id, author_id, text) VALUES (?, ?, ?, ?)").run(3, 3, 1, "Interesting take.");

  return db;
}

// PATTERN A: "get one post with its comments" — a single aggregate.
// Costs 2 real queries, because the data lives in separate tables.
export function getPostWithComments(db, postId, queryCounter) {
  queryCounter.count++;
  const post = db.prepare("SELECT id, title FROM posts WHERE id = ?").get(postId);
  queryCounter.count++;
  const comments = db.prepare("SELECT text FROM comments WHERE post_id = ?").all(postId);
  return { ...post, comments: comments.map((c) => c.text) };
}

// PATTERN B: "find every comment a specific person ever wrote, across
// EVERY post" — a cross-cutting query over many aggregates at once. SQL
// answers this in ONE real, indexed, set-based query — the database
// itself does the searching across all rows.
export function findCommentsByAuthor(db, authorName, queryCounter) {
  queryCounter.count++;
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
