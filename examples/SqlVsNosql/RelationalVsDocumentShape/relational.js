// node:sqlite is Node's own built-in SQLite engine — no npm install
// needed. It's used here purely to demonstrate REAL relational modeling
// with zero extra setup; it's still experimental as of this Node version
// (you'll see a real warning about that when this file runs). The
// "Connecting Real Databases" topic later in this stage uses a full,
// production-grade PostgreSQL database via Prisma instead — that's what a
// real deployed backend actually runs on, not this.
import { DatabaseSync } from "node:sqlite";

export function buildRelationalBlog() {
  const db = new DatabaseSync(":memory:");
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

  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 1, "Learning SQL vs NoSQL");
  db.prepare("INSERT INTO comments (id, post_id, text) VALUES (?, ?, ?)").run(1, 1, "Great post!");
  db.prepare("INSERT INTO comments (id, post_id, text) VALUES (?, ?, ?)").run(2, 1, "Learned a lot, thanks.");

  return db;
}

// Getting "a post with its author and comments" back out requires a REAL
// JOIN across the posts and users tables, plus a second query for
// comments — the data doesn't live together, so SQL has to reassemble it
// at query time, every time.
export function getPostWithComments(db, postId) {
  const post = db
    .prepare(
      `SELECT posts.id, posts.title, users.name AS authorName
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = ?`,
    )
    .get(postId);

  const comments = db.prepare("SELECT text FROM comments WHERE post_id = ?").all(postId);

  return { ...post, comments: comments.map((c) => c.text) };
}
