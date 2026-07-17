// An interface is TypeScript's way of describing the SHAPE an object must
// have — this one says "an object with a number called sum, and a tuple of
// exactly two numbers called inputs." No object like this exists until
// add() below actually creates one.
export interface AddResult {
  sum: number;
  inputs: [number, number];
}

// A typed function: a and b must both be real numbers, and TypeScript
// checks (at compile/type-check time only) that whatever this returns
// really does match the AddResult shape above.
export function add(a: number, b: number): AddResult {
  return { sum: a + b, inputs: [a, b] };
}
