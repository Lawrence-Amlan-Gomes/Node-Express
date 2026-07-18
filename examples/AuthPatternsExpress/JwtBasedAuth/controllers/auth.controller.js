// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// JWT-BASED AUTH: after a real login, the SERVER issues a real signed
// token containing the user's info directly inside it (base64-encoded,
// NOT encrypted — never put secrets in a JWT payload, it's readable by
// anyone who has the token). The server stores NOTHING — unlike a
// session, there's no server-side record to look up.
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// A real secret key used to SIGN every token — if this leaks, anyone
// can forge valid tokens. A real production app reads this from a real
// environment variable, never hardcodes it (done here only because this
// is a self-contained demo, not a real deployed service).
const JWT_SECRET = "demo-only-jwt-secret-do-not-reuse-in-real-projects";

// A real user, with a REAL bcrypt hash — never a plaintext password —
// seeded once at startup so this demo has someone real to log in as.
const users = [{ id: 1, username: "ada", passwordHash: await bcrypt.hash("correct-horse-battery-staple", 10) }];

// Handles POST /login.
export async function login(req, res) {
  // Pull the real username and password out of the real parsed request body.
  const { username, password } = req.body;
  // Look for a real user whose username matches the real request.
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    // Either no such user, or a genuinely wrong password — reject it for real.
    res.status(401).json({ error: "invalid username or password" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // sign() produces the real token: header + payload + a real HMAC
  // signature over both, using JWT_SECRET. expiresIn bakes a real
  // expiry into the token itself — no session store needs to track it.
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
}

// Real middleware: every protected route re-verifies the token's
// signature on every single request — there is no "logged in" state
// stored anywhere on the server to check instead.
export function requireAuth(req, res, next) {
  // Read the real Authorization header off the real incoming request.
  const authHeader = req.get("Authorization");
  // Only accept the real "Bearer <token>" shape — pull just the token part.
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    // No token was sent at all — reject with a real 401.
    res.status(401).json({ error: "missing token" });
    // Stop here — without this, the real route handler would still run.
    return;
  }
  try {
    // verify() checks the signature is real AND the token hasn't
    // expired — a tampered payload changes the signature check itself,
    // since the signature was computed over the ORIGINAL payload bytes.
    req.user = jwt.verify(token, JWT_SECRET);
    // The token is genuinely valid — let the real route handler run next.
    next();
  } catch (err) {
    // The real signature check failed — reject it, with the real reason why.
    res.status(401).json({ error: `invalid token: ${err.message}` });
  }
}

// Handles GET /me — only ever reached once requireAuth above has already
// verified the real token.
export function me(req, res) {
  // req.user was set by requireAuth from the real, verified token payload.
  res.status(200).json({ id: req.user.userId, username: req.user.username });
}
