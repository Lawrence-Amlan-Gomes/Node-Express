// Proves the real cookie/session mechanics, against the actual running
// server — fetch() doesn't manage cookies automatically like a browser
// does, so this demo captures the real Set-Cookie header itself and
// resends it, exactly like a browser would behind the scenes.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

const noCookieRes = await fetch(`${base}/me`);
console.log(`GET /me with NO cookie at all => ${noCookieRes.status}`);

const loginRes = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }),
});
const sessionCookie = loginRes.headers.get("set-cookie");
console.log(`\nPOST /login (correct credentials) => ${loginRes.status}`);
console.log(`Real Set-Cookie header sent back: ${sessionCookie}`);

const meWithCookieRes = await fetch(`${base}/me`, {
  headers: { Cookie: sessionCookie.split(";")[0] },
});
const me = await meWithCookieRes.json();
console.log(`\nGET /me WITH that real cookie => ${meWithCookieRes.status}, body: ${JSON.stringify(me)}`);

const logoutRes = await fetch(`${base}/logout`, {
  method: "POST",
  headers: { Cookie: sessionCookie.split(";")[0] },
});
console.log(`\nPOST /logout (with the same cookie) => ${logoutRes.status}`);

const meAfterLogoutRes = await fetch(`${base}/me`, {
  headers: { Cookie: sessionCookie.split(";")[0] },
});
console.log(`GET /me with the SAME cookie, after logout => ${meAfterLogoutRes.status} (the server-side session was really destroyed, so the same cookie no longer works)`);

server.close();
