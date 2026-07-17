// node:sqlite is Node's own built-in SQLite engine — no npm install
// needed. It's used here purely to demonstrate REAL relational modeling
// with zero extra setup; it's still experimental as of this Node version
// (you'll see a real warning about that when this file runs). The
// "Connecting Real Databases" topic later in this stage uses a full,
// production-grade PostgreSQL database via Prisma instead — that's what a
// real deployed backend actually runs on, not this.
import { DatabaseSync } from "node:sqlite";

// Builds a real, in-memory relational blog — 3 linked tables, some real rows.
export function buildRelationalBlog() {
  // ":memory:" means a real SQLite database that exists only for this process.
  const db = new DatabaseSync(":memory:");
  // Turn on real foreign-key enforcement — SQLite has this OFF by default.
  db.exec("PRAGMA foreign_keys = ON;");

  // In a RELATIONAL model, related data lives in SEPARATE tables, linked
  // by an id — a post doesn't contain its author's name directly, it
  // contains a user_id that POINTS to a row in the users table instead.
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE posts (
      id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE comments (
      id INTEGER PRIMARY KEY,
      post_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      FOREIGN KEY (post_id) REFERENCES posts(id)
    );
  `);

  // Insert one real user, the author of the post below.
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");
  // Insert one real post, linked to that user via user_id — not a copy of their name.
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 1, "Learning SQL vs NoSQL");
  // Insert the first real comment, linked to the post via post_id.
  db.prepare("INSERT INTO comments (id, post_id, text) VALUES (?, ?, ?)").run(1, 1, "Great post!");
  // Insert the second real comment, same post.
  db.prepare("INSERT INTO comments (id, post_id, text) VALUES (?, ?, ?)").run(2, 1, "Learned a lot, thanks.");

  // Hand back the real, ready-to-query database.
  return db;
}

// Getting "a post with its author and comments" back out requires a REAL
// JOIN across the posts and users tables, plus a second query for
// comments — the data doesn't live together, so SQL has to reassemble it
// at query time, every time.
export function getPostWithComments(db, postId) {
  // Query #1: the post, JOINed with users to pull in the real author name.
  const post = db
    .prepare(
      `SELECT posts.id, posts.title, users.name AS authorName
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = ?`,
    )
    .get(postId);

  // Query #2: a separate query, because comments live in their own table.
  const comments = db.prepare("SELECT text FROM comments WHERE post_id = ?").all(postId);

  // Reassemble the two separate query results into one real object.
  return { ...post, comments: comments.map((c) => c.text) };
}
