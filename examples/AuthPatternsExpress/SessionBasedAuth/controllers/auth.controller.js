// A "controller" is where the ACTUAL logic for a request lives — reading
// the request, deciding what to do, and sending a response. Nothing in
// here knows or cares what URL path the client actually visited to get
// here — that's the routes file's job, not this one.

// The client only ever gets a small, random session id inside a cookie.
// It never gets the real session data itself — that stays server-side,
// looked up fresh on every request via req.session.
import bcrypt from "bcrypt";

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
  // THIS is the actual login: the server stores the real user id inside
  // the session object. express-session handles turning this into a
  // real signed cookie sent back to the client automatically.
  req.session.userId = user.id;
  res.status(200).json({ ok: true });
}

// Handles GET /me.
export function me(req, res) {
  if (!req.session.userId) {
    // No real session id stored under this cookie — reject with a real 401.
    res.status(401).json({ error: "not logged in" });
    // Stop here — without this, the code below would also try to run.
    return;
  }
  // Look up the real user this real session id points at.
  const user = users.find((u) => u.id === req.session.userId);
  // Send back the real, current user, proving the session lookup worked.
  res.status(200).json({ id: user.id, username: user.username });
}

// Handles POST /logout.
export function logout(req, res) {
  // destroy() really deletes the session server-side — the cookie the
  // client still holds afterward now points at nothing.
  req.session.destroy(() => {
    res.status(200).json({ ok: true });
  });
}
