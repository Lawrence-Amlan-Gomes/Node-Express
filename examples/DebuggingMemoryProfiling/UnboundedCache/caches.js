// Two real, separate in-memory caches, both plain Maps — the only real
// difference between them is whether anything ever removes an entry.
export const cacheBuggy = new Map();
export const cacheFixed = new Map();

// A real, small cap — in a real app this would be hundreds or thousands,
// kept tiny here so the eviction actually happens within a normal demo.
export const MAX_FIXED_ENTRIES = 5;
