// Synchronous code runs first, top to bottom, before anything below can run.
// This line prints immediately, no waiting.
console.log("1: synchronous - start");

// setTimeout schedules a callback for the "timers" phase of the event loop.
// Even with 0ms, it does NOT run now — it waits its turn in that phase.
setTimeout(() => console.log("5: setTimeout (macrotask, 0ms)"), 0);

// setImmediate schedules a callback for the "check" phase of the event loop —
// a phase that only exists in Node, not in browsers.
setImmediate(() => console.log("6: setImmediate"));

// Promise.resolve() creates an already-resolved promise. Its .then() callback
// goes on the MICROTASK queue, which is separate from (and runs before) both
// setTimeout and setImmediate above.
Promise.resolve().then(() => console.log("3: Promise.then (microtask)"));

// queueMicrotask puts a callback directly on that same microtask queue —
// same priority as a Promise's .then(), just a more direct API for it.
queueMicrotask(() => console.log("4: queueMicrotask (microtask)"));

// Still synchronous code — runs right after line 1, before anything scheduled
// above gets a turn, since the whole synchronous script finishes first.
console.log("2: synchronous - end");

// Real order this produces: 1, 2 (sync code, in order) -> 3, 4 (microtasks,
// fully drain before anything else) -> 5, 6 (the actual event loop phases —
// see the "New Territory" section on the page for why 5 and 6 can swap order
// here, but never once you're already inside a real I/O callback).
