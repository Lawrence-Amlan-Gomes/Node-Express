import { add } from "./math.ts";

// Deliberately wrong: add() expects two numbers, but "2" and "3" are
// strings. No suppression, no assertion — left as a real, genuine type
// error on purpose, so tsc can actually catch it for real in the demo.
const result = add("2", "3");

// Because node only STRIPS types (never checks them), this line still
// runs — "2" + "3" does real string concatenation ("23"), not addition,
// and prints a wrong-but-plausible-looking result.
console.log(`add("2", "3") ran anyway => sum: ${result.sum}`);
