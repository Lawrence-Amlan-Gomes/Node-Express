// A typed function: a and b must both be real numbers, and TypeScript
// checks (at compile/type-check time only) that whatever this returns
// really does match the AddResult shape above.
export function add(a, b) {
    return { sum: a + b, inputs: [a, b] };
}
