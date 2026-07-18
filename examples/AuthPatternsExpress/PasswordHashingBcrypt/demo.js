// Calls the real, running Express API (server.js) over real HTTP — this
// file does NOT import bcrypt directly at all. A real backend dev
// exercises password hashing this way: real register/login requests,
// exactly like a frontend or Postman would. The real bcrypt.hash and
// bcrypt.compare calls live in controllers/users.controller.js instead.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;
// The one real password both registrations below deliberately reuse.
const sharedPassword = "correct-horse-battery-staple";

// Register the FIRST real user with the shared password.
const registerRes1 = await fetch(`${base}/users/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: sharedPassword }),
});
// Parse the real JSON body, including the real hash bcrypt actually produced.
const user1 = await registerRes1.json();
console.log(`Registered "${user1.username}" with password "${sharedPassword}":`);
console.log(`hash 1: ${user1.passwordHash}`);

// Register a SECOND real user with the EXACT SAME password.
const registerRes2 = await fetch(`${base}/users/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "grace", password: sharedPassword }),
});
// Parse the real JSON body — a genuinely different hash this time.
const user2 = await registerRes2.json();
console.log(`\nRegistered "${user2.username}" with the SAME password:`);
console.log(`hash 2: ${user2.passwordHash}`);
// Prove directly that the two real, stored hashes are NOT identical.
console.log(`\nIdentical hashes? ${user1.passwordHash === user2.passwordHash} (this is expected and correct — a real random salt is baked into each hash)`);

// A real login attempt with the REAL, correct password.
const correctLoginRes = await fetch(`${base}/users/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: sharedPassword }),
});
console.log(`\nLogin with the REAL password => ${correctLoginRes.status}`);

// A real login attempt with a genuinely WRONG password.
const wrongLoginRes = await fetch(`${base}/users/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: "totally-wrong-guess" }),
});
console.log(`Login with a WRONG password => ${wrongLoginRes.status}`);

console.log("\nWhat actually gets stored server-side: only the hash (e.g. the strings above) — the real plaintext password is never written anywhere, not even temporarily.");

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
