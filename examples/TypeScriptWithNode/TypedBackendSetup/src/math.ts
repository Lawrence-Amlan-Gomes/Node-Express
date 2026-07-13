export interface AddResult {
  sum: number;
  inputs: [number, number];
}

export function add(a: number, b: number): AddResult {
  return { sum: a + b, inputs: [a, b] };
}
