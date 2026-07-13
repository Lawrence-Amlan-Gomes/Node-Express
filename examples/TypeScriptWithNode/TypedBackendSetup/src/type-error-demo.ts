import { add } from "./math.ts";

// Deliberately wrong argument types (add expects number, number) — no
// suppression, no assertion. The point is to let tsc actually report this for
// real, while proving node itself runs the file anyway.
const result = add("2", "3");
console.log(`add("2", "3") ran anyway => sum: ${result.sum}`);
