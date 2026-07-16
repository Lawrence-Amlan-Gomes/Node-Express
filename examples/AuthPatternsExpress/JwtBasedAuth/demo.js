// Proves the real JWT mechanics, against the actual running server —
// including a real tampered token being genuinely rejected.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

const loginRes = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "ada", password: "correct-horse-battery-staple" }),
});
const { token } = await loginRes.json();
console.log(`POST /login => ${loginRes.status}`);
console.log(`Real token: ${token}`);

// A JWT is header.payload.signature, base64url-encoded — NOT encrypted.
// Decoding the payload here (no secret needed, just base64) proves it's
// plainly readable by anyone who has the token — never put a real
// secret (a password, a credit card number) inside a JWT payload.
const payloadBase64 = token.split(".")[1];
const decodedPayload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString());
console.log(`\nThe payload, decoded with nothing but base64 (no secret needed — it's not encrypted):`);
console.log(decodedPayload);

const meRes = await fetch(`${base}/me`, { headers: { Authorization: `Bearer ${token}` } });
const me = await meRes.json();
console.log(`\nGET /me with the real token => ${meRes.status}, body: ${JSON.stringify(me)}`);

// TAMPERING: flip one character in the MIDDLE of the payload segment,
// then reassemble a token with the ORIGINAL signature — proving the
// signature no longer matches the (now different) payload it's
// supposed to cover.
const mid = Math.floor(payloadBase64.length / 2);
const flippedChar = payloadBase64[mid] === "A" ? "B" : "A";
const tamperedPayload = payloadBase64.slice(0, mid) + flippedChar + payloadBase64.slice(mid + 1);
const [header, , signature] = token.split(".");
const tamperedToken = `${header}.${tamperedPayload}.${signature}`;
const tamperedRes = await fetch(`${base}/me`, { headers: { Authorization: `Bearer ${tamperedToken}` } });
const tamperedBody = await tamperedRes.json();
console.log(`\nGET /me with a TAMPERED token (payload changed, signature left as-is) => ${tamperedRes.status}, body: ${JSON.stringify(tamperedBody)}`);

const noTokenRes = await fetch(`${base}/me`);
console.log(`\nGET /me with NO token at all => ${noTokenRes.status}`);

server.close();
