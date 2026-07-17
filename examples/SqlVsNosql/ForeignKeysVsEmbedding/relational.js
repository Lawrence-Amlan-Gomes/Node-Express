// Same real SQLite setup style as RelationalVsDocumentShape — see that
// folder's relational.js for the fuller explanation of node:sqlite itself.
import { DatabaseSync } from "node:sqlite";

// Builds a real, in-memory database with ONE real user, ready for the
// broken-insert test below.
export function buildRelationalBlog() {
  // A real, in-memory-only SQLite database for this process.
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

  // Insert exactly one real, valid user — id 1 is the only real user that exists.
  db.prepare("INSERT INTO users (id, name) VALUES (?, ?)").run(1, "Lawrence");

  // Hand back the real, ready-to-query database.
  return db;
}

// Tries to insert a post that points at a user_id that doesn't exist in
// the users table at all. The database itself — not our application code —
// is what rejects this, because we declared the relationship with FOREIGN
// KEY and turned enforcement on.
export function insertPostForNonexistentUser(db) {
  // user_id 999 was never inserted into users — this is the real broken link.
  db.prepare("INSERT INTO posts (id, user_id, title) VALUES (?, ?, ?)").run(1, 999, "Orphan post");
}
