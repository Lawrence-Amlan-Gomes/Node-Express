// demo.js ONLY calls the real, running API and prints what comes back —
// never imports the controller or touches the in-memory store directly.
// Same rule as every other real-backend-resource topic in this project.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

// Create 3 real bookmarks, one request each — proves POST works before
// anything else is tested against them.
const seedBodies = [
  { url: "https://nodejs.org", title: "Node.js Docs" },
  { url: "https://expressjs.com", title: "Express Docs" },
  { url: "https://developer.mozilla.org", title: "MDN Web Docs" },
];
for (const body of seedBodies) {
  const res = await fetch(`${base}/bookmarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const created = await res.json();
  console.log(`POST /bookmarks (${body.title}) => ${res.status}`, JSON.stringify(created));
}

// A deliberately invalid body — no title, and a URL that isn't real.
const invalidRes = await fetch(`${base}/bookmarks`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "not-a-real-url", title: "" }),
});
const invalidBody = await invalidRes.json();
console.log(`\nPOST /bookmarks (invalid: bad url, empty title) => ${invalidRes.status}`, JSON.stringify(invalidBody));

// Page 1: limit=2, no cursor — should return the first 2 real bookmarks
// plus a real nextCursor pointing at the second one's id.
const page1Res = await fetch(`${base}/bookmarks?limit=2`);
const page1 = await page1Res.json();
console.log(`\nGET /bookmarks?limit=2 => ${page1Res.status}`, JSON.stringify(page1));

// Page 2: reuse the REAL nextCursor page 1 just returned — this is the
// entire cursor-pagination contract, proven end to end.
const page2Res = await fetch(`${base}/bookmarks?limit=2&cursor=${page1.nextCursor}`);
const page2 = await page2Res.json();
console.log(`GET /bookmarks?limit=2&cursor=${page1.nextCursor} => ${page2Res.status}`, JSON.stringify(page2));

// A single real bookmark, by its real id (the first one created, id 1).
const getRes = await fetch(`${base}/bookmarks/1`);
const getBody = await getRes.json();
console.log(`\nGET /bookmarks/1 => ${getRes.status}`, JSON.stringify(getBody));

// An id that was never created — the real 404 path.
const missingRes = await fetch(`${base}/bookmarks/999`);
const missingBody = await missingRes.json();
console.log(`GET /bookmarks/999 => ${missingRes.status}`, JSON.stringify(missingBody));

// Delete a real bookmark, then prove it's really gone.
const deleteRes = await fetch(`${base}/bookmarks/1`, { method: "DELETE" });
console.log(`\nDELETE /bookmarks/1 => ${deleteRes.status}`);
const afterDeleteRes = await fetch(`${base}/bookmarks/1`);
const afterDeleteBody = await afterDeleteRes.json();
console.log(`GET /bookmarks/1 (after delete) => ${afterDeleteRes.status}`, JSON.stringify(afterDeleteBody));

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
