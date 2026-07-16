// JWT-BASED AUTH: after a real login, the SERVER issues a real signed
// token containing the user's info directly inside it (base64-encoded,
// NOT encrypted — never put secrets in a JWT payload, it's readable by
// anyone who has the token). The server stores NOTHING — unlike a
// session, there's no server-side record to look up. Every later
// request sends the token back (usually in an Authorization header),
// and the server just re-verifies its real cryptographic signature.
// That's the real trade-off: no server-side storage needed (scales
// easily across many server instances), but a JWT can't be revoked
// early the way destroying a session can — it stays valid until it
// actually expires.
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

// A real secret key used to SIGN every token — if this leaks, anyone
// can forge valid tokens. A real production app reads this from a real
// environment variable, never hardcodes it (done here only because this
// is a self-contained demo, not a real deployed service).
const JWT_SECRET = "demo-only-jwt-secret-do-not-reuse-in-real-projects";

const users = [{ id: 1, username: "ada", passwordHash: await bcrypt.hash("correct-horse-battery-staple", 10) }];

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  // sign() produces the real token: header + payload + a real HMAC
  // signature over both, using JWT_SECRET. expiresIn bakes a real
  // expiry into the token itself — no session store needs to track it.
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
});

// Real middleware: every protected route re-verifies the token's
// signature on every single request — there is no "logged in" state
// stored anywhere on the server to check instead.
function requireAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "missing token" });
  }
  try {
    // verify() checks the signature is real AND the token hasn't
    // expired — a tampered payload changes the signature check itself,
    // since the signature was computed over the ORIGINAL payload bytes.
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: `invalid token: ${err.message}` });
  }
}

app.get("/me", requireAuth, (req, res) => {
  res.status(200).json({ id: req.user.userId, username: req.user.username });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4052;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
