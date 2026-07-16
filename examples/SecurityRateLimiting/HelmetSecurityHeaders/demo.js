// Proves the real, actual response headers, against two real running
// servers — one plain, one with helmet — not a description of helmet's
// docs.
import { appWithoutHelmet, appWithHelmet } from "./server.js";

const serverA = await new Promise((resolve) => {
  const s = appWithoutHelmet.listen(0, () => resolve(s));
});
const serverB = await new Promise((resolve) => {
  const s = appWithHelmet.listen(0, () => resolve(s));
});

const resA = await fetch(`http://localhost:${serverA.address().port}/`);
const resB = await fetch(`http://localhost:${serverB.address().port}/`);

const headersOfInterest = [
  "x-powered-by",
  "x-content-type-options",
  "x-frame-options",
  "x-dns-prefetch-control",
  "strict-transport-security",
  "content-security-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "referrer-policy",
];

console.log("Real response headers, WITHOUT helmet:");
for (const h of headersOfInterest) {
  console.log(`  ${h}: ${resA.headers.get(h) ?? "(not set)"}`);
}

console.log("\nReal response headers, WITH helmet():");
for (const h of headersOfInterest) {
  console.log(`  ${h}: ${resB.headers.get(h) ?? "(not set)"}`);
}

console.log("\nThe most immediately concrete one: WITHOUT helmet, X-Powered-By really announces \"Express\" to anyone — a real, free hint for an attacker about which known Express-specific vulnerabilities might apply. WITH helmet, that header is really gone.");

serverA.close();
serverB.close();
