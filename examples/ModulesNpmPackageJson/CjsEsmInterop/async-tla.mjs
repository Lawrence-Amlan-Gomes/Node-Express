// A "top-level await" — an await that sits OUTSIDE any function, right at
// the top of the file. Only ES Modules (.mjs, or "type": "module") allow
// this. CommonJS (.cjs) cannot do this at all.
await new Promise((resolve) => setTimeout(resolve, 1));

// This line only runs AFTER the await above finishes — proving the file
// really did pause here before exporting anything.
export const value = "loaded after a real top-level await";
