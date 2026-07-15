// Same real SQLite setup style as RelationalVsDocumentShape — see that
// folder's relational.js for the fuller explanation of node:sqlite itself.
import { DatabaseSync } from "node:sqlite";

export function buildRelationalBlog() {
  const db = new DatabaseSync(":memory:");
  // PRAGMA foreign_keys = ON is NOT the default in SQLite — a real,
  // worth-knowing gotcha on its own. Without this line, the constraint
  // below would be declared but silently NOT enforced.
  db.exec("PRAGMA foreign_keys = ON;");

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
  `);

  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");

  return db;
}

// Tries to insert a post that points at a user_id that doesn't exist in
// the users table at all. The database itself — not our application code —
// is what rejects this, because we declared the relationship with FOREIGN
// KEY and turned enforcement on.
export function insertPostForNonexistentUser(db) {
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 999, "Orphan post");
}
