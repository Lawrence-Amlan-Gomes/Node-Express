// Real server-side state, deliberately attached to globalThis (not just a
// module-scope variable) — a debugger session evaluates expressions in the
// process's GLOBAL scope, so anything it needs to read live has to live
// there too. This is the same real distinction as "global vs module scope"
// in plain JS, just made visible by what a debugger can actually reach.
globalThis.__requestCount = 0;

// A real, small computation — proves the debugger can read state that
// changes because of REAL work this route actually did, not a hardcoded
// number.
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

export function compute(req, res) {
  const n = Number(req.query.n ?? 10);
  const result = fibonacci(n);
  globalThis.__requestCount += 1;
  res.json({ n, result, requestCount: globalThis.__requestCount });
}
