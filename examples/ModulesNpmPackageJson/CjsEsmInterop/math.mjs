// The export keyword is ES Modules' way of sharing something — this line
// both defines the function AND makes it available to whoever imports this
// file. There is no separate "exports" object like CommonJS has.
export function add(a, b) {
  return a + b;
}

// A plain exported constant, same export keyword, works on any value.
export const PI = 3.14159;
