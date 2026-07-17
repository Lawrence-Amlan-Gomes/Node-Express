// A plain CommonJS function — nothing special about the function itself,
// only about how it gets shared below.
function multiply(a, b) {
  return a * b;
}

// module.exports is how a CommonJS file (.cjs, or a plain .js file when
// package.json's "type" is "commonjs" or missing) shares things with
// whoever calls require() on it.
module.exports = { multiply };
