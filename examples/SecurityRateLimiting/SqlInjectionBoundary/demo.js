// SQL injection at the API boundary — this is what happens when a real
// request's raw input gets pasted directly into a SQL string instead of
// being passed as a real parameter. Uses node:sqlite (Node's own
// built-in database engine, confirmed working, zero install) — the
// vulnerability is about how the QUERY gets built, not which real
// database engine runs it.
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, isAdmin INTEGER);
  INSERT INTO users (username, password, isAdmin) VALUES ('ada', 'real-secret-password', 1);
  INSERT INTO users (username, password, isAdmin) VALUES ('grace', 'another-real-password', 0);
`);

// THE VULNERABILITY: the real username/password from a request get
// pasted straight into the SQL string. This is exactly what a naive,
// hand-rolled query looks like — no library "adds" this bug, ordinary
// string concatenation IS the bug.
function loginVulnerable(username, password) {
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log(`  Real SQL actually executed: ${sql}`);
  return db.prepare(sql).get();
}

// THE FIX: the exact same logical query, but username/password are
// passed as real, separate PARAMETERS (the ? placeholders) — the
// database engine itself keeps them as pure data, never as SQL syntax,
// no matter what characters they contain.
function loginFixed(username, password) {
  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  console.log(`  Real SQL actually executed: ${sql}  -- with username/password bound as real parameters, not concatenated`);
  return db.prepare(sql).get(username, password);
}

console.log("=== A real, correct login (both versions) ===");
console.log("Vulnerable version:", loginVulnerable("ada", "real-secret-password"));
console.log("Fixed version:     ", loginFixed("ada", "real-secret-password"));

// THE REAL ATTACK: this username isn't a real username at all — it's a
// crafted string that changes what the SQL statement itself means.
// `'--` closes the quoted string early, then `--` comments out
// everything after it (including the AND password = '...' check).
const maliciousUsername = "ada' --";
const anyPassword = "this-can-be-anything-at-all";

console.log("\n=== The real attack: logging in as ada with NO real password ===");
console.log(`Malicious "username" sent: ${maliciousUsername}`);
const vulnerableResult = loginVulnerable(maliciousUsername, anyPassword);
console.log(`VULNERABLE version result: ${vulnerableResult ? `LOGGED IN AS ${JSON.stringify(vulnerableResult)}` : "rejected"}`);

const fixedResult = loginFixed(maliciousUsername, anyPassword);
console.log(`FIXED version result: ${fixedResult ? "LOGGED IN" : "rejected — no user is literally named \"ada' --\""}`);

db.close();
