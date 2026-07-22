// This script plays the role of a real frontend consumer — it only ever
// calls the real running API and reads the real response, exactly like a
// real frontend's fetch() call would.
import { appV1, appV2 } from "./server.js";

// Port 0 means "give me any free port" — resolve only once really listening.
const serverV1 = await new Promise((resolve) => {
  const s = appV1.listen(0, () => resolve(s));
});
const serverV2 = await new Promise((resolve) => {
  const s = appV2.listen(0, () => resolve(s));
});
// The real ports the OS actually assigned to each app.
const baseV1 = `http://localhost:${serverV1.address().port}`;
const baseV2 = `http://localhost:${serverV2.address().port}`;

// The frontend was originally built reading response.name — exactly
// what v1's real, documented contract promises.
const resV1 = await fetch(`${baseV1}/profile`);
const bodyV1 = await resV1.json();
console.log(`GET v1 /profile => ${resV1.status}`, JSON.stringify(bodyV1));
console.log(`Frontend reads data.name => "${bodyV1.name}"`);

// The SAME frontend code, unchanged, now hitting v2 — which silently
// renamed "name" to "fullName". The request still succeeds (200), so
// nothing here looks broken from the network tab alone.
const resV2 = await fetch(`${baseV2}/profile`);
const bodyV2 = await resV2.json();
console.log(`\nGET v2 /profile => ${resV2.status}`, JSON.stringify(bodyV2));
// The real, measured proof: the exact same frontend code now reads undefined.
console.log(`Frontend reads data.name => ${bodyV2.name} (the real field is now "fullName": "${bodyV2.fullName}")`);

// Required, not just tidy — a listening server keeps this script alive forever.
serverV1.close();
serverV2.close();
