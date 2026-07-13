console.log("1: synchronous - start");

setTimeout(() => console.log("5: setTimeout (macrotask, 0ms)"), 0);

setImmediate(() => console.log("6: setImmediate"));

Promise.resolve().then(() => console.log("3: Promise.then (microtask)"));

queueMicrotask(() => console.log("4: queueMicrotask (microtask)"));

console.log("2: synchronous - end");
