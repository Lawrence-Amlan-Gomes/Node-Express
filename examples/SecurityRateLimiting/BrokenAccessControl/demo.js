// Proves the real vulnerability AND the real fix, against the actual
// running server — user 1 tries to read user 2's real order, both ways.
import { app } from "./server.js";

const server = await new Promise((resolve) => {
  const s = app.listen(0, () => resolve(s));
});
const { port } = server.address();
const base = `http://localhost:${port}`;

// User 1 fetching THEIR OWN order — works correctly, as expected.
const ownOrderRes = await fetch(`${base}/orders-vulnerable/101`, { headers: { "X-User-Id": "1" } });
console.log(`User 1 fetches their OWN order (101) via the vulnerable route => ${ownOrderRes.status}`);

// User 1 fetching USER 2's real order, on the VULNERABLE route — this
// is the actual BOLA bug: it works, and it shouldn't.
const vulnerableRes = await fetch(`${base}/orders-vulnerable/102`, { headers: { "X-User-Id": "1" } });
const vulnerableData = await vulnerableRes.json();
console.log(`\nUser 1 fetches USER 2's order (102) via the VULNERABLE route => ${vulnerableRes.status}`);
console.log(`Real data leaked: ${JSON.stringify(vulnerableData)}`);

// The exact same request, against the FIXED route — real 403, because
// the server actually checks ownership this time.
const fixedRes = await fetch(`${base}/orders-fixed/102`, { headers: { "X-User-Id": "1" } });
const fixedData = await fixedRes.json();
console.log(`\nUser 1 fetches USER 2's order (102) via the FIXED route => ${fixedRes.status}`);
console.log(`Real response: ${JSON.stringify(fixedData)}`);

// User 2 fetching their OWN order on the fixed route still works fine —
// the fix only blocks access to OTHER people's objects, not your own.
const ownFixedRes = await fetch(`${base}/orders-fixed/102`, { headers: { "X-User-Id": "2" } });
console.log(`\nUser 2 fetches THEIR OWN order (102) via the fixed route => ${ownFixedRes.status}`);

server.close();
