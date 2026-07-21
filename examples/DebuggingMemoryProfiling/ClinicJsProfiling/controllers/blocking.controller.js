// A real, deliberately blocking route — a synchronous loop that eats the
// event loop for a real 50ms on every request. This is exactly the kind
// of real bug Clinic Doctor is built to catch: something that LOOKS fine
// in a code review but genuinely slows down every other request while
// it's running, because Node has only one thread for JS.
export function blocking(req, res) {
  const start = Date.now();
  while (Date.now() - start < 50) {
    // deliberately busy — nothing async here to yield the event loop
  }
  res.json({ blocked: true, tookMs: Date.now() - start });
}
