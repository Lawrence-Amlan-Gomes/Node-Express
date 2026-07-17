// picocolors is a real npm dependency (see this folder's own package.json /
// package-lock.json) — it colors every line this script prints below, for
// real, not just installed for show.
const pc = require("picocolors");

// A normal require() of a normal CommonJS file (math.cjs) — this always
// worked, on every Node version, nothing new here.
const { multiply } = require("./math.cjs");

// require() of a real CommonJS module: always allowed, on every Node
// version — this line proves nothing new by itself, it's the baseline.
console.log(pc.cyan("1)") + ` require() of a real CommonJS module: multiply(3, 4) = ${multiply(3, 4)}`);

// require() of a real ES Module (.mjs) file. This line is the genuinely
// new, Node >=22.12 behavior — before that version this line would have
// thrown ERR_REQUIRE_ESM instead of returning a value.
const esm = require("./math.mjs");
console.log(pc.cyan("2)") + ` require() of a real ESM (.mjs) file with NO top-level await WORKS (Node >=22.12): add(2, 3) = ${esm.add(2, 3)}, PI = ${esm.PI}`);

// try/catch here on purpose: this require() call is EXPECTED to throw,
// because async-tla.mjs contains a real top-level await, and require() is
// synchronous by design — it cannot pause and wait for anything.
try {
  require("./async-tla.mjs");
} catch (err) {
  // err.code is the specific error name Node gives this failure —
  // ERR_REQUIRE_ASYNC_MODULE, not the older, more general ERR_REQUIRE_ESM.
  console.log(pc.yellow("3)") + ` require() of an ESM file that HAS top-level await still throws: ${err.code} - ${err.message.split("\n")[0]}`);
}

// An async IIFE (a function that runs itself immediately) — needed here
// only because top-level await isn't allowed in a CommonJS file like this
// one. Inside a real function, await is always fine.
(async () => {
  // dynamic import() always returns a real Promise, so it can be awaited —
  // this is the ONE way to load a top-level-await file from CommonJS.
  const tla = await import("./async-tla.mjs");
  console.log(pc.green("4)") + ` dynamic import() of that same top-level-await file WORKS: ${tla.value}`);
})();
