// Calls the real, running Express API (server.js) over real HTTP —
// proves the real vulnerability AND the real fix: user 1 tries to read
// user 2's real order, both ways.
import { app } from "./server.js";

// Port 0 means "give me any free port" — resolve only once it's really listening.
const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
// The real port the OS actually assigned, read back off the live server.
const { port } = server.address();
const base = `http://localhost:${port}`;

// User 1 fetching THEIR OWN order — works correctly, as expected.
const ownOrderRes = await fetch(`${base}/orders-vulnerable/101`, { headers: { "X-User-Id": "1" } });
// Print the real status — this one is genuinely allowed either way.
console.log(`User 1 fetches their OWN order (101) via the vulnerable route => ${ownOrderRes.status}`);

// User 1 fetching USER 2's real order, on the VULNERABLE route — this
// is the actual BOLA bug: it works, and it shouldn't.
const vulnerableRes = await fetch(`${base}/orders-vulnerable/102`, { headers: { "X-User-Id": "1" } });
// Parse the real JSON body — this is the real data that leaked.
const vulnerableData = await vulnerableRes.json();
// Print the real status — a 200 here is exactly the bug.
console.log(`\nUser 1 fetches USER 2's order (102) via the VULNERABLE route => ${vulnerableRes.status}`);
// Print the real leaked data, proving it genuinely came back.
console.log(`Real data leaked: ${JSON.stringify(vulnerableData)}`);

// The exact same request, against the FIXED route — real 403, because
// the server actually checks ownership this time.
const fixedRes = await fetch(`${base}/orders-fixed/102`, { headers: { "X-User-Id": "1" } });
// Parse the real JSON body — a real rejection message this time.
const fixedData = await fixedRes.json();
// Print the real status — a 403 here proves the fix works.
console.log(`\nUser 1 fetches USER 2's order (102) via the FIXED route => ${fixedRes.status}`);
// Print the real rejection body.
console.log(`Real response: ${JSON.stringify(fixedData)}`);

// User 2 fetching their OWN order on the fixed route still works fine —
// the fix only blocks access to OTHER people's objects, not your own.
const ownFixedRes = await fetch(`${base}/orders-fixed/102`, { headers: { "X-User-Id": "2" } });
// Print the real status — the fix never blocks a genuine owner.
console.log(`\nUser 2 fetches THEIR OWN order (102) via the fixed route => ${ownFixedRes.status}`);

// Required, not just tidy — a listening server keeps this script alive forever.
server.close();
