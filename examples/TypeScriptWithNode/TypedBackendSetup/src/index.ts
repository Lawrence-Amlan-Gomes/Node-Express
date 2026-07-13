import { add } from "./math.ts";

const result = add(2, 3);
console.log(`Typed add(2, 3) => sum: ${result.sum}, inputs: [${result.inputs.join(", ")}]`);
