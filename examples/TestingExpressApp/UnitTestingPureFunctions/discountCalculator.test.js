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
    // $20.00 (2000 cents) with 25% off should really become $15.00.
    expect(calculateDiscountedPrice(2000, 25)).toBe(1500);
  });

  test("0% discount returns the original price, unchanged", () => {
    expect(calculateDiscountedPrice(2000, 0)).toBe(2000);
  });

  test("100% discount returns 0", () => {
    expect(calculateDiscountedPrice(2000, 100)).toBe(0);
  });

  // Testing that BAD input is correctly rejected matters just as
  // much as testing the happy path — a real function that silently
  // accepts nonsense input is a real production bug waiting to
  // happen. toThrow() checks that calling the function really does
  // throw a real Error.
  test("rejects a discount percent above 100", () => {
    expect(() => calculateDiscountedPrice(2000, 150)).toThrow();
  });

  test("rejects a negative discount percent", () => {
    expect(() => calculateDiscountedPrice(2000, -10)).toThrow();
  });
});

describe("formatCurrency()", () => {
  test("formats whole-dollar cents with two decimal places", () => {
    expect(formatCurrency(2000)).toBe("$20.00");
  });

  test("formats an amount with real cents correctly", () => {
    expect(formatCurrency(1550)).toBe("$15.50");
  });
});
