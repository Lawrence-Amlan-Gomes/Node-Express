// A "controller" is where the ACTUAL logic for a request lives. Nothing
// in here knows or cares what URL path the client actually visited to
// get here — that's the routes file's job, not this one.
//
// SQL injection at the API boundary — this is what happens when a real
// request's raw input gets pasted directly into a SQL string instead of
// being passed as a real parameter. Uses node:sqlite (Node's own
// built-in database engine, confirmed working, zero install) — the
// vulnerability is about how the QUERY gets built, not which real
// database engine runs it.
import { DatabaseSync } from "node:sqlite";

// A real, in-memory database — enough to prove the real injection bug
// and its fix without needing a real external database for this concept.
const db = new DatabaseSync(":memory:");
// Actually creates the real table and seeds two real users, one admin.
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, isAdmin INTEGER);
  INSERT INTO users (username, password, isAdmin) VALUES ('ada', 'real-secret-password', 1);
  INSERT INTO users (username, password, isAdmin) VALUES ('grace', 'another-real-password', 0);
`);

// Handles POST /login-vulnerable.
// THE VULNERABILITY: the real username/password from the request body
// get pasted straight into the SQL string. This is exactly what a
// naive, hand-rolled query looks like — no library "adds" this bug,
// ordinary string concatenation IS the bug.
export function loginVulnerable(req, res) {
  // Pull the real username and password straight out of the real request body.
  const { username, password } = req.body;
  // Build the real SQL string by pasting the real input directly into it — the bug itself.
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  // Actually run the real, potentially-hijacked query against the real database.
  const user = db.prepare(sql).get();
  // The real sqlExecuted field is returned ONLY so this demo can show it
  // on the page — a real production API must NEVER leak its raw query
  // string to a client.
  res.status(user ? 200 : 401).json({ sqlExecuted: sql, loggedIn: !!user, username: user ? user.username : null });
}

// Handles POST /login-fixed.
// THE FIX: the exact same logical query, but username/password are
// passed as real, separate PARAMETERS (the ? placeholders) — the
// database engine itself keeps them as pure data, never as SQL syntax,
// no matter what characters they contain.
export function loginFixed(req, res) {
  // Pull the real username and password straight out of the real request body.
  const { username, password } = req.body;
  // Build the real SQL string with placeholders — the real input never touches this string.
  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  // Actually run the real query, with username/password bound as real, separate parameters.
  const user = db.prepare(sql).get(username, password);
  // Same teaching-only sqlExecuted field, this time showing the real parameterized form.
  res.status(user ? 200 : 401).json({
    sqlExecuted: `${sql}  -- with username/password bound as real parameters, not concatenated`,
    loggedIn: !!user,
    username: user ? user.username : null,
  });
}
