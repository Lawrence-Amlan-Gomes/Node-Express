const pc = require("picocolors");
const { multiply } = require("./math.cjs");

// picocolors is a real npm dependency (see this folder's own package.json /
// package-lock.json) used here for real, not just installed for show — it
// colors every line this script actually prints below.
console.log(pc.cyan("1)") + ` require() of a real CommonJS module: multiply(3, 4) = ${multiply(3, 4)}`);

const esm = require("./math.mjs");
console.log(pc.cyan("2)") + ` require() of a real ESM (.mjs) file with NO top-level await WORKS (Node >=22.12): add(2, 3) = ${esm.add(2, 3)}, PI = ${esm.PI}`);

try {
  require("./async-tla.mjs");
} catch (err) {
  console.log(pc.yellow("3)") + ` require() of an ESM file that HAS top-level await still throws: ${err.code} - ${err.message.split("\n")[0]}`);
}

(async () => {
  const tla = await import("./async-tla.mjs");
  console.log(pc.green("4)") + ` dynamic import() of that same top-level-await file WORKS: ${tla.value}`);
})();
