// SESSION-BASED AUTH: after a real login, the SERVER creates a real
// session object and stores it server-side (here: in memory — a real
// production app would use a real store like Redis, since an in-memory
// store is wiped on every restart and doesn't work across multiple
// server instances). The server then sends the CLIENT only a small,
// random session ID inside a cookie. On every later request, the
// browser sends that cookie back automatically, and the server looks up
// the FULL session data by that id — the client never holds anything
// except a meaningless random id.
import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { pathToFileURL } from "node:url";

export const app = express();
app.use(express.json());

// A real user, with a REAL bcrypt hash — never a plaintext password —
// seeded once at startup so this demo has someone real to log in as.
const users = [{ id: 1, username: "ada", passwordHash: await bcrypt.hash("correct-horse-battery-staple", 10) }];

app.use(
  session({
    secret: "demo-only-session-secret-do-not-reuse-in-real-projects",
    resave: false,
    saveUninitialized: false,
    // Real production apps set { secure: true } too, once served over
    // real HTTPS, so the cookie is never sent over plain HTTP.
    cookie: { httpOnly: true, maxAge: 60_000 },
  }),
);

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  // THIS is the actual login: the server stores the real user id inside
  // the session object. express-session handles turning this into a
  // real signed cookie sent back to the client automatically.
  req.session.userId = user.id;
  res.status(200).json({ ok: true });
});

app.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "not logged in" });
  }
  const user = users.find((u) => u.id === req.session.userId);
  res.status(200).json({ id: user.id, username: user.username });
});

app.post("/logout", (req, res) => {
  // destroy() really deletes the session server-side — the cookie the
  // client still holds afterward now points at nothing.
  req.session.destroy(() => {
    res.status(200).json({ ok: true });
  });
});

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const PORT = process.env.PORT ?? 4051;
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
}
