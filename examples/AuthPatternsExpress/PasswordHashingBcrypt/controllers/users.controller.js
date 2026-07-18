// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// Real password hashing with bcrypt. NEVER store a real password as
// plaintext — if the database ever leaks, every user's real password
// leaks with it. bcrypt turns a password into a one-way hash: easy to
// verify a guess against, practically impossible to reverse.
import bcrypt from "bcrypt";

// SALT ROUNDS: how many times bcrypt runs its internal hashing work.
// Higher = slower to compute = harder to brute-force guess at scale.
// 10 is a real, common production default (bcrypt's own recommended
// starting point) — deliberately slow enough to make guessing millions
// of passwords per second impractical, fast enough for one real login.
const SALT_ROUNDS = 10;

// A real, in-memory list of registered users — a real production
// controller would replace this array with a real database call
// (Stage C of this curriculum), but the bcrypt logic works the exact
// same way either way.
const users = [];
// Tracks the next real id to hand out to a newly registered user.
let nextId = 1;

// Handles POST /users/register.
export async function registerUser(req, res) {
  // Pull the real username and password out of the real parsed request body.
  const { username, password } = req.body;
  // hash() generates a real, random SALT internally, then mixes it into
  // the hash — that's why the SAME password produces a DIFFERENT hash
  // every single time. This is what stops two users with the same
  // password from having identical, and thus guessable-by-comparison,
  // rows in a real database.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  // Build the real new user record and hand it the next real id.
  const user = { id: nextId++, username, passwordHash };
  // Actually add it to the real in-memory list.
  users.push(user);
  // The real hash is returned here ONLY so this demo can show it on the
  // page — a real production API must NEVER return a password hash to
  // any client, ever.
  res.status(201).json({ id: user.id, username: user.username, passwordHash: user.passwordHash });
}

// Handles POST /users/login.
export async function loginUser(req, res) {
  // Pull the real username and password out of the real parsed request body.
  const { username, password } = req.body;
  // Look for a real user whose username matches the real request.
  const user = users.find((u) => u.username === username);
  if (!user) {
    // No such user — a real 401, same status as a wrong password (never
    // reveal WHICH part was wrong, that would help an attacker guess).
    res.status(401).json({ error: "invalid username or password" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // compare() re-derives the hash using the SAME salt already embedded
  // in the stored hash, then checks if it matches — this is the real
  // verification step a login route runs, never a plain === comparison.
  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    // A real, genuinely wrong password — reject it for real.
    res.status(401).json({ error: "invalid username or password" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // The real password really matched its real stored hash — log them in.
  res.status(200).json({ ok: true, username: user.username });
}
