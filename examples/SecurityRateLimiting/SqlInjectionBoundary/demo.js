// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT import node:sqlite directly at all. A real backend dev
// exercises a login endpoint this way: real requests, real JSON
// responses. The real, injectable (and real, fixed) SQL lives in
// controllers/auth.controller.js instead.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

console.log("=== A real, correct login (both versions) ===");
// A real, genuinely correct login attempt against the vulnerable route.
const correctVulnRes = await fetch(`${base}/login-vulnerable`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: "real-secret-password" }),
});
// Parse the real JSON body, including the real SQL that actually ran.
const correctVuln = await correctVulnRes.json();
console.log("Vulnerable version:", correctVuln);

// The exact same real, correct login attempt against the fixed route.
const correctFixedRes = await fetch(`${base}/login-fixed`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: "real-secret-password" }),
});
// Parse the real JSON body — a legitimate login still works fine here too.
const correctFixed = await correctFixedRes.json();
console.log("Fixed version:     ", correctFixed);

// THE REAL ATTACK: this username isn't a real username at all — it's a
// crafted string that changes what the SQL statement itself means.
// `' --` closes the quoted string early, then `--` comments out
// everything after it (including the AND password = '...' check).
const maliciousUsername = "ada' --";
const anyPassword = "this-can-be-anything-at-all";

console.log("\n=== The real attack: logging in as ada with NO real password ===");
console.log(`Malicious "username" sent: ${maliciousUsername}`);

// A real POST with the malicious username, against the VULNERABLE route.
const attackVulnRes = await fetch(`${base}/login-vulnerable`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: maliciousUsername, password: anyPassword }),
});
// Parse the real JSON body — proves whether the real attack actually worked.
const attackVuln = await attackVulnRes.json();
// Print the real, plain verdict for the vulnerable route.
console.log(`VULNERABLE version result: ${attackVuln.loggedIn ? `LOGGED IN AS ${attackVuln.username}` : "rejected"}`);
console.log(`  Real SQL actually executed: ${attackVuln.sqlExecuted}`);

// The exact same real attack, against the FIXED route this time.
const attackFixedRes = await fetch(`${base}/login-fixed`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: maliciousUsername, password: anyPassword }),
});
// Parse the real JSON body — proves the fix genuinely defeats the same attack.
const attackFixed = await attackFixedRes.json();
// Print the real, plain verdict for the fixed route.
console.log(`FIXED version result: ${attackFixed.loggedIn ? "LOGGED IN" : "rejected — no user is literally named \"ada' --\""}`);
console.log(`  Real SQL actually executed: ${attackFixed.sqlExecuted}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
