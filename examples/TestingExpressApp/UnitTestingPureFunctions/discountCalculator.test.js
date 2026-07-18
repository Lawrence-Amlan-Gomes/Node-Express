// Jest gives you three main building blocks:
//   describe(name, fn)  — groups related tests together, just for
//                          readable output. Purely organizational.
//   test(name, fn)      — one real test case. ("it" is an alias for
//                          "test" — same thing, some teams prefer it.)
//   expect(value).toBe(x) and friends — the real assertion. If the
//                          real value doesn't match, Jest fails the
//                          test and shows you exactly what it got
//                          instead of what you expected.
import { calculateDiscountedPrice, formatCurrency } from "./discountCalculator.js";

describe("calculateDiscountedPrice()", () => {
  test("applies a normal discount correctly", () => {
    // $20.00 (2000 cents) with 25% off should really become $15.00 (1500 cents).
    expect(calculateDiscountedPrice(2000, 25)).toBe(1500);
  });

  test("0% discount returns the original price, unchanged", () => {
    // No real discount at all — the real output must equal the real input.
    expect(calculateDiscountedPrice(2000, 0)).toBe(2000);
  });

  test("100% discount returns 0", () => {
    // A full real discount — the real price genuinely drops to zero.
    expect(calculateDiscountedPrice(2000, 100)).toBe(0);
  });

  // Testing that BAD input is correctly rejected matters just as
  // much as testing the happy path — a real function that silently
  // accepts nonsense input is a real production bug waiting to
  // happen. toThrow() checks that calling the function really does
  // throw a real Error.
  test("rejects a discount percent above 100", () => {
    // Wrapped in an arrow function — toThrow() needs to call it itself to catch the real throw.
    expect(() => calculateDiscountedPrice(2000, 150)).toThrow();
  });

  test("rejects a negative discount percent", () => {
    // Same real pattern — a negative percent makes no real sense either.
    expect(() => calculateDiscountedPrice(2000, -10)).toThrow();
  });
});

describe("formatCurrency()", () => {
  test("formats whole-dollar cents with two decimal places", () => {
    // 2000 real cents should really print as "$20.00", not "$20".
    expect(formatCurrency(2000)).toBe("$20.00");
  });

  test("formats an amount with real cents correctly", () => {
    // 1550 real cents should really print as "$15.50".
    expect(formatCurrency(1550)).toBe("$15.50");
  });
});
