// Written as "./math.ts" — the real file extension. Node's own module
// resolver (module: "nodenext" in tsconfig.json) requires this. tsc
// rewrites it to "./math.js" only in the compiled dist/ output.
import { add } from "./math.js";
// A real typed call — TypeScript checks at type-check time that 2 and 3
// are both numbers, matching what add() expects.
const result = add(2, 3);
console.log(`Typed add(2, 3) => sum: ${result.sum}, inputs: [${result.inputs.join(", ")}]`);
