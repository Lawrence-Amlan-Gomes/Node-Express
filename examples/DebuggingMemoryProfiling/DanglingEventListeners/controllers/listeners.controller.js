import broadcaster from "../broadcaster.js";

// THE BUG: a real, easy-to-write mistake — registering a listener INSIDE
// a route handler. Every single request adds ONE MORE real listener to
// "update-buggy" that is NEVER removed, because nothing ever calls
// broadcaster.off() for it. After enough requests, this really does leak
// — each listener closure keeps its own memory alive forever.
export function subscribeBuggy(req, res) {
  broadcaster.on("update-buggy", () => {});
  res.json({ event: "update-buggy", listenerCount: broadcaster.listenerCount("update-buggy") });
}

// THE FIX: the listener for "update-fixed" is registered ONCE, at module
// load time below (outside any route handler) — so this route can be hit
// any number of times without ever adding a second one.
broadcaster.on("update-fixed", () => {});

export function subscribeFixed(req, res) {
  res.json({ event: "update-fixed", listenerCount: broadcaster.listenerCount("update-fixed") });
}

export function listenerCounts(req, res) {
  res.json({
    buggy: broadcaster.listenerCount("update-buggy"),
    fixed: broadcaster.listenerCount("update-fixed"),
  });
}
