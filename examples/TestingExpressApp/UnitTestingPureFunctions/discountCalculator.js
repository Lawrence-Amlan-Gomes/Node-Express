// A "pure function" is a function whose answer depends ONLY on the
// inputs you give it — no database, no network call, no reading a
// file, no server. Same inputs in, same answer out, every single
// time. That's what makes pure functions the easiest, fastest thing
// to unit test: you don't need a real server running at all, you
// just call the function directly and check the answer.

// Turns a price and a discount percent into the real discounted
// price. Throws a real Error if the discount percent doesn't make
// sense (below 0% or above 100%), instead of silently returning a
// wrong number.
export function calculateDiscountedPrice(priceInCents, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    // Bad input — throw a real Error instead of quietly computing a nonsense price.
    throw new Error(`discountPercent must be between 0 and 100, got ${discountPercent}`);
  }
  // Round to the nearest whole cent — never leave a fractional cent lying around.
  const discountAmount = Math.round(priceInCents * (discountPercent / 100));
  // The real final price: the original minus the real discount amount.
  return priceInCents - discountAmount;
}

// Turns a raw number of cents (always work in whole cents internally
// — never floating-point dollars, they round unpredictably) into a
// real, human-readable price string like "$12.50".
export function formatCurrency(cents) {
  // Convert real whole cents into a real dollar string with 2 decimal places.
  const dollars = (cents / 100).toFixed(2);
  // Prefix with a real "$" — this is the exact string a real UI would display.
  return `$${dollars}`;
}
